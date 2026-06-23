import re

html_path = "/Users/kishanbm/webinar-/blog-admin/public/blogs/blog3/Blog59BestOptionsPlatformBeginners.docx.html"
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Let's find all img tags and print their context
img_matches = re.finditer(r'<img[^>]*>', html)

for match in img_matches:
    img_tag = match.group(0)
    start = max(0, match.start() - 300)
    end = min(len(html), match.end() + 300)
    context = html[start:end]
    print(f"\n--- MATCH: {img_tag} ---")
    # clean HTML tags from context for readability
    clean_context = re.sub(r'<[^>]+>', ' ', context)
    print(clean_context.strip()[:600])
