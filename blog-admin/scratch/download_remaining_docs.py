import subprocess
import zipfile
import os

docs = {
    "blog1": "1-bqOD10lEsp_cXEaHvw2EJUGohdnPeYt",
    "blog2": "1vlShmNUzJ7uIGg5zA_eqgk0eR4lKXdAr"
}

for prefix, doc_id in docs.items():
    export_url = f"https://docs.google.com/document/d/{doc_id}/export?format=zip"
    output_zip = f"/Users/kishanbm/webinar-/blog-admin/scratch/{prefix}.zip"
    
    print(f"\nDownloading {prefix} from {export_url} using curl...")
    try:
        res = subprocess.run(["curl", "-L", "-o", output_zip, export_url], capture_output=True)
        if res.returncode != 0:
            print(f"Curl failed for {prefix}")
            continue
            
        print(f"Extracting zip for {prefix}...")
        dest_dir = f"/Users/kishanbm/webinar-/blog-admin/public/blogs/{prefix}"
        os.makedirs(dest_dir, exist_ok=True)
        
        with zipfile.ZipFile(output_zip) as z:
            for file_info in z.infolist():
                print(f"File in zip: {file_info.filename}")
                target_path = os.path.join(dest_dir, file_info.filename)
                os.makedirs(os.path.dirname(target_path), exist_ok=True)
                with open(target_path, "wb") as f:
                    f.write(z.read(file_info.filename))
                print(f"Extracted to: {target_path}")
                
    except Exception as e:
        print(f"Error for {prefix}: {e}")
