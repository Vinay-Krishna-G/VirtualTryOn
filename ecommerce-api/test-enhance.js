const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

async function test() {
  const formData = new FormData();
  formData.append("personImage", fs.createReadStream("test-image.txt"), { filename: "test.jpg", contentType: "image/jpeg" });

  try {
    const res = await axios.post("http://localhost:3001/api/generate/enhance", formData, {
      headers: formData.getHeaders(),
      responseType: "arraybuffer"
    });
    console.log("Status:", res.status);
    console.log("Headers:", res.headers);
    console.log("Size:", res.data.length);
  } catch (err) {
    console.error("Error:", err.message);
    if (err.response) {
      console.error("Data:", err.response.data.toString());
    }
  }
}
test();
