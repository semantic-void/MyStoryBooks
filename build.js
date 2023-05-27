const fs = require('fs');
const path = require('path');
const viewsDir = path.join(__dirname, 'views');

// Read all .hbs files in the views directory
const files = fs.readdirSync(viewsDir).filter((file) => file.endsWith('.hbs'));

// Create the views.js file with the list of .hbs files
const viewsFilePath = path.join(__dirname, 'public/views.js');
const viewsContent = `module.exports = ${JSON.stringify(files)};`;
fs.writeFileSync(viewsFilePath, viewsContent);

console.log('Views list generated successfully.');
