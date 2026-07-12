import re
import shutil
import os

mock_dir = r'c:\Users\konje\VirtualTryOn\VirtualTryOn\frontend\src\mock'
products_file = os.path.join(mock_dir, 'products.js')
public_dir = r'c:\Users\konje\VirtualTryOn\VirtualTryOn\frontend\public\products'

with open(products_file, 'r', encoding='utf-8') as f:
    text = f.read()

# Find all products and their images
products = re.finditer(r'id:\s*\"(.*?)\".*?image:\s*\"/products/(.*?)\"', text, re.DOTALL)

for p in products:
    pid = p.group(1)
    img_name = p.group(2)
    
    # skip the one we originally did perfectly
    if pid == 'size_test_saree':
        continue
        
    src_path = os.path.join(public_dir, img_name)
    if os.path.exists(src_path):
        for size in ['L', 'XL', 'XXL']:
            dest_path = os.path.join(public_dir, f'{pid}_{size}.png')
            # Force overwrite to restore the correct original garment image
            shutil.copy2(src_path, dest_path)
            print(f'Restored {src_path} -> {dest_path}')
    else:
        print(f'Missing image: {src_path}')

print('Restored all product size variants to their correct original clothing!')
