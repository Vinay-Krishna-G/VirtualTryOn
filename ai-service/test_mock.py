import urllib.request
import os

boundary = 'BOUNDARY123456'

def encode_file(field, filepath):
    with open(filepath, 'rb') as f:
        data = f.read()
    filename = os.path.basename(filepath)
    part = (
        f'--{boundary}\r\n'
        f'Content-Disposition: form-data; name="{field}"; filename="{filename}"\r\n'
        f'Content-Type: image/jpeg\r\n\r\n'
    ).encode() + data + b'\r\n'
    return part

def encode_field(field, value):
    return (
        f'--{boundary}\r\n'
        f'Content-Disposition: form-data; name="{field}"\r\n\r\n'
        f'{value}\r\n'
    ).encode()

body = (
    encode_file('person_image', 'test_person.jpg') +
    encode_file('garment_image', 'test_garment.jpg') +
    encode_field('product_id', 'red-silk-saree') +
    f'--{boundary}--\r\n'.encode()
)

req = urllib.request.Request(
    'http://localhost:8000/generate',
    data=body,
    headers={'Content-Type': f'multipart/form-data; boundary={boundary}'},
    method='POST'
)
try:
    resp = urllib.request.urlopen(req, timeout=15)
    png = resp.read()
    with open('result_mock.png', 'wb') as f:
        f.write(png)
    print(f'SUCCESS! Status={resp.status} | Content-Type={resp.headers["Content-Type"]} | Size={len(png)} bytes')
    print('Saved: result_mock.png')
except Exception as e:
    print(f'FAILED: {e}')
