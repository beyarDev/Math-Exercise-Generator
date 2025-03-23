const PDFDocument = require('pdfkit');
const fs = require('fs');
const args = process.argv.slice(2);
// Function to generate a random number within a range
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Function to generate a single math exercise
const generateExercise = (operation) => {
    let num1, num2, question, answer;

    switch (operation) {
        case 'add':
            num1 = getRandomNumber(1, 10);
            num2 = getRandomNumber(1, 10);
            while(num1 + num2 > 10){
                num1 = getRandomNumber(1, 10);
                num2 = getRandomNumber(1, 10); 
            }
            question = `${num1} + ${num2} = `;
            answer = num1 + num2;
            break;
        case 'subtract':
            num1 = getRandomNumber(1, 10);
            num2 = getRandomNumber(1, 10);
            if (num1 < num2) {
                [num1, num2] = [num2, num1]; // Swap to ensure num1 >= num2
            }
            question = `${num1} - ${num2} = `;
            answer = num1 - num2;
            break;
        case 'multiply':
            num1 = getRandomNumber(2, 12);
            num2 = getRandomNumber(2, 12);
            question = `${num1} * ${num2} = `;
            answer = num1 * num2;
            break;
        case 'divide':
            num2 = getRandomNumber(1, 10);
            answer = getRandomNumber(1, 10);
            num1 = num2 * answer; // Ensure num1 is always a multiple of num2
            question = `${num1} / ${num2} = `;
            break;
    }

    return { question, answer };
}

// Function to generate a PDF with math exercises
const generatePDF = (fileName, pages, exercisesPerPage, withAnswers) => {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(fileName));

    const operations = [ 'add',"add", 'subtract'];
    const answers = [];

    for (let page = 0; page < pages; page++) {
        if (page > 0) {
            doc.addPage();
        }
        if(page == 0){
        doc.fontSize(15).text('Math Exercises', { align: 'center' });
            doc.moveDown(2);
        }
        

        for (let i = 0; i < exercisesPerPage; i++) {
            const operation = operations[(page * exercisesPerPage + i) % operations.length];
            const { question, answer } = generateExercise(operation);
            answers.push({ index: page * exercisesPerPage + i + 1, answer });
            doc.fontSize(12).text(`${question}`);
            doc.moveDown(1);
        }
        doc.fontSize(13).text(`Page ${page + 1}`, { align: 'right' });

    }

    const itemsPerRow = 3;
    const itemWidth = 150;
    const itemHeight = 20;
    const margin = 40;
    const maxRowsPerPage = 25;
    const tableTop = 100;

    let currentPageAnswers = [];
    if(withAnswers){

    answers.forEach((answer, index) => {
        currentPageAnswers.push(answer);
        
        if (currentPageAnswers.length === maxRowsPerPage * itemsPerRow || index === answers.length - 1) {
            doc.addPage();
            doc.fontSize(15).text('Answers', { align: 'center' });
            doc.moveDown(2);

            drawTableBorders(doc, margin, tableTop, maxRowsPerPage, itemsPerRow);
            renderAnswers(doc, margin, tableTop, currentPageAnswers, itemsPerRow, itemWidth, itemHeight, maxRowsPerPage);
            
            currentPageAnswers = [];
        }
    });
    }
    

    doc.end();
}

const drawTableBorders = (doc, startX, startY, rows, cols) => {
    for (let i = 0; i <= rows; i++) {
        doc.moveTo(startX, startY + i * 20)
           .lineTo(startX + cols * 150, startY + i * 20)
           .stroke();
    }
    for (let i = 0; i <= cols; i++) {
        doc.moveTo(startX + i * 150, startY)
           .lineTo(startX + i * 150, startY + rows * 20)
           .stroke();
    }
}

const renderAnswers = (doc, startX, startY, answers, itemsPerRow, itemWidth, itemHeight, maxRowsPerPage) => {
    answers.forEach((answer, index) => {
        const col = index % itemsPerRow;
        const row = Math.floor(index / itemsPerRow);
        
        const x = startX + col * itemWidth;
        const y = startY + row * itemHeight;
        
        doc.fontSize(12).text(`${answer.index}.  ${answer.answer}`, x + 5, y + 5, {
            width: itemWidth - 10,
            align: 'left',
        });
    });
}

// Generate a PDF with 10 pages, each containing 10 exercises
generatePDF('math_exercises-year-one.pdf', args[0] || 10, 20,false);
