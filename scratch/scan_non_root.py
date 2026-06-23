with open("/Users/kishanbm/.gemini/antigravity-ide/brain/67d8db9e-0fc7-402f-9820-f3a3b2d1c286/scratch/pricing_text.txt", "r", encoding="utf-8") as f:
    text = f.read()

import re
lines = text.split('\n')
for i, line in enumerate(lines):
    clean = line.strip()
    if not clean:
        continue
    # Let's skip CSS variables, selectors, styles
    if "{" in clean or "}" in clean or ";" in clean or "--" in clean:
        continue
    if len(clean) > 3 and i > 200: # Skip early header lines
        print(f"{i}: {clean}")
