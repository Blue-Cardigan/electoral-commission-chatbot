import os
import sys

def search_files(search_string):
    match_count = 0
    for root, dirs, files in os.walk('docs'):
        for file in files:
            if file.endswith('.txt'):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        if search_string in content:
                            match_count += 1
                            print(f"Match found in: {file_path}")
                except UnicodeDecodeError:
                    print(f"Unable to read {file_path} due to encoding issues.")
    return match_count

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py 'search string'")
        sys.exit(1)

    search_string = sys.argv[1]
    matches = search_files(search_string)
    print(f"\nTotal matching files: {matches}")