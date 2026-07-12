import os
import shutil

# Copy images
brain_dir = r'C:\Users\konje\.gemini\antigravity-ide\brain\608e7ef4-bb10-45b0-b0c1-82f84775250a'
public_dir = r'c:\Users\konje\VirtualTryOn\VirtualTryOn\frontend\public\products'

img_l = os.path.join(brain_dir, 'media__1783786300984.jpg')
img_xl = os.path.join(brain_dir, 'media__1783786301028.jpg')
img_xxl = os.path.join(brain_dir, 'media__1783786301048.jpg')

dest_l = os.path.join(public_dir, 'mint_green_saree_L.png')
dest_xl = os.path.join(public_dir, 'mint_green_saree_XL.png')
dest_xxl = os.path.join(public_dir, 'mint_green_saree_XXL.png')

shutil.copy2(img_l, dest_l)
shutil.copy2(img_xl, dest_xl)
shutil.copy2(img_xxl, dest_xxl)

# Add to products.js
mock_dir = r'c:\Users\konje\VirtualTryOn\VirtualTryOn\frontend\src\mock'
products_file = os.path.join(mock_dir, 'products.js')

with open(products_file, 'r', encoding='utf-8') as f:
    text = f.read()

new_product = """  {
    id: "mint_green_saree",
    name: "Mint Green Silk Saree",
    brand: "VirtualFit AI",
    price: 18999,
    originalPrice: 22000,
    discount: 13,
    rating: 4.9,
    reviewCount: 340,
    gender: "Women",
    category: "Saree",
    description: "Exquisite mint green silk saree with detailed motifs. Available in multiple sizes.",
    image: "/products/mint_green_saree.png",
    hasSizes: true,
    tags: ["Saree", "Women", "Festive", "Green"]
  },
"""

text = text.replace('export const products = [', 'export const products = [\n' + new_product)

with open(products_file, 'w', encoding='utf-8') as f:
    f.write(text)

print('Successfully added the new Mint Green Saree to products and copied the images!')
