# Math Exercises PDF Generator

## Description
This project generates PDF files containing math exercises for kids. The exercises include addition, subtraction, multiplication, and division problems. The answers are provided in a table format at the end of the PDF.

## Requirements
- Node.js version `v19.8.1` or higher

## Installation and Usage
1. **Install Node.js**: Ensure you have Node.js version `v19.8.1` or higher installed. You can download it from [Node.js official website](https://nodejs.org/).

2. **Clone the Repository**:
   ```bash
   `git clone https://github.com/beyarDev/Math-Exercise-Generator.git`

3. **Navigate to the Project Directory**:
   `cd Math-Exercise-Generator`

4. **Install Dependencies**:
   `npm install`

5. **Run the Project**:
   `node index.js`

6. **Adjust Number of Pages and Exercises**:
 Open index.js in your favorite text editor.
 Locate the generatePDF function call.
 Modify the function parameters to set the number of pages and exercises per page. For example:
   `generatePDF('math_exercises.pdf', 15, 20);` // 15 pages, 20 exercises per page

## The project contain a sample pdf file