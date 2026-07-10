import asyncio
import os
import httpx
from openai import AsyncOpenAI
import time
from dotenv import load_dotenv

load_dotenv(dotenv_path="ai-service/.env")

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 5 categories, 10 products each = 50 products total
PRODUCTS = [
    # SAREES
    {"id": "saree-silk-red", "name": "Red Silk Saree", "category": "Saree", "description": "Luxurious Banarasi silk with intricate gold zari work", "tags": ["Silk", "Festive", "Traditional"]},
    {"id": "saree-cotton-blue", "name": "Blue Cotton Saree", "category": "Saree", "description": "Breezy cotton weave with delicate white border pattern", "tags": ["Cotton", "Casual", "Lightweight"]},
    {"id": "saree-georgette-peach", "name": "Peach Designer Saree", "category": "Saree", "description": "Peach georgette with sequin embroidery for parties", "tags": ["Party Wear", "Sequin", "Georgette"]},
    {"id": "saree-kanjivaram-green", "name": "Green Kanjivaram Saree", "category": "Saree", "description": "Rich emerald Kanjivaram silk with golden temple border", "tags": ["Silk", "Kanjivaram", "Traditional"]},
    {"id": "saree-chiffon-purple", "name": "Purple Chiffon Saree", "category": "Saree", "description": "Royal violet chiffon with silver embroidery border", "tags": ["Party Wear", "Chiffon", "Embroidery"]},
    {"id": "saree-linen-white", "name": "White Linen Saree", "category": "Saree", "description": "Minimalist white linen saree with a thin black border", "tags": ["Linen", "Minimalist", "Formal"]},
    {"id": "saree-net-black", "name": "Black Net Saree", "category": "Saree", "description": "Glamorous black net saree with heavy stone work", "tags": ["Party Wear", "Net", "Glamour"]},
    {"id": "saree-organza-pink", "name": "Pink Organza Saree", "category": "Saree", "description": "Soft pink organza saree with floral print", "tags": ["Organza", "Floral", "Daywear"]},
    {"id": "saree-bandhani-yellow", "name": "Yellow Bandhani Saree", "category": "Saree", "description": "Bright yellow traditional Rajasthani bandhani saree", "tags": ["Bandhani", "Festive", "Traditional"]},
    {"id": "saree-velvet-maroon", "name": "Maroon Velvet Saree", "category": "Saree", "description": "Heavy maroon velvet saree for winter weddings", "tags": ["Velvet", "Winter", "Bridal"]},

    # LEHENGAS
    {"id": "lehenga-bridal-red", "name": "Red Bridal Lehenga", "category": "Lehenga", "description": "Opulent red bridal lehenga with heavy gold embroidery", "tags": ["Bridal", "Embroidery", "Premium"]},
    {"id": "lehenga-pastel-pink", "name": "Pastel Pink Lehenga", "category": "Lehenga", "description": "Soft pastel pink lehenga with silver mirror work", "tags": ["Pastel", "Mirror Work", "Bridesmaid"]},
    {"id": "lehenga-velvet-blue", "name": "Navy Blue Velvet Lehenga", "category": "Lehenga", "description": "Rich navy blue velvet lehenga with zardozi work", "tags": ["Velvet", "Winter", "Reception"]},
    {"id": "lehenga-floral-white", "name": "White Floral Lehenga", "category": "Lehenga", "description": "Lightweight white organza lehenga with large floral prints", "tags": ["Floral", "Organza", "Day Wedding"]},
    {"id": "lehenga-silk-green", "name": "Green Silk Lehenga", "category": "Lehenga", "description": "Emerald green Banarasi silk lehenga with a matching dupatta", "tags": ["Silk", "Banarasi", "Festive"]},
    {"id": "lehenga-net-black", "name": "Black Net Lehenga", "category": "Lehenga", "description": "Stunning black net lehenga with sequin detailing", "tags": ["Party Wear", "Net", "Glamour"]},
    {"id": "lehenga-georgette-yellow", "name": "Yellow Haldi Lehenga", "category": "Lehenga", "description": "Bright yellow georgette lehenga perfect for Haldi ceremonies", "tags": ["Haldi", "Georgette", "Festive"]},
    {"id": "lehenga-chikankari-peach", "name": "Peach Chikankari Lehenga", "category": "Lehenga", "description": "Elegant peach lehenga with intricate Lucknowi chikankari", "tags": ["Chikankari", "Elegant", "Traditional"]},
    {"id": "lehenga-satin-purple", "name": "Purple Satin Lehenga", "category": "Lehenga", "description": "Smooth purple satin lehenga with a modern off-shoulder blouse", "tags": ["Satin", "Modern", "Party"]},
    {"id": "lehenga-brocade-gold", "name": "Gold Brocade Lehenga", "category": "Lehenga", "description": "Classic gold brocade lehenga for a royal look", "tags": ["Brocade", "Royal", "Premium"]},

    # KURTIS
    {"id": "kurti-printed-teal", "name": "Teal Printed Kurti", "category": "Kurti", "description": "Teal floral block-print kurti, perfect for daily wear", "tags": ["Block Print", "Casual", "Daily Wear"]},
    {"id": "kurti-cotton-white", "name": "White Cotton Kurti", "category": "Kurti", "description": "Simple white cotton kurti for summer comfort", "tags": ["Cotton", "Summer", "Casual"]},
    {"id": "kurti-silk-maroon", "name": "Maroon Silk Kurti", "category": "Kurti", "description": "Festive maroon silk kurti with minimal gold embroidery", "tags": ["Silk", "Festive", "Elegant"]},
    {"id": "kurti-chikankari-yellow", "name": "Yellow Chikankari Kurti", "category": "Kurti", "description": "Vibrant yellow kurti featuring traditional chikankari embroidery", "tags": ["Chikankari", "Daywear", "Traditional"]},
    {"id": "kurti-denim-blue", "name": "Blue Denim Kurti", "category": "Kurti", "description": "Modern blue denim kurti for a fusion look", "tags": ["Denim", "Fusion", "Casual"]},
    {"id": "kurti-georgette-black", "name": "Black Georgette Kurti", "category": "Kurti", "description": "Flowy black georgette kurti with a side slit", "tags": ["Georgette", "Party Wear", "Flowy"]},
    {"id": "kurti-ikat-green", "name": "Green Ikat Kurti", "category": "Kurti", "description": "Handloom green ikat kurti with a straight cut", "tags": ["Ikat", "Handloom", "Work Wear"]},
    {"id": "kurti-crepe-pink", "name": "Pink Crepe Kurti", "category": "Kurti", "description": "Wrinkle-free pink crepe kurti for everyday office wear", "tags": ["Crepe", "Work Wear", "Low Maintenance"]},
    {"id": "kurti-anarkali-orange", "name": "Orange Anarkali Kurti", "category": "Kurti", "description": "Flared orange anarkali style kurti with tassels", "tags": ["Flared", "Festive", "Casual"]},
    {"id": "kurti-linen-beige", "name": "Beige Linen Kurti", "category": "Kurti", "description": "Earthy beige linen kurti with wooden buttons", "tags": ["Linen", "Earthy", "Minimalist"]},

    # SUITS (Salwar Kameez, Anarkali Suits)
    {"id": "suit-anarkali-blue", "name": "Blue Anarkali Suit", "category": "Suit", "description": "Floor-length royal blue Anarkali with gold embroidery", "tags": ["Festive", "Embroidery", "Full Length"]},
    {"id": "suit-punjabi-pink", "name": "Pink Punjabi Suit", "category": "Suit", "description": "Vibrant pink Punjabi Patiala suit with a heavy phulkari dupatta", "tags": ["Punjabi", "Patiala", "Traditional"]},
    {"id": "suit-palazzo-green", "name": "Green Palazzo Suit", "category": "Suit", "description": "Comfortable green palazzo suit with a straight kameez", "tags": ["Palazzo", "Comfort", "Casual"]},
    {"id": "suit-sharara-yellow", "name": "Yellow Sharara Suit", "category": "Suit", "description": "Festive yellow sharara suit with mirror work detailing", "tags": ["Sharara", "Festive", "Mirror Work"]},
    {"id": "suit-silk-red", "name": "Red Silk Suit", "category": "Suit", "description": "Classic red silk salwar kameez for traditional events", "tags": ["Silk", "Traditional", "Festive"]},
    {"id": "suit-cotton-white", "name": "White Cotton Suit", "category": "Suit", "description": "Simple white cotton suit with a floral printed dupatta", "tags": ["Cotton", "Summer", "Casual"]},
    {"id": "suit-churidar-black", "name": "Black Churidar Suit", "category": "Suit", "description": "Elegant black churidar suit with long sleeves", "tags": ["Churidar", "Elegant", "Formal"]},
    {"id": "suit-georgette-peach", "name": "Peach Georgette Suit", "category": "Suit", "description": "Flowy peach georgette suit with delicate embroidery", "tags": ["Georgette", "Flowy", "Elegant"]},
    {"id": "suit-velvet-maroon", "name": "Maroon Velvet Suit", "category": "Suit", "description": "Warm maroon velvet suit perfect for winter occasions", "tags": ["Velvet", "Winter", "Premium"]},
    {"id": "suit-fusion-grey", "name": "Grey Fusion Suit", "category": "Suit", "description": "Modern grey fusion suit with a peplum top and dhoti pants", "tags": ["Fusion", "Modern", "Party Wear"]},

    # WESTERN (Dresses, Shirts, Tops)
    {"id": "western-shirt-white", "name": "White Oxford Shirt", "category": "Western", "description": "Classic button-down white Oxford shirt", "tags": ["Formal", "Women's", "Cotton"]},
    {"id": "western-blazer-black", "name": "Black Slim Blazer", "category": "Western", "description": "Sleek single-breasted slim fit black blazer", "tags": ["Formal", "Women's", "Premium"]},
    {"id": "western-dress-red", "name": "Red Wrap Dress", "category": "Western", "description": "Elegant red wrap dress with a V-neckline", "tags": ["Dress", "Party", "Elegant"]},
    {"id": "western-jeans-blue", "name": "Blue Denim Jeans", "category": "Western", "description": "High-waisted straight leg blue denim jeans", "tags": ["Denim", "Casual", "Bottoms"]},
    {"id": "western-top-floral", "name": "Floral Chiffon Top", "category": "Western", "description": "Lightweight floral chiffon blouse with sheer sleeves", "tags": ["Top", "Casual", "Floral"]},
    {"id": "western-skirt-black", "name": "Black Leather Skirt", "category": "Western", "description": "Edgy black faux leather mini skirt", "tags": ["Skirt", "Party", "Edgy"]},
    {"id": "western-sweater-beige", "name": "Beige Knit Sweater", "category": "Western", "description": "Cozy oversized beige knit sweater", "tags": ["Winter", "Cozy", "Casual"]},
    {"id": "western-jumpsuit-navy", "name": "Navy Blue Jumpsuit", "category": "Western", "description": "Sophisticated navy blue jumpsuit with a belted waist", "tags": ["Jumpsuit", "Formal", "Chic"]},
    {"id": "western-tshirt-striped", "name": "Striped Cotton T-Shirt", "category": "Western", "description": "Classic black and white striped cotton t-shirt", "tags": ["T-Shirt", "Casual", "Everyday"]},
    {"id": "western-jacket-denim", "name": "Classic Denim Jacket", "category": "Western", "description": "Vintage wash blue denim jacket", "tags": ["Jacket", "Outerwear", "Casual"]},
]

OUTPUT_DIR = "frontend/public/products"
os.makedirs(OUTPUT_DIR, exist_ok=True)

async def generate_image(client, product):
    filepath = os.path.join(OUTPUT_DIR, f"{product['id']}.png")
    if os.path.exists(filepath):
        print(f"Skipping {product['id']}, already exists.")
        return

    prompt = f"A high-quality professional fashion studio photography shot of a female fashion model facing straight forward towards the camera, wearing a {product['name']}. {product['description']}. The model is standing straight against a plain, clean studio background. The {product['name']} is the main focus of the image, perfectly lit and detailed."
    try:
        response = await client.images.generate(
            model="gpt-image-2",
            prompt=prompt,
            size="1024x1024",
            n=1
        )
        
        b64_data = response.data[0].b64_json
        if not b64_data:
            print(f"Failed {product['id']}: No b64_json in response")
            return
            
        import base64
        image_bytes = base64.b64decode(b64_data)
        
        with open(filepath, "wb") as f:
            f.write(image_bytes)
                
        print(f"Generated {product['id']}")
    except Exception as e:
        print(f"Failed {product['id']}: {e}")

async def main():
    print("Starting generation...")
    # Generate in batches to avoid rate limits
    batch_size = 5
    for i in range(0, len(PRODUCTS), batch_size):
        batch = PRODUCTS[i:i+batch_size]
        tasks = [generate_image(client, p) for p in batch]
        await asyncio.gather(*tasks)
        print(f"Completed batch {i//batch_size + 1}/{len(PRODUCTS)//batch_size}")
        time.sleep(2) # Small delay between batches

    print("Generation complete! Writing JS files...")
    
    # Write to ecommerce-api
    backend_js = """const express = require("express");
const router = express.Router();

const DEMO_PRODUCTS = [
"""
    for p in PRODUCTS:
        backend_js += f"""  {{
    id: "{p['id']}",
    name: "{p['name']}",
    category: "{p['category']}",
    description: "{p['description']}",
    image: "/products/{p['id']}.png",
    tags: {p['tags']},
  }},
"""
    backend_js += """];

router.get("/", (req, res) => {
  res.json({
    success: true,
    count: DEMO_PRODUCTS.length,
    products: DEMO_PRODUCTS,
  });
});

module.exports = router;
"""

    with open("ecommerce-api/routes/products.js", "w") as f:
        f.write(backend_js)
        
    # Write to frontend
    frontend_js = """// This file contains the local product catalog state.
export const DEMO_PRODUCTS = [
"""
    for p in PRODUCTS:
        frontend_js += f"""  {{
    id: "{p['id']}",
    name: "{p['name']}",
    category: "{p['category']}",
    description: "{p['description']}",
    image: "/products/{p['id']}.png",
    tags: {p['tags']},
  }},
"""
    frontend_js += "];\n"
    
    with open("frontend/src/mock/products.js", "w") as f:
        f.write(frontend_js)
        
    print("Files updated successfully!")

if __name__ == "__main__":
    asyncio.run(main())
