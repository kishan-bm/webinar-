import subprocess
import zipfile
import io
import os

doc_id = "1za8GHW2jVXz6fX-TzaIXACXRZr-ly28Q" # Doc 3
export_url = f"https://docs.google.com/document/d/{doc_id}/export?format=zip"
output_zip = "/Users/kishanbm/webinar-/blog-admin/scratch/doc3.zip"

print(f"Downloading from {export_url} using curl...")
try:
    subprocess.run(["curl", "-L", "-o", output_zip, export_url], check=True)
    
    print("Extracting zip...")
    with zipfile.ZipFile(output_zip) as z:
        for file_info in z.infolist():
            print(f"File in zip: {file_info.filename}")
            # Extract to target directory
            target_path = os.path.join("/Users/kishanbm/webinar-/blog-admin/public/blogs/blog3", file_info.filename)
            os.makedirs(os.path.dirname(target_path), exist_ok=True)
            with open(target_path, "wb") as f:
                f.write(z.read(file_info.filename))
            print(f"Extracted to: {target_path}")
            
except Exception as e:
    print(f"Error: {e}")
