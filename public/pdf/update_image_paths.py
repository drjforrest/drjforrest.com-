#!/usr/bin/env python3
"""
Script to help match PDF filenames to data entries and update image paths.
Run this after generating thumbnails to get the correct image paths.
"""
import os
from pathlib import Path

def list_pdf_files_and_thumbnails():
    pdf_dir = Path(".")
    thumbnails_dir = pdf_dir / "thumbnails"
    
    print("=== PDF FILES ===")
    pdf_files = []
    for pdf_file in sorted(pdf_dir.glob("*.pdf")):
        if pdf_file.name != "create_thumbnails_pdfs.py":
            pdf_files.append(pdf_file.name)
            print(f"{len(pdf_files):2d}. {pdf_file.name}")
    
    print(f"\nFound {len(pdf_files)} PDF files")
    
    if thumbnails_dir.exists():
        print("\n=== THUMBNAIL FILES ===")
        thumbnail_files = []
        for thumb_file in sorted(thumbnails_dir.glob("*.png")):
            thumbnail_files.append(thumb_file.name)
            print(f"{len(thumbnail_files):2d}. {thumb_file.name}")
        print(f"\nFound {len(thumbnail_files)} thumbnail files")
    else:
        print("\n=== NO THUMBNAILS FOUND ===")
        print("Run the thumbnail generation script first:")
        print("python3 create_thumbnails_pdfs.py")
    
    return pdf_files

if __name__ == "__main__":
    print("PDF and Thumbnail Inventory")
    print("=" * 50)
    list_pdf_files_and_thumbnails()