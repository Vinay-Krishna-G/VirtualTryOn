/**
 * routes/products.js
 *
 * Why this file exists:
 *   One responsibility: return the list of products.
 *   React will call GET /api/products to get this data.
 *
 *   Right now we return hardcoded data matching what's in the frontend.
 *   In a real app, this would query a MongoDB database.
 *
 * Endpoints in this file:
 *   GET /api/products → returns an array of product objects
 */

const express = require("express");

// express.Router() creates a mini-application that handles routes.
// Think of it as a section of our URL map.
const router = express.Router();

// ── Hardcoded Products ────────────────────────────────────────────────────────
// This matches the data in frontend/src/data/products.js
// In Phase 2+, this will come from MongoDB.
// The image path here is the public folder path that Vite serves.
const DEMO_PRODUCTS = [
  {
    id: "red-silk-saree",
    name: "Red Silk Saree",
    category: "Saree",
    description: "Luxurious Banarasi silk with intricate gold zari work",
    image: "/products/red-silk-saree.png",
    tags: ["Silk", "Festive", "Traditional"],
  },
  {
    id: "blue-cotton-saree",
    name: "Blue Cotton Saree",
    category: "Saree",
    description: "Breezy cotton weave with delicate white border pattern",
    image: "/products/blue-cotton-saree.png",
    tags: ["Cotton", "Casual", "Lightweight"],
  },
  {
    id: "wedding-lehenga",
    name: "Wedding Lehenga",
    category: "Lehenga",
    description: "Opulent bridal lehenga with heavy gold embroidery",
    image: "/products/wedding-lehenga.png",
    tags: ["Bridal", "Embroidery", "Premium"],
  },
  {
    id: "printed-kurti",
    name: "Printed Kurti",
    category: "Kurti",
    description: "Teal floral block-print kurti, perfect for daily wear",
    image: "/products/printed-kurti.png",
    tags: ["Block Print", "Casual", "Daily Wear"],
  },
  {
    id: "designer-saree",
    name: "Designer Saree",
    category: "Saree",
    description: "Peach georgette with sequin embroidery for parties",
    image: "/products/designer-saree.png",
    tags: ["Party Wear", "Sequin", "Georgette"],
  },
  {
    id: "green-saree",
    name: "Green Kanjivaram Saree",
    category: "Saree",
    description: "Rich emerald Kanjivaram silk with golden temple border",
    image: "/products/green-saree.png",
    tags: ["Silk", "Kanjivaram", "Traditional"],
  },
  {
    id: "white-shirt",
    name: "White Oxford Shirt",
    category: "Western",
    description: "Classic button-down Oxford shirt, formal or smart casual",
    image: "/products/white-shirt.png",
    tags: ["Formal", "Men's", "Cotton"],
  },
  {
    id: "black-blazer",
    name: "Black Slim Blazer",
    category: "Western",
    description: "Sleek single-breasted slim fit blazer for professionals",
    image: "/products/black-blazer.png",
    tags: ["Formal", "Men's", "Premium"],
  },
  {
    id: "purple-saree",
    name: "Purple Chiffon Saree",
    category: "Saree",
    description: "Royal violet chiffon with silver embroidery border",
    image: "/products/purple-saree.png",
    tags: ["Party Wear", "Chiffon", "Embroidery"],
  },
  {
    id: "anarkali-suit",
    name: "Blue Anarkali Suit",
    category: "Suit",
    description: "Floor-length royal blue Anarkali with gold embroidery",
    image: "/products/anarkali-suit.png",
    tags: ["Festive", "Embroidery", "Full Length"],
  },
];

// ── Route: GET /api/products ──────────────────────────────────────────────────
/**
 * GET /api/products
 *
 * Why it exists:
 *   React needs to know which products exist.
 *   We return the full list so the frontend can display the garment grid.
 *
 * Input: none (no request body needed for GET requests)
 *
 * Output:
 *   HTTP 200 with JSON body:
 *   {
 *     "success": true,
 *     "products": [ { id, name, category, ... }, ... ]
 *   }
 */
router.get("/", (req, res) => {
  res.json({
    success: true,
    count: DEMO_PRODUCTS.length,
    products: DEMO_PRODUCTS,
  });
});

module.exports = router;
