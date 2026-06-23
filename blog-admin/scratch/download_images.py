import os
import urllib.request
import zipfile
import shutil
import ssl

DOCS = {
    "blog1": "1-bqOD10lEsp_cXEaHvw2EJUGohdnPeYt",
    "blog50": "1vlShmNUzJ7uIGg5zA_eqgk0eR4lKXdAr"
}

BASE_DIR = "/Users/kishanbm/webinar-/blog-admin/public/images/posts"

def download_docx_and_extract_images(name, doc_id):
    url = f"https://docs.google.com/document/d/{doc_id}/export?format=docx"
    dest_zip = f"/tmp/{name}.zip"
    print(f"Downloading {name} as docx from {url}...")
    
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}
    )
    
    # Bypass SSL context verification for Python on macOS
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    with urllib.request.urlopen(req, context=ctx) as response, open(dest_zip, 'wb') as out_file:
        out_file.write(response.read())
        
    print(f"Downloaded. Extracting images...")
    
    dest_dir = os.path.join(BASE_DIR, name)
    os.makedirs(dest_dir, exist_ok=True)
    
    image_count = 1
    with zipfile.ZipFile(dest_zip, 'r') as z:
        for filename in sorted(z.namelist()):
            if filename.startswith("word/media/"):
                ext = os.path.splitext(filename)[1]
                out_name = f"image{image_count}{ext}"
                target_path = os.path.join(dest_dir, out_name)
                
                with z.open(filename) as source, open(target_path, "wb") as target:
                    shutil.copyfileobj(source, target)
                print(f"Extracted {filename} to {target_path}")
                image_count += 1
                
    try:
        os.remove(dest_zip)
    except:
        pass

if __name__ == "__main__":
    for name, doc_id in DOCS.items():
        download_docx_and_extract_images(name, doc_id)
    print("Done extracting images!")
