from pdf2image import convert_from_path
import os

pdf_path = "C:/Users/Jaimin/Downloads/Comprehensive Health Data Analysis for Early Dementia Diagnosis A Machine Learning Approach.pdf"
output_folder = "extracted_images"
os.makedirs(output_folder, exist_ok=True)

# Convert PDF to images
images = convert_from_path(pdf_path)

for page_num, image in enumerate(images):
    img_filename = f"{output_folder}/page_{page_num+1}.png"
    image.save(img_filename, "PNG")
    print(f"Saved: {img_filename}")
