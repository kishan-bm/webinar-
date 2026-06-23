with open("/Users/kishanbm/.gemini/antigravity-ide/brain/67d8db9e-0fc7-402f-9820-f3a3b2d1c286/scratch/pricing_text.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "<body" in line or "Day Trading" in line:
        print(f"Line {i} matches! Length: {len(line)}")
        # Let's print out first 500 characters of this line
        print(line[:500])
        print("="*60)
