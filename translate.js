const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

const arabicRegex = /([\u0600-\u06FF\s0-9]+(?:\([\u0600-\u06FFa-zA-Z0-9\s-]+\))?[\u0600-\u06FF]*)/g;

function processFile(filePath) {
   let content = fs.readFileSync(filePath, 'utf8');

   // Very basic and unsafe if not careful, so instead let's just do manual string substitutions for a few files using sed.
}

console.log("Not running complex Regex as it could break JSX.");
