/**
 * services/tryonService.js
 *
 * Why this file exists:
 *   Encapsulates the AI Try-On API call logic.
 *   Keeps the React components clean and focused on UI state.
 */

import axios from "axios";

export async function generateTryOn(personImageFile, productId, size) {
  const formData = new FormData();
  formData.append("personImage", personImageFile);
  formData.append("productId", productId);
  if (size) {
    formData.append("size", size);
  }

  // The Vite proxy routes this to the Node.js backend (localhost:3001)
  const response = await axios.post("/api/generate", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    // We expect JSON back now (job ID)
    responseType: "json",
  });

  // Return the job ID to be polled
  return response.data.id;
}

export async function checkTryOnStatus(jobId) {
  const response = await axios.get(`/api/generate/status/${jobId}`, {
    responseType: "json",
  });
  return response.data;
}
