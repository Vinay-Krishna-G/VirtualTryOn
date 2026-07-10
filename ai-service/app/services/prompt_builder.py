"""
app/services/prompt_builder.py

Standalone Prompt Builder for AI Virtual Try-On.
Generates highly optimized, strict Image Editing prompts (80-120 words).
"""

import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

# Legacy aliases used by other integrations (kept for backward compatibility)
_ALIASES: Dict[str, str] = {
    "saree": "saree", "sari": "saree",
    "lehenga": "lehenga",
    "kurti": "kurti", "kurta": "kurti",
    "anarkali": "anarkali", "suit": "anarkali",
    "shirt": "shirt", "oxford": "shirt",
    "t-shirt": "tshirt", "tshirt": "tshirt", "tee": "tshirt",
    "blazer": "blazer", "jacket": "blazer",
    "jeans": "jeans", "trouser": "jeans", "pant": "jeans",
    "dress": "dress", "western": "shirt",
}

def detect_category_from_product_id(product_id: Optional[str]) -> str:
    if not product_id:
        return "dress"
    pid = product_id.lower()
    for keyword, category in _ALIASES.items():
        if keyword in pid:
            return category
    return "dress"

def build_prompt(
    category: str,
    product_name: str = "",
    product_description: str = "",
    product_metadata: Optional[Dict[str, Any]] = None
) -> str:
    """
    Builds a deterministic editing prompt constrained to 80-120 words.
    """
    logger.info("Prompt Builder: Assembling 80-120 word editing prompt...")
    
    if product_metadata is None:
        product_metadata = {}
        
    cat = category.lower()
    name = product_metadata.get("name", "garment").lower()
    desc = product_metadata.get("description", "").lower()
    tags = ", ".join(product_metadata.get("tags", [])).lower()
    
    # Extract details safely
    fabric = "its fabric"
    color = "its primary color"
    border = "its border"
    pattern = "its pattern"
    
    if "silk" in desc or "silk" in tags: fabric = "silk"
    elif "cotton" in desc or "cotton" in tags: fabric = "cotton"
    elif "georgette" in desc or "georgette" in tags: fabric = "georgette"
    elif "chiffon" in desc or "chiffon" in tags: fabric = "chiffon"
    
    if "red" in name or "red" in desc: color = "red"
    elif "blue" in name or "blue" in desc: color = "blue"
    elif "green" in name or "green" in desc: color = "green"
    elif "purple" in name or "purple" in desc: color = "purple"
    elif "white" in name or "white" in desc: color = "white"
    elif "black" in name or "black" in desc: color = "black"

    task = "TASK\nThis is an IMAGE EDITING task. Edit ONLY the first image. Do not create a new person."
    
    primary = "PRIMARY IMAGE\nThe first image is the immutable source. Preserve every aspect of this photograph except the clothing."
    
    reference = "REFERENCE IMAGE\nThe second image is ONLY a garment reference. Ignore the model, face, body, pose, background and lighting in the second image. Copy ONLY the garment."
    
    identity = "IDENTITY\nPreserve exactly Face, Hair, Expression, Skin tone, Body proportions, Body shape, Hands, Feet, Pose, Camera angle, Lighting, Background, Accessories, Jewelry."
    
    garment = "GARMENT\nReplace ONLY the clothing. Preserve exactly Fabric, Texture, Embroidery, Pattern, Print, Primary Color, Secondary Color, Border, Buttons, Collar, Sleeves, Pleats, Pallu, Natural folds, Wrinkles, Silhouette."
    
    if "saree" in cat or "sari" in cat:
        category_rules = f"CATEGORY RULES\nDress the person in the exact {name} ({fabric} saree) shown in the reference image. Preserve the exact {color} color, {border} border, {pattern} design, realistic Indian draping, natural pleats, waist wrap and pallu. Do not redesign or simplify the garment."
    elif "shirt" in cat or "tshirt" in cat or "tee" in cat:
        category_rules = f"CATEGORY RULES\nDress the person in the exact {name} shown. Preserve collar, buttons, logo, sleeve length and fit. Do not redesign."
    elif "kurta" in cat or "kurti" in cat:
        category_rules = f"CATEGORY RULES\nDress the person in the exact {name} shown. Preserve embroidery, neck, sleeves and fabric. Do not redesign."
    else:
        category_rules = f"CATEGORY RULES\nDress the person in the exact {name} shown in the reference image preserving its fit and silhouette. Do not redesign."
        
    negative = "NEGATIVE RULES\nNever Generate another person, Replace the face, Modify hairstyle, Modify skin tone, Modify body shape, Modify pose, Modify lighting, Modify background, Beautify the subject, Stylize, Cartoonize, Merge old clothing with new clothing, Invent garment details."
    
    success = "SUCCESS\nThe output should look like the original photograph after changing clothes. The only visible difference between the source image and the final image should be the clothing."
    
    sections = [task, primary, reference, identity, garment, category_rules, negative, success]
    
    final_prompt = "\n\n".join(sections)
    
    word_count = len(final_prompt.split())
    logger.info("Final Prompt Length: %d words", word_count)
    
    if word_count > 120 or word_count < 80:
        logger.warning("Prompt length (%d) is outside the 80-120 word target limit!", word_count)
    
    return final_prompt
