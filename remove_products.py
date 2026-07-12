import re
import os

mock_dir = r'c:\Users\konje\VirtualTryOn\VirtualTryOn\frontend\src\mock'
products_file = os.path.join(mock_dir, 'products.js')

with open(products_file, 'r', encoding='utf-8') as f:
    text = f.read()

# I want to remove items that have 'flat_' in the id or are 'plus_size_saree' or 'w_saree'
# We can regex match the objects in the array.
# The objects look like:
#   {
#     id: "...",
#     ...
#   },

def remove_unwanted(match):
    full_str = match.group(0)
    # Extract ID
    id_match = re.search(r'id:\s*\"(.*?)\"', full_str)
    if id_match:
        pid = id_match.group(1)
        if pid.startswith('flat_') or pid == 'plus_size_saree' or pid == 'w_saree':
            print(f'Removing {pid}')
            return '' # remove it
    return full_str

# Match each object from { to },
# Note: tags: [...] could have inner brackets, but there are no nested objects.
new_text = re.sub(r'{\s*id:.*?},\n', remove_unwanted, text, flags=re.DOTALL)

with open(products_file, 'w', encoding='utf-8') as f:
    f.write(new_text)

print('Done removing unwanted products.')
