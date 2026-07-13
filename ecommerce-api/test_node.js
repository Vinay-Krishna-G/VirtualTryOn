const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

async function test() {
  const img = fs.createReadStream("C:\\Users\\konje\\OneDrive\\Desktop\\Mummy 2.jpeg");
  const form = new FormData();
  form.append("personImage", img);
  form.append("productId", "w_saree_brown");
  form.append("size", "XL");
  
  try {
    const res = await axios.post("http://localhost:3001/api/generate", form, {
      headers: form.getHeaders(),
    });
    console.log("STATUS:", res.status);
    console.log("DATA:", res.data);
  } catch (err) {
    console.log("ERROR STATUS:", err.response?.status);
    console.log("ERROR DATA:", err.response?.data);
  }
}
test();

