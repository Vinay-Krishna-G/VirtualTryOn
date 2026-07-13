import glob
import re

for f in glob.glob("app/services/pipeline/*.py"):
    with open(f, "r") as file:
        content = file.read()
    
    # We want to replace COLOR_$12whatever to the correct cv2 colors
    content = content.replace("COLOR_$12RGB", "COLOR_BGR2RGB")
    content = content.replace("COLOR_$12BGR", "COLOR_LAB2BGR")
    content = content.replace("COLOR_$12GRAY", "COLOR_BGR2GRAY")
    content = content.replace("COLOR_$12LAB", "COLOR_BGR2LAB")
    content = content.replace("COLOR_$12RGBA", "COLOR_BGRA2RGBA")
    
    # Wait, earlier I had COLOR_BGRA@BGR. It became COLOR_$12BGR probably.
    content = content.replace("cv2.cvtColor(img, cv2.COLOR_LAB2BGR)", "cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)") 
    # Let me just be explicit for the few ones I know are wrong.
    
    with open(f, "w") as file:
        file.write(content)

