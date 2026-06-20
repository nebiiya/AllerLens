# Use an official lightweight Python image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies, specifically Tesseract OCR
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app code into the container
COPY . .

# Expose the port Flask runs on 
EXPOSE 5000

# Run the application using Gunicorn (Standard for production Flask apps)
# IMPORTANT: Change "app:app" if your main python file is named something else.
# For example, if your file is "main.py", change this to "main:app"
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]