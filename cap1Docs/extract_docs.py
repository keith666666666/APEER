#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Extract text from Word documents (.docx files)
"""
import zipfile
import xml.etree.ElementTree as ET
import os
import sys
import re

# Fix Windows console encoding
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

def extract_text_from_docx(docx_path):
    """Extract text content from a .docx file"""
    try:
        with zipfile.ZipFile(docx_path, 'r') as zip_ref:
            # Read the main document XML
            xml_content = zip_ref.read('word/document.xml')
            root = ET.fromstring(xml_content)
            
            # Define namespace
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            # Extract all text from paragraphs
            text_content = []
            for paragraph in root.findall('.//w:p', ns):
                para_text = []
                for node in paragraph.iter():
                    if node.tag.endswith('}t'):  # Text node
                        if node.text:
                            para_text.append(node.text)
                if para_text:
                    text_content.append(''.join(para_text))
            
            return '\n'.join(text_content)
    except Exception as e:
        return f"Error extracting {docx_path}: {str(e)}"

# Extract all .docx files in current directory
docx_files = [f for f in os.listdir('.') if f.endswith('.docx')]

for docx_file in docx_files:
    print(f"Extracting {docx_file}...")
    text = extract_text_from_docx(docx_file)
    output_file = docx_file.replace('.docx', '.txt')
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"Saved to {output_file}")

print("\nDone!")

