import requests

url = "http://localhost:8000/generate"
img_path = r"C:\Users\konje\OneDrive\Desktop\Mummy 2.jpeg"
files = {
    "person_image": ("mummy.jpg", open(img_path, "rb"), "image/jpeg"),
    "garment_image": ("garment.jpg", open(img_path, "rb"), "image/jpeg")
}
data = {"product_id": "test"}

res = requests.post(url, files=files, data=data)
print(res.status_code)
print(res.text)

