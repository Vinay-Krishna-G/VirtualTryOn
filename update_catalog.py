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
    
    # skip the one we already manually did
    if pid == 'size_test_saree':
        continue
        
    src_path = os.path.join(public_dir, img_name)
    if os.path.exists(src_path):
        for size in ['L', 'XL', 'XXL']:
            dest_path = os.path.join(public_dir, f'{pid}_{size}.png')
            if not os.path.exists(dest_path):
                shutil.copy2(src_path, dest_path)
                print(f'Copied {src_path} -> {dest_path}')
    else:
        print(f'Missing image: {src_path}')

# Now modify the JS to inject hasSizes: true for everything that doesn\'t have it
def add_has_sizes(match):
    body = match.group(0)
    if 'hasSizes: true' not in body:
        # insert before tags or end of object
        if 'tags:' in body:
            body = body.replace('tags:', 'hasSizes: true,\n    tags:')
        else:
            body = body.replace('},', '  hasSizes: true,\n  },')
    return body

# We regex match the product objects
new_text = re.sub(r'{\s*id:\s*\"(.*?)\".*?(?:tags:.*?],|})', add_has_sizes, text, flags=re.DOTALL)

with open(products_file, 'w', encoding='utf-8') as f:
    f.write(new_text)

print('Updated products.js successfully!')
