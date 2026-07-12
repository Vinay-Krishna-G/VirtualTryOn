import re
import shutil
import os

public_dir = r'c:\Users\konje\VirtualTryOn\VirtualTryOn\frontend\public\products'
mock_dir = r'c:\Users\konje\VirtualTryOn\VirtualTryOn\frontend\src\mock'
products_file = os.path.join(mock_dir, 'products.js')

# Distinct Image Paths
distinct = {
    'saree': {
        'L': os.path.join(public_dir, 'size_test_saree_L.png'),
        'XL': os.path.join(public_dir, 'size_test_saree_XL.png'),
        'XXL': os.path.join(public_dir, 'size_test_saree_XXL.png'),
    },
    'kurti': {
        'L': r'C:\Users\konje\.gemini\antigravity-ide\brain\608e7ef4-bb10-45b0-b0c1-82f84775250a\kurti_l_1783782496404.png',
        'XL': r'C:\Users\konje\.gemini\antigravity-ide\brain\608e7ef4-bb10-45b0-b0c1-82f84775250a\kurti_xl_1783782505772.png',
        'XXL': r'C:\Users\konje\.gemini\antigravity-ide\brain\608e7ef4-bb10-45b0-b0c1-82f84775250a\kurti_xxl_1783782516629.png',
    },
    'blazer': {
        'L': r'C:\Users\konje\.gemini\antigravity-ide\brain\608e7ef4-bb10-45b0-b0c1-82f84775250a\blazer_l_1783783603787.png',
        'XL': r'C:\Users\konje\.gemini\antigravity-ide\brain\608e7ef4-bb10-45b0-b0c1-82f84775250a\blazer_xl_1783783612027.png',
        'XXL': r'C:\Users\konje\.gemini\antigravity-ide\brain\608e7ef4-bb10-45b0-b0c1-82f84775250a\blazer_xxl_1783783623006.png',
    },
    'jeans': {
        'L': r'C:\Users\konje\.gemini\antigravity-ide\brain\608e7ef4-bb10-45b0-b0c1-82f84775250a\jeans_l_1783782607061.png',
        'XL': r'C:\Users\konje\.gemini\antigravity-ide\brain\608e7ef4-bb10-45b0-b0c1-82f84775250a\jeans_xl_1783782616311.png',
        'XXL': r'C:\Users\konje\.gemini\antigravity-ide\brain\608e7ef4-bb10-45b0-b0c1-82f84775250a\jeans_xxl_1783782625521.png',
    }
}

with open(products_file, 'r', encoding='utf-8') as f:
    text = f.read()

products = re.finditer(r'id:\s*\"(.*?)\".*?category:\s*\"(.*?)\"', text, re.DOTALL)

for p in products:
    pid = p.group(1)
    cat = p.group(2).lower()
    
    if pid == 'size_test_saree':
        continue
        
    src_set = distinct['kurti'] # default
    if 'saree' in cat or 'lehenga' in cat:
        src_set = distinct['saree']
    elif 'kurti' in cat or 'kurta' in cat:
        src_set = distinct['kurti']
    elif 'jeans' in cat:
        src_set = distinct['jeans']
    elif 'shirt' in cat or 'top' in cat or 'blazer' in cat:
        src_set = distinct['blazer']
        
    for size in ['L', 'XL', 'XXL']:
        dest_path = os.path.join(public_dir, f'{pid}_{size}.png')
        src_img = src_set[size]
        if os.path.exists(src_img):
            shutil.copy2(src_img, dest_path)
            print(f'Overwrote {dest_path}')
        else:
            print(f'Missing distinct source: {src_img}')

print('Applied distinct models to all products!')
