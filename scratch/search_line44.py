with open("/Users/kishanbm/.gemini/antigravity-ide/brain/67d8db9e-0fc7-402f-9820-f3a3b2d1c286/scratch/pricing_text.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

line44 = lines[44]

# Let's clean line 44 by replacing tags with newlines and collapsing multiple newlines
import re
cleaned = re.sub(r'<[^>]+>', '\n', line44)
cleaned = re.sub(r'\n+', '\n', cleaned)

# Let's save it to a file
with open("/Users/kishanbm/.gemini/antigravity-ide/brain/67d8db9e-0fc7-402f-9820-f3a3b2d1c286/scratch/cleaned_line44.txt", "w") as out:
    out.write(cleaned)

# Print lines that look like clean text
cleaned_lines = cleaned.split('\n')
print(f"Total cleaned lines: {len(cleaned_lines)}")
count = 0
for i, l in enumerate(cleaned_lines):
    l_str = l.strip()
    if len(l_str) > 5 and not l_str.startswith('.') and not l_str.startswith('#') and '{' not in l_str and '}' not in l_str and ':' not in l_str:
        print(f"{i}: {l_str}")
        count += 1
        if count > 100:
            break
