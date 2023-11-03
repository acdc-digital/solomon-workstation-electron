# MASTER-CODEBLOCK
##################################

# Add import statements 
import nltk
from nltk.corpus import stopwords
import os
import pandas as pd
from pdfminer.high_level import extract_text, extract_pages
from tqdm import tqdm

def process_pdfs(progress_var=None):  # <- Don't forget to add this argument
    nltk.download('stopwords')
    stop_words = set(stopwords.words('english'))
    MAX_CELL_SIZE = 11250
    pdf_directory = '/Users/matthewsimon/Documents/GitHub/acdc.tkinterChat/tk-chatDev/source_docs'
    data = []

    # Calculate the total number of PDF files and the step value for the progress bar
    pdf_files = [f for f in os.listdir(pdf_directory) if f.endswith('.pdf')]
    total_files = len(pdf_files)
    step = 100 / total_files if total_files else 0  # <- Don't forget this line

    for i, pdf_file in enumerate(tqdm(pdf_files)):
        file_path = os.path.join(pdf_directory, pdf_file)
        try:
            print(f"Processing {pdf_file}...")
            text = extract_text(file_path)
            if not text:
                print(f"Extracted text is empty for {pdf_file}")
                continue

            text_words_set = set(text.lower().split())
            filtered_words_set = text_words_set - stop_words
            filtered_text = ' '.join(filtered_words_set)

            # Basic heuristic: Assuming title is the first line and summary is the second line
            lines = text.split('\n')
            title = lines[0] if len(lines) > 0 else ''
            summary = lines[1] if len(lines) > 1 else ''

            # Metadata extraction
            file_size = os.path.getsize(file_path)
            number_of_pages = len(list(extract_pages(file_path)))

            # Filter Stopwords
            text_words = text.split()
            filtered_words = [word for word in text_words if word.lower() not in stop_words]
            filtered_text = ' '.join(filtered_words)

            # Text normalization
            text = text.lower()

            # Chunking the content
            chunks = [filtered_text[i:i+MAX_CELL_SIZE] for i in range(0, len(filtered_text), MAX_CELL_SIZE)]
            for chunk in chunks:
                data.append({
                     'filename': pdf_file,
                     'title_or_heading': title,
                      'content_summary': summary,
                      'content_chunk': chunk,
                      'file_size': file_size,
                      'number_of_pages': number_of_pages
                    })

            # Update the progress bar
            if progress_var:
                progress_var.set((i + 1) * step)

        except Exception as e:
            print(f"Error processing {pdf_file}: {e}")

    # Convert the list to a DataFrame
    df = pd.DataFrame(data)
    
    # Save the DataFrame to a CSV for further analysis with escapechar
    df.to_csv('/Users/matthewsimon/Documents/GitHub/acdc.tkinterChat/tk-chatDev/source_csv/source_docs.csv', index=False, escapechar='\\')

    # Create a list of unique filenames
    unique_filenames = list(set([file['filename'] for file in data]))

    return unique_filenames

## print("Listing directory contents:")
## print(os.listdir(pdf_directory))