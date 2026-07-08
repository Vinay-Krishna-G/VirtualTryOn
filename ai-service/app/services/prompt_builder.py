"""
app/services/prompt_builder.py

Reusable prompt templates for virtual try-on image generation.

Responsibility:
    Given a garment category (e.g. "saree", "shirt", "lehenga"),
    return a detailed text prompt that instructs Gemini to:
      - Preserve everything about the person EXCEPT their clothing.
      - Replace the clothing with the garment in the reference image,
        matching it exactly (color, texture, embroidery, pattern, fabric).

Why a separate module?
    Prompts are long, category-specific, and change frequently during
    tuning.  Keeping them here means the route and Gemini service stay
    clean and never need to change when we tweak a prompt.

Usage:
    from app.services.prompt_builder import build_prompt
    prompt = build_prompt("saree")
"""

import logging

logger = logging.getLogger(__name__)

# ── Category aliases ──────────────────────────────────────────────────────────
# Map raw category strings (including productId keywords) → canonical key
_ALIASES: dict[str, str] = {
    # Saree
    "saree": "saree",
    "sari": "saree",
    # Lehenga
    "lehenga": "lehenga",
    # Kurti / Kurta
    "kurti": "kurti",
    "kurta": "kurti",
    # Anarkali Suit
    "anarkali": "anarkali",
    "suit": "anarkali",
    # Western — Shirt
    "shirt": "shirt",
    "oxford": "shirt",
    # Western — T-Shirt
    "t-shirt": "tshirt",
    "tshirt": "tshirt",
    "tee": "tshirt",
    # Western — Blazer / Jacket
    "blazer": "blazer",
    "jacket": "blazer",
    # Western — Jeans / Trousers
    "jeans": "jeans",
    "trouser": "jeans",
    "pant": "jeans",
    # Generic dress
    "dress": "dress",
    # Western (fallback for the "Western" category label)
    "western": "shirt",
}

# ── Shared preservation clause ────────────────────────────────────────────────
_PRESERVE = (
    "CRITICAL PRESERVATION RULES — do NOT change any of the following: "
    "the person's face, facial expression, hairstyle, hair colour, skin tone, "
    "body shape, body proportions, pose, hand position, fingers, background scene, "
    "background lighting, shadows, camera angle, camera distance, depth of field, "
    "and all accessories (jewellery, handbag, watch, glasses, shoes, etc.)."
)

# ── Shared clothing replacement clause ───────────────────────────────────────
_REPLACE = (
    "CLOTHING REPLACEMENT RULES — replace ONLY the clothing that covers the torso "
    "and lower body. The replacement garment must exactly match the reference product "
    "image provided: identical colour, identical fabric texture, identical embroidery "
    "or print pattern, identical logo or motif, identical sleeve design, identical "
    "collar or neckline, identical border or trim, and identical overall silhouette. "
    "The clothing must appear to fit the person's body naturally with realistic "
    "folds, wrinkles, and draping physics. Do not simplify or idealise the garment."
)

# ── Per-category prompt templates ─────────────────────────────────────────────
_PROMPTS: dict[str, str] = {
    "saree": (
        "You are a photorealistic virtual fashion try-on system. "
        "I am giving you two images: (1) a person photo, and (2) a reference saree product image. "
        "Your task: generate a single, photorealistic image of the SAME person wearing the EXACT saree from the reference image. "
        f"{_PRESERVE} "
        f"{_REPLACE} "
        "For the saree specifically: the pallu (the draped end) must fall naturally over the left shoulder with realistic fabric drape. "
        "The pleats at the waist must look naturally tucked. The blouse must match the reference if shown. "
        "The saree fabric — whether silk, chiffon, georgette, cotton — must have the correct sheen and drape physics. "
        "Output: one final photorealistic image of the person wearing the saree. No side-by-side. No text overlays."
    ),

    "lehenga": (
        "You are a photorealistic virtual fashion try-on system. "
        "I am giving you two images: (1) a person photo, and (2) a reference lehenga product image. "
        "Your task: generate a single, photorealistic image of the SAME person wearing the EXACT lehenga from the reference image. "
        f"{_PRESERVE} "
        f"{_REPLACE} "
        "For the lehenga specifically: the skirt must have realistic volume and fabric fall. "
        "The choli (blouse) must match the reference exactly in embroidery and colour. "
        "The dupatta, if present in the reference, must be draped naturally. "
        "Heavy embroidery, zari work, or mirror work must appear three-dimensional and detailed. "
        "Output: one final photorealistic image. No side-by-side. No text overlays."
    ),

    "kurti": (
        "You are a photorealistic virtual fashion try-on system. "
        "I am giving you two images: (1) a person photo, and (2) a reference kurti/kurta product image. "
        "Your task: generate a single, photorealistic image of the SAME person wearing the EXACT kurti from the reference image. "
        f"{_PRESERVE} "
        f"{_REPLACE} "
        "For the kurti specifically: match the neckline design, sleeve length, hemline length, and block print or embroidery exactly. "
        "The fabric should have the correct drape — cotton should look structured, chiffon should look flowy. "
        "Output: one final photorealistic image. No side-by-side. No text overlays."
    ),

    "anarkali": (
        "You are a photorealistic virtual fashion try-on system. "
        "I am giving you two images: (1) a person photo, and (2) a reference Anarkali suit product image. "
        "Your task: generate a single, photorealistic image of the SAME person wearing the EXACT Anarkali suit from the reference image. "
        f"{_PRESERVE} "
        f"{_REPLACE} "
        "For the Anarkali specifically: the floor-length or knee-length flared silhouette must be reproduced exactly. "
        "The gold embroidery, sequin detailing, or printed pattern must appear realistic and detailed. "
        "The churidar or palazzo pants underneath should be visible and match the reference. "
        "Output: one final photorealistic image. No side-by-side. No text overlays."
    ),

    "shirt": (
        "You are a photorealistic virtual fashion try-on system. "
        "I am giving you two images: (1) a person photo, and (2) a reference shirt product image. "
        "Your task: generate a single, photorealistic image of the SAME person wearing the EXACT shirt from the reference image. "
        f"{_PRESERVE} "
        f"{_REPLACE} "
        "For the shirt specifically: replicate the exact collar style (button-down, spread, mandarin), button placket, "
        "pocket position, sleeve length, cuff design, and fabric texture (Oxford weave, poplin, linen, etc.). "
        "Shirt buttons and stitching should be clearly visible. "
        "Output: one final photorealistic image. No side-by-side. No text overlays."
    ),

    "tshirt": (
        "You are a photorealistic virtual fashion try-on system. "
        "I am giving you two images: (1) a person photo, and (2) a reference t-shirt product image. "
        "Your task: generate a single, photorealistic image of the SAME person wearing the EXACT t-shirt from the reference image. "
        f"{_PRESERVE} "
        f"{_REPLACE} "
        "For the t-shirt specifically: match the exact graphic print, logo, colour, crew/v-neck style, and sleeve length. "
        "The jersey fabric should show realistic stretch folds. "
        "Output: one final photorealistic image. No side-by-side. No text overlays."
    ),

    "blazer": (
        "You are a photorealistic virtual fashion try-on system. "
        "I am giving you two images: (1) a person photo, and (2) a reference blazer/jacket product image. "
        "Your task: generate a single, photorealistic image of the SAME person wearing the EXACT blazer from the reference image. "
        f"{_PRESERVE} "
        f"{_REPLACE} "
        "For the blazer specifically: replicate the lapel style (notch, peak, shawl), button count, fit (slim, regular), "
        "pocket style, lining visible at sleeves, and fabric texture (wool, cotton, velvet). "
        "The structured shoulders of a blazer must be visible. "
        "Output: one final photorealistic image. No side-by-side. No text overlays."
    ),

    "jeans": (
        "You are a photorealistic virtual fashion try-on system. "
        "I am giving you two images: (1) a person photo, and (2) a reference jeans/trousers product image. "
        "Your task: generate a single, photorealistic image of the SAME person wearing the EXACT jeans from the reference image. "
        f"{_PRESERVE} "
        f"{_REPLACE} "
        "For the jeans specifically: replicate the exact wash (light, dark, distressed), cut (slim, straight, bootcut, skinny), "
        "waistband, pocket position, and any rips or embellishments shown in the reference. "
        "Denim texture and stitching should be clearly visible. "
        "Output: one final photorealistic image. No side-by-side. No text overlays."
    ),

    "dress": (
        "You are a photorealistic virtual fashion try-on system. "
        "I am giving you two images: (1) a person photo, and (2) a reference dress product image. "
        "Your task: generate a single, photorealistic image of the SAME person wearing the EXACT dress from the reference image. "
        f"{_PRESERVE} "
        f"{_REPLACE} "
        "For the dress specifically: match the neckline, sleeve style, waist definition, hemline length, "
        "fabric drape, print pattern, and any embellishments (buttons, ruffles, lace) exactly. "
        "Output: one final photorealistic image. No side-by-side. No text overlays."
    ),
}

# Fallback for unrecognised categories
_DEFAULT_PROMPT = (
    "You are a photorealistic virtual fashion try-on system. "
    "I am giving you two images: (1) a person photo, and (2) a reference garment product image. "
    "Your task: generate a single, photorealistic image of the SAME person wearing the EXACT garment from the reference image. "
    f"{_PRESERVE} "
    f"{_REPLACE} "
    "Output: one final photorealistic image. No side-by-side. No text overlays."
)


def detect_category_from_product_id(product_id: str) -> str:
    """
    Infer garment category from the productId string.

    Example:
        "red-silk-saree"  → "saree"
        "black-blazer"    → "blazer"
        "printed-kurti"   → "kurti"
        "white-shirt"     → "shirt"

    Falls back to "saree" (most common category in the demo) if nothing matches.
    """
    product_id_lower = product_id.lower()
    for keyword, canonical in _ALIASES.items():
        if keyword in product_id_lower:
            logger.debug("Detected category '%s' from productId '%s'", canonical, product_id)
            return canonical

    logger.warning("Could not detect category from productId '%s', defaulting to 'saree'", product_id)
    return "saree"


def build_prompt(category: str) -> str:
    """
    Return the try-on prompt for the given garment category.

    Args:
        category:  Garment category string (case-insensitive).
                   May be a raw category label ("Saree", "Western")
                   or a productId keyword ("saree", "blazer").

    Returns:
        Full prompt string ready to send to Gemini.
    """
    canonical = _ALIASES.get(category.lower().strip(), None)
    if canonical is None:
        # Try treating the whole string as a productId
        canonical = detect_category_from_product_id(category)

    prompt = _PROMPTS.get(canonical, _DEFAULT_PROMPT)
    logger.debug("Built prompt for category '%s' (canonical='%s')", category, canonical)
    return prompt
