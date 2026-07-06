/**
 * services/tryonService.js
 *
 * Why this file exists:
 *   Encapsulates the AI Try-On API call logic.
 *   Keeps the React components clean and focused on UI state.
 */

import axios from "axios";

export async function generateTryOn(personImageFile, productId) {
  const formData = new FormData();
  formData.append("personImage", personImageFile);
  formData.append("productId", productId);

  // The Vite proxy routes this to the Node.js backend (localhost:3001)
  const response = await axios.post("/api/generate", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    // We expect binary image data back
    responseType: "blob",
  });

  // Convert the blob to a local URL that an <img> tag can render
  return URL.createObjectURL(response.data);
}
