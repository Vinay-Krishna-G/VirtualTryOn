"""
app/services/category_detector.py

Provides a scalable and configurable mapping for detecting garment categories
based on product names or identifiers.
"""

import re

class CategoryDetector:
    # Configurable mapping of base categories to their matching keywords
    CATEGORY_MAP = {
        "shirt": ["shirt", "tshirt", "tee"],
        "kurta": ["kurta", "kurti"],
        "saree": ["saree"],
        "lehenga": ["lehenga"],
        "suit": ["suit", "blazer"],
        "jeans": ["jeans", "pant", "trouser"],
        "top": ["top", "blouse"],
        "outfit": ["outfit", "co-ord", "set"]
    }

    # The default category to return if no keyword matches
    DEFAULT_CATEGORY = "saree"

    @classmethod
    def detect_category(cls, product_str: str) -> str:
        """
        Normalizes the input string and determines the best matching garment category.
        
        Args:
            product_str: The raw product string (e.g. 'red-silk-saree', 'white_shirt_L')
            
        Returns:
            The standard category name (e.g. 'saree', 'shirt')
        """
        if not product_str:
            return cls.DEFAULT_CATEGORY

        # Normalize the input:
        # 1. Convert to lowercase
        # 2. Replace hyphens and underscores with spaces to separate words
        normalized = product_str.lower().replace("-", " ").replace("_", " ")
        
        # Since the legacy implementation used "if 'shirt' in product:", we'll 
        # replicate that behavior but against the normalized string to ensure
        # we catch things like "tshirt".
        
        for category, keywords in cls.CATEGORY_MAP.items():
            for keyword in keywords:
                if keyword in normalized:
                    return category
                    
        return cls.DEFAULT_CATEGORY
