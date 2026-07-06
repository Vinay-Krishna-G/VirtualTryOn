# VirtualFit — AI Virtual Try-On Demo

A demo application that lets customers upload their photo, select a garment, and see themselves wearing it using AI.

Built to demonstrate the concept to clothing store owners.

---

## Project Structure

```
VirtualTryOn/
├── frontend/          React (Vite + Tailwind CSS)
├── ecommerce-api/     Node.js (Express)
├── ai-service/        Python (FastAPI)
└── README.md
```

---

## How to Run (3 terminals)

### Terminal 1 — React Frontend

```bash
cd frontend
npm install
npm run dev
```
→ Opens at http://localhost:5173

---

### Terminal 2 — Node.js Backend

```bash
cd ecommerce-api
npm install
node server.js
```
→ Runs at http://localhost:3001

Test it:
```bash
curl http://localhost:3001/api/health
curl http://localhost:3001/api/products
```

---

### Terminal 3 — Python AI Service

```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
→ Runs at http://localhost:8000

Test it:
```bash
curl http://localhost:8000/health
```

Interactive docs:
→ http://localhost:8000/docs

---

## Request Flow

```
1. User uploads photo     → React
2. User selects garment   → React
3. User clicks Generate   → React sends POST /api/generate to Node
4. Node receives images   → calls Python POST /generate
5. Python generates image → returns PNG to Node
6. Node returns image     → React displays result
```

---

## API Reference

### Node.js (port 3001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| GET | /api/products | Returns all 10 garments |
| POST | /api/generate | Generates try-on (accepts person image + productId) |

### Python (port 8000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| POST | /generate | Accepts person_image + garment_image, returns PNG |

---

## Development Phases

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1 | ✅ Done | React UI with 10 hardcoded products |
| Phase 2 | ✅ Done | Node.js backend with upload + generate APIs |
| Phase 3 | ✅ Done | Python FastAPI with placeholder response |
| Phase 4 | 🔜 Next | Real AI model (IDM-VTON or HuggingFace API) |
| Phase 5 | 🔜 Next | Polish, error handling, demo script |

---

## Products (Hardcoded for Demo)

Located in `frontend/public/products/`:

| ID | Name | Category |
|----|------|----------|
| red-silk-saree | Red Silk Saree | Saree |
| blue-cotton-saree | Blue Cotton Saree | Saree |
| wedding-lehenga | Wedding Lehenga | Lehenga |
| printed-kurti | Printed Kurti | Kurti |
| designer-saree | Designer Saree | Saree |
| green-saree | Green Kanjivaram Saree | Saree |
| white-shirt | White Oxford Shirt | Western |
| black-blazer | Black Slim Blazer | Western |
| purple-saree | Purple Chiffon Saree | Saree |
| anarkali-suit | Blue Anarkali Suit | Suit |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React (Vite) + Tailwind CSS v4 | User interface |
| Backend | Node.js + Express | API, file handling, orchestration |
| AI Service | Python + FastAPI | Image generation |
| File uploads | Multer | Multipart form data parsing |
| HTTP client | Axios | Making requests between services |
