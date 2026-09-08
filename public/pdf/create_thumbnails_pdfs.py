import os
import sys
from pathlib import Path

try:
    from pdf2image import convert_from_path
    import PIL
except ImportError:
    print("Required modules are missing. Please install them with:")
    print("pip install pdf2image pillow")
    print("Note: pdf2image also requires poppler to be installed.")
    print("For macOS: brew install poppler")
    sys.exit(1)

def create_pdf_thumbnails(directory_path, output_dir="thumbnails", thumbnail_size=(1600, 2200), dpi=300):
    """
    Walks through a directory and creates high-resolution PNG thumbnails of each PDF file.
    
    Args:
        directory_path: Path to the directory containing PDF files
        output_dir: Directory where thumbnails will be saved (relative to directory_path)
        thumbnail_size: Size of the thumbnail as (width, height) - default 1600x2200 for near full-size quality (~80% of original)
        dpi: DPI for PDF conversion - higher values give better quality (default 300)
    """
    # Convert to Path object for easier path manipulation
    directory = Path(directory_path)
    
    # Create output directory if it doesn't exist
    thumbnails_dir = directory / output_dir
    thumbnails_dir.mkdir(exist_ok=True)
    
    # Counter for processed files
    pdf_count = 0
    
    # Walk through the directory
    for root, _, files in os.walk(directory):
        root_path = Path(root)
        
        # Skip the thumbnails directory itself
        if output_dir in root_path.parts:
            continue
        
        # Process each file
        for file in files:
            if file.lower().endswith('.pdf'):
                pdf_path = root_path / file
                pdf_count += 1
                
                # Create a thumbnail name based on the PDF filename
                thumbnail_name = f"{pdf_path.stem}.png"
                thumbnail_path = thumbnails_dir / thumbnail_name
                
                try:
                    # Convert first page of PDF to high-resolution image
                    print(f"Processing: {pdf_path}")
                    images = convert_from_path(pdf_path, first_page=1, last_page=1, dpi=dpi)
                    
                    if images:
                        # Get the first page and create a high-quality thumbnail
                        thumb = images[0].copy()
                        thumb.thumbnail(thumbnail_size, PIL.Image.LANCZOS)
                        
                        # Save the thumbnail with high quality
                        thumb.save(thumbnail_path, 'PNG', optimize=True, quality=95)
                        print(f"Created high-res thumbnail: {thumbnail_path} ({thumb.size[0]}x{thumb.size[1]})")
                    else:
                        print(f"Warning: Could not extract images from {pdf_path}")
                        
                except Exception as e:
                    print(f"Error processing {pdf_path}: {e}")
    
    print(f"\nCompleted! Processed {pdf_count} PDF files.")
    print(f"Thumbnails saved to: {thumbnails_dir}")

# Example usage
if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Use directory provided as command line argument
        input_dir = sys.argv[1]
    else:
        # Use current directory if no argument provided
        input_dir = os.getcwd()
        print(f"No directory specified, using current directory: {input_dir}")
    
    create_pdf_thumbnails(input_dir)