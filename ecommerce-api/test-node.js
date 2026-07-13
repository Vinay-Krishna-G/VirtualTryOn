
const axios = require("axios");
const FormData = require("form-data");

async function test() {
  const formData = new FormData();
  // A small 1x1 base64 GIF
  const buf = Buffer.from("R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=", "base64");
  formData.append("personImage", buf, { filename: "test.gif", contentType: "image/gif" });

  try {
    const res = await axios.post("http://localhost:3001/api/generate/enhance", formData, {
      headers: formData.getHeaders(),
      responseType: "arraybuffer"
    });
    console.log("Status:", res.status);
    console.log("Size:", res.data.length);
  } catch (err) {
    console.error("Error:", err.message);
    if (err.response) {
      console.error("Data:", err.response.data.toString());
    }
  }
}
test();
