const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

async function test() {
  const formData = new FormData();
  // Fake a valid image by writing a tiny 1x1 PNG or using a known file.
  // We can just use the vite.svg from frontend/public/vite.svg!
  formData.append("personImage", fs.createReadStream("../frontend/public/vite.svg"));

  try {
    const res = await axios.post("http://localhost:3001/api/generate/enhance", formData, {
      headers: formData.getHeaders(),
      responseType: "arraybuffer"
    });
    console.log("Status:", res.status);
    console.log("Size:", res.data.length);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
test();
