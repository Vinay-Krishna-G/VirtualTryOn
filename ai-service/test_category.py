import requests

url = "http://localhost:8000/api/try-on"

# Create a small valid JPEG dummy image to bypass the image.verify() step
from PIL import Image
import io
img = Image.new('RGB', (256, 256), color = 'red')
img_byte_arr = io.BytesIO()
img.save(img_byte_arr, format='JPEG')
img_bytes = img_byte_arr.getvalue()

files = {
    "person_image": ("person.jpg", img_bytes, "image/jpeg"),
    "garment_image": ("garment.jpg", img_bytes, "image/jpeg"),
}
data = {
    "product_id": "blue_cotton_shirt_XL"
}

print("Sending request for product_id: blue_cotton_shirt_XL")
resp = requests.post(url, files=files, data=data)
print(resp.status_code)
print(resp.json())

# Let's do another one to test lehenga
files2 = {
    "person_image": ("person.jpg", img_bytes, "image/jpeg"),
    "garment_image": ("garment.jpg", img_bytes, "image/jpeg"),
}
data2 = {
    "product_id": "designer_lehenga"
}

print("\nSending request for product_id: designer_lehenga")
resp2 = requests.post(url, files=files2, data=data2)
print(resp2.status_code)
print(resp2.json())
