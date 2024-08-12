#!/bin/bash

# Name of the output zip file
OUTPUT_ZIP="extension.zip"

# List of files to include in the zip
FILES_TO_ZIP="manifest.json script.js background.js icon128.png"

rm $OUTPUT_ZIP

# Check if all files exist
for file in $FILES_TO_ZIP; do
    if [ ! -f "$file" ]; then
        echo "Error: $file not found!"
        exit 1
    fi
done

# Create the zip file
zip -r $OUTPUT_ZIP $FILES_TO_ZIP

# Check if zip was successful
if [ $? -eq 0 ]; then
    echo "Successfully created $OUTPUT_ZIP"
else
    echo "Error: Failed to create $OUTPUT_ZIP"
    exit 1
fi
