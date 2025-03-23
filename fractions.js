const PDFDocument = require("pdfkit");
const fs = require("fs");
const args = process.argv.slice(2);

// Function to generate a random number within a range
const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Function to generate a single math exercise
const generateExercise = (operation) => {
  let num1, num2, question, answer;
  let bottomNumber;
  switch (operation) {
    case "add":
      num1 = getRandomNumber(1, 100);
      num2 = getRandomNumber(1, 100);
      bottomNumber = getRandomNumber(1, 200);
      while (bottomNumber < num1 || bottomNumber < num2) {
        bottomNumber = getRandomNumber(1, 200);
      }
      question = `${num1} + ${num2}`;
      answer = num1 + num2;
      break;
    case "subtract":
      num1 = getRandomNumber(1, 100000);
      num2 = getRandomNumber(1, 100000);
      if (num1 < num2) {
        [num1, num2] = [num2, num1]; // Swap to ensure num1 >= num2
      }
      bottomNumber = getRandomNumber(1, 20);
      question = `${num1} - ${num2}`;
      answer = num1 - num2;
      break;
    case "multiply":
      num1 = getRandomNumber(2, 12);
      num2 = getRandomNumber(2, 12);
      bottomNumber = getRandomNumber(1, 20);
      question = `${num1} * ${num2}`;
      answer = num1 * num2;
      break;
    case "divide":
      num2 = getRandomNumber(1, 10);
      answer = getRandomNumber(1, 10);
      num1 = num2 * answer; // Ensure num1 is always a multiple of num2
      bottomNumber = getRandomNumber(1, 20);
      question = `${num1} ÷ ${num2}`;
      break;
  }

  return { num1, num2, question, answer, bottomNumber };
};

// Function to generate a PDF with math exercises
const generatePDF = (fileName, pages, exercisesPerPage) => {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(fileName));

  const operations = ["add"]; // Only using addition for now
  const answers = [];

  for (let page = 0; page < pages; page++) {
    if (page > 0) {
      doc.addPage();
    }
    // if (page === 0) {
    //   doc.fontSize(15).text("Math Exercises", { align: "center" });
    //   doc.moveDown(2);
    // }

    for (let i = 0; i < exercisesPerPage; i++) {
      const operation =
        operations[(page * exercisesPerPage + i) % operations.length];
      const { num1, num2, question, answer, bottomNumber } =
        generateExercise(operation);
      answers.push({ index: page * exercisesPerPage + i + 1, answer });

      const startX = 100;
      const startY = doc.y;

      doc.fontSize(14).text(`${num1}`, startX, startY);
      doc.fontSize(14).text(`+`, startX + 30, startY + 15);
      doc.fontSize(14).text(`${num2}`, startX + 60, startY);
      doc.moveDown(0.3);
      const numOneTextLength =
        num1.toString().length > bottomNumber.toString().length
          ? num1.toString().length
          : bottomNumber.toString().length;
      const numTwoTextLength =
        num2.toString().length > bottomNumber.toString().length
          ? num2.toString().length
          : bottomNumber.toString().length;

      // Draw the horizontal line for the denominator

      const lineOneLength = (numOneTextLength / 2) * 14 || 14;
      const lineTwoLength = (numTwoTextLength / 2) * 14 || 14;

      doc
        .moveTo(startX, doc.y)
        .lineTo(startX + lineOneLength, doc.y)
        .stroke();
      doc
        .moveTo(startX + 60, doc.y)
        .lineTo(startX + 60 + lineTwoLength, doc.y)
        .stroke();
      doc.moveDown(0.3);

      const bottomNumOneLength = (bottomNumber.toString().length / 2) * 14;
      const bottomLineOneLength = lineOneLength - bottomNumOneLength;
      const bottomNumOneStartPoint = bottomLineOneLength / 2;

      const bottomNumTwoLength = (bottomNumber.toString().length / 2) * 14;
      const bottomLineTwoLength = lineTwoLength - bottomNumTwoLength;
      const bottomNumTwoStartPoint = bottomLineTwoLength / 2;
      // Draw bottomNumber under num1 and num2 (keep them aligned by using startY)
      doc
        .fontSize(14)
        .text(`${bottomNumber}`, startX + bottomNumOneStartPoint, startY + 28); // Draw under num1
      doc
        .fontSize(14)
        .text(
          `${bottomNumber}`,
          startX + 60 + bottomNumTwoStartPoint,
          startY + 28
        ); // Draw under num2

      doc.moveDown(2);
    }

    // Add page number
    doc.fontSize(13).text(`Page ${page + 1}`, { align: "right" });
  }

  doc.end();
};

// Generate a PDF with 6 pages, each containing 8 exercises
generatePDF("fractions.pdf", args[0] || 6, 8);
