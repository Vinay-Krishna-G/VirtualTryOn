export default async function getCroppedImg(image, crop, enhance = false) {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  
  const pixelRatio = window.devicePixelRatio || 1;
  
  // Set canvas size to match the original image resolution
  canvas.width = Math.floor(crop.width * scaleX);
  canvas.height = Math.floor(crop.height * scaleY);
  
  const ctx = canvas.getContext("2d");

  // set clear background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  );

  // Apply basic sharpening if enhancement is requested
  if (enhance) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const src = new Uint8ClampedArray(data);
    const w = canvas.width;
    const h = canvas.height;
    
    // Simple 3x3 sharpening kernel: [0, -1, 0, -1, 5, -1, 0, -1, 0]
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = (y * w + x) * 4;
        const t = i - w * 4; // top
        const b = i + w * 4; // bottom
        const l = i - 4;     // left
        const r = i + 4;     // right
        
        for (let rgb = 0; rgb < 3; rgb++) {
          data[i + rgb] = src[i + rgb] * 5 
                        - src[t + rgb] 
                        - src[b + rgb] 
                        - src[l + rgb] 
                        - src[r + rgb];
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      if (file) {
        file.name = "cropped.jpeg";
        resolve(file);
      } else {
        reject(new Error("Canvas is empty"));
      }
    }, "image/jpeg", 1);
  });
}
