import os
import shutil

# Copy images
brain_dir = r'C:\Users\konje\.gemini\antigravity-ide\brain\608e7ef4-bb10-45b0-b0c1-82f84775250a'
public_dir = r'c:\Users\konje\VirtualTryOn\VirtualTryOn\frontend\public\products'

img_1 = os.path.join(brain_dir, 'media__1783788648797.jpg')

dest_l = os.path.join(public_dir, 'm_suit_black_L.png')
dest_xl = os.path.join(public_dir, 'm_suit_black_XL.png')
dest_xxl = os.path.join(public_dir, 'm_suit_black_XXL.png')
dest_base = os.path.join(public_dir, 'm_suit_black.png')

# Just copy the one image to all slots for now so nothing breaks, we will ask the user for the other
shutil.copy2(img_1, dest_l)
shutil.copy2(img_1, dest_xl)
shutil.copy2(img_1, dest_xxl)
shutil.copy2(img_1, dest_base)

# Add to products.js
mock_dir = r'c:\Users\konje\VirtualTryOn\VirtualTryOn\frontend\src\mock'
products_file = os.path.join(mock_dir, 'products.js')

with open(products_file, 'r', encoding='utf-8') as f:
    text = f.read()

new_product = """  {
    id: "m_suit_black",
    name: "Classic Black Suit",
    brand: "VirtualFit AI",
    price: 15999,
    originalPrice: 19999,
    discount: 20,
    rating: 4.8,
    reviewCount: 420,
    gender: "Men",
    category: "Suit",
    description: "A premium classic black suit. Perfect for formal occasions.",
    image: "/products/m_suit_black.png",
    hasSizes: true,
    tags: ["Suit", "Men", "Formal", "Black"]
  },
"""

text = text.replace('export const products = [', 'export const products = [\n' + new_product)

with open(products_file, 'w', encoding='utf-8') as f:
    f.write(text)

print('Successfully added the new Black Suit to products!')
