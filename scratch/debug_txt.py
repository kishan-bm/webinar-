with open("/Users/kishanbm/.gemini/antigravity-ide/brain/67d8db9e-0fc7-402f-9820-f3a3b2d1c286/scratch/pricing_text.txt", "r", encoding="utf-8") as f:
    text = f.read()

lines = text.split('\n')
print(f"Total lines: {len(lines)}")
count = 0
for i, l in enumerate(lines):
    if len(l.strip()) > 5:
        print(f"{i}: {l.strip()[:120]}")
        count += 1
        if count > 80:
            break
