import os
import unicodedata

def is_emoji(char):
    code = ord(char)
    if (
        (0x1F300 <= code <= 0x1F9FF) or
        (0x2600 <= code <= 0x27BF) or
        (0x1FA00 <= code <= 0x1FAFF) or
        (0x1F1E6 <= code <= 0x1F1FF) or
        (0x2B50 <= code <= 0x2B55) or
        (0x203C <= code <= 0x2049) or
        (0x2300 <= code <= 0x23FF) or
        (0x2702 <= code <= 0x27B0)
    ):
        return True
    return False

extensions = ('.html', '.js', '.py', '.css', '.md')
found_report = []

for root, dirs, files in os.walk('.'):
    if '.git' in root or '__pycache__' in root or '.system_generated' in root:
        continue
    for file in files:
        if file.endswith(extensions) and file != 'find_all_emojis.py':
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            for idx, line in enumerate(lines, 1):
                emojis_in_line = [c for c in line if is_emoji(c)]
                if emojis_in_line:
                    hexes = [f"U+{ord(c):04X}" for c in emojis_in_line]
                    found_report.append(f"{filepath}:{idx}: ({', '.join(hexes)}) {line.strip()}")

with open('emojis_found.txt', 'w', encoding='utf-8') as out:
    out.write(f"Total lines with emojis: {len(found_report)}\n")
    for item in found_report:
        out.write(item + "\n")

print(f"Done. Found {len(found_report)} lines with emojis saved to emojis_found.txt")
