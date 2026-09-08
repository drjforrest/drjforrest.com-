#!/usr/bin/env python3

import os
import sys
import markdown
from weasyprint import HTML, CSS
from pathlib import Path

def convert_markdown_to_pdf(markdown_path, output_path=None):
    """
    Convert a markdown file to a stylized PDF.
    
    Args:
        markdown_path: Path to the markdown file
        output_path: Path where PDF should be saved (optional)
    """
    # Read the markdown file
    with open(markdown_path, 'r', encoding='utf-8') as f:
        markdown_content = f.read()
    
    # Convert markdown to HTML
    html = markdown.markdown(markdown_content, extensions=['extra', 'nl2br'])
    
    # Add custom CSS styling
    css = CSS(string='''
        @page {
            margin: 2cm;
            @bottom-right {
                content: "Page " counter(page) " of " counter(pages);
                font-size: 9pt;
                color: #666;
            }
        }
        
        body {
            font-family: Georgia, serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #333;
        }
        
        h1, h2, h3, h4, h5, h6 {
            font-family: 'Helvetica', sans-serif;
            color: #03312E;
            margin-top: 1.2em;
            margin-bottom: 0.6em;
        }
        
        h1 {
            font-size: 24pt;
            border-bottom: 2px solid #49A078;
            padding-bottom: 10px;
        }
        
        h2 {
            font-size: 18pt;
            color: #4281A4;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
        }
        
        h3 {
            font-size: 14pt;
            color: #673C4F;
        }
        
        a {
            color: #4281A4;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
        
        ul, ol {
            margin-bottom: 1em;
        }
        
        li {
            margin-bottom: 0.3em;
        }
        
        code {
            font-family: 'Courier New', monospace;
            background-color: #f5f5f5;
            padding: 2px 4px;
            border-radius: 3px;
        }
        
        pre {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1em 0;
        }
        
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        
        blockquote {
            border-left: 4px solid #49A078;
            margin: 1em 0;
            padding-left: 1em;
            color: #666;
            font-style: italic;
        }
        
        hr {
            border: none;
            border-top: 1px solid #eee;
            margin: 2em 0;
        }
    ''')
    
    # Wrap content in a basic HTML structure
    full_html = f'''
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Dr. Jamie Forrest - Curriculum Vitae</title>
    </head>
    <body>
        {html}
    </body>
    </html>
    '''
    
    # Determine output path if not provided
    if output_path is None:
        markdown_file = Path(markdown_path)
        output_path = markdown_file.with_suffix('.pdf')
    
    # Generate PDF
    HTML(string=full_html).write_pdf(output_path, stylesheets=[css])
    
    print(f"PDF successfully generated: {output_path}")
    return output_path

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python markdown_to_pdf.py <markdown_file> [output_file]")
        sys.exit(1)
    
    markdown_path = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) > 2 else None
    
    if not os.path.exists(markdown_path):
        print(f"Error: File not found: {markdown_path}")
        sys.exit(1)
    
    convert_markdown_to_pdf(markdown_path, output_path)