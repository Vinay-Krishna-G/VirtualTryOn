"""
generate.py

Why this file exists:
    One responsibility: take two images (person + garment) and 
    return a generated try-on image.

    In Phase 3 (NOW): We return a PLACEHOLDER image.
    The placeholder proves the pipeline works end-to-end before 
    we integrate a real AI model.

    In Phase 4: We'll replace the placeholder logic with a real 
    virtual try-on model (IDM-VTON or similar).

    Why separate this from main.py?
    - main.py handles HTTP: receiving requests, returning responses
    - generate.py handles AI logic: the actual image generation
    - This separation means in Phase 4, we only change THIS file
      without touching main.py at all

    Inputs (as bytes):
        person_image_bytes  - the person's photo (binary image data)
        garment_image_bytes - the garment photo (binary image data)

    Output:
        bytes - the generated try-on image in PNG format
"""

import io
from PIL import Image, ImageDraw, ImageFont, ImageFilter


def generate_tryon_image(person_image_bytes: bytes, garment_image_bytes: bytes) -> bytes:
    """
    generate_tryon_image

    Why it exists:
        This is the core function. It takes two images and produces one output.

        Phase 3 implementation: Creates a side-by-side composite image
        with a "DEMO" watermark and placeholder text to simulate what the
        real AI would return. This proves the full pipeline works.

    Input:
        person_image_bytes  (bytes): raw binary content of the person's photo
        garment_image_bytes (bytes): raw binary content of the garment photo

    Output:
        bytes: PNG image data (the composite/placeholder try-on result)
    """

    # Step 1: Load the images from raw bytes
    # io.BytesIO wraps the bytes in a file-like object
    # PIL.Image.open() can then read it as if it were a file
    person_image = Image.open(io.BytesIO(person_image_bytes)).convert("RGBA")
    garment_image = Image.open(io.BytesIO(garment_image_bytes)).convert("RGBA")

    # Step 2: Resize both images to the same height for side-by-side display
    target_height = 600
    target_width = 400

    person_resized = resize_image_to_fit(person_image, target_width, target_height)
    garment_resized = resize_image_to_fit(garment_image, target_width, target_height)

    # Step 3: Create the composite canvas
    # We'll place: [person photo] [garment photo] side by side
    # with a purple-tinted overlay on the garment side (simulating try-on)
    canvas_width = target_width * 2 + 60   # 60px padding in middle
    canvas_height = target_height + 120    # 120px for header/footer
    canvas = Image.new("RGBA", (canvas_width, canvas_height), (15, 15, 26, 255))

    # Step 4: Paste the person image on the left
    person_x = 20
    person_y = 80
    canvas.paste(person_resized, (person_x, person_y), person_resized)

    # Step 5: Apply a purple tint to the garment to simulate the try-on effect
    # (this is our placeholder effect — real AI would blend them intelligently)
    tinted_garment = apply_purple_tint(garment_resized)
    garment_x = target_width + 40
    garment_y = 80
    canvas.paste(tinted_garment, (garment_x, garment_y), tinted_garment)

    # Step 6: Add text overlay
    draw = ImageDraw.Draw(canvas)

    # Header text
    draw.text(
        (canvas_width // 2, 30),
        "✨ VirtualFit AI Try-On Result",
        fill=(167, 139, 250, 255),  # Purple color
        anchor="mm",  # "mm" = middle-middle anchor point
    )

    # Labels
    draw.text(
        (person_x + target_width // 2, canvas_height - 35),
        "Your Photo",
        fill=(100, 116, 139, 255),
        anchor="mm",
    )
    draw.text(
        (garment_x + target_width // 2, canvas_height - 35),
        "Try-On Preview",
        fill=(167, 139, 250, 255),
        anchor="mm",
    )

    # "DEMO" watermark on the garment panel
    draw.text(
        (garment_x + target_width // 2, garment_y + target_height // 2),
        "AI DEMO",
        fill=(124, 58, 237, 100),  # Semi-transparent purple
        anchor="mm",
    )

    # Step 7: Convert back to RGB and save as PNG bytes
    # We convert to RGB because PNG supports both, but JPEG requires RGB
    final_image = canvas.convert("RGB")

    # io.BytesIO() creates an in-memory file buffer
    # We save the image to this buffer instead of a file on disk
    output_buffer = io.BytesIO()
    final_image.save(output_buffer, format="PNG", optimize=True)

    # .getvalue() returns all the bytes from the buffer
    return output_buffer.getvalue()


def resize_image_to_fit(image: Image.Image, target_width: int, target_height: int) -> Image.Image:
    """
    resize_image_to_fit

    Why it exists:
        Images come in all sizes and aspect ratios.
        We need a consistent size for our side-by-side display.
        This function resizes while preserving the aspect ratio,
        then center-crops to fit exactly.

    Input:
        image       (PIL Image): the original image
        target_width  (int): desired width in pixels
        target_height (int): desired height in pixels

    Output:
        PIL Image: resized and cropped to exactly (target_width x target_height)
    """
    # First, scale to cover the target size (no empty space)
    image_ratio = image.width / image.height
    target_ratio = target_width / target_height

    if image_ratio > target_ratio:
        # Image is wider — scale by height
        new_height = target_height
        new_width = int(image.width * (target_height / image.height))
    else:
        # Image is taller — scale by width
        new_width = target_width
        new_height = int(image.height * (target_width / image.width))

    resized = image.resize((new_width, new_height), Image.LANCZOS)

    # Center crop to exact target size
    left = (new_width - target_width) // 2
    top = (new_height - target_height) // 2
    cropped = resized.crop((left, top, left + target_width, top + target_height))

    return cropped


def apply_purple_tint(image: Image.Image, tint_strength: float = 0.2) -> Image.Image:
    """
    apply_purple_tint

    Why it exists:
        For the placeholder demo, we visually distinguish the "generated"
        result from the original garment by applying a purple color tint.
        This makes the demo look more convincing without real AI.

    Input:
        image        (PIL Image): the garment image
        tint_strength (float): 0.0 = no tint, 1.0 = fully purple

    Output:
        PIL Image: the tinted garment image
    """
    # Create a purple overlay
    purple_overlay = Image.new("RGBA", image.size, (124, 58, 237, int(255 * tint_strength)))

    # Blend the overlay with the original image
    tinted = Image.alpha_composite(image, purple_overlay)

    return tinted
