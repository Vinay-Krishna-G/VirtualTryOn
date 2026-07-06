/**
 * data/products.js
 *
 * Why this file exists:
 *   We need a list of products to display in the UI.
 *   Right now we hardcode them here for the demo.
 *
 *   In Phase 2, we'll replace this with a real API call to Node:
 *   GET /api/products  →  returns this same list from a database.
 *
 * Each product has:
 *   - id: unique identifier used by the backend
 *   - name: what the customer sees
 *   - category: used for filtering (e.g. "Saree", "Western")
 *   - description: short text shown on the card
 *   - image: path inside /public — Vite serves /public as the root
 *   - tags: used for badge labels
 */

export const products = [
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

/**
 * getCategories
 *
 * Why it exists:
 *   We want to show filter buttons like "All", "Saree", "Lehenga"
 *   without hardcoding them. This function reads the products list
 *   and figures out the unique categories automatically.
 *
 * Input: none (reads from the products array above)
 * Output: string[] — e.g. ["All", "Saree", "Lehenga", "Kurti", ...]
 */
export function getCategories() {
  const uniqueCategories = [...new Set(products.map((p) => p.category))];
  return ["All", ...uniqueCategories];
}
