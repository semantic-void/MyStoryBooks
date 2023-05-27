const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const viewsDir = path.join(__dirname, 'views');
const outputDir = path.join(__dirname, 'public', 'views');

// Read the Handlebars templates from the views directory
fs.readdirSync(viewsDir).forEach(file => {
  const filePath = path.join(viewsDir, file);
  const template = fs.readFileSync(filePath, 'utf-8');

  // Compile the template
  const compiledTemplate = handlebars.compile(template);

  // Generate the output file path
  const outputFile = path.join(outputDir, file.replace('.hbs', '.html'));

  // Render the template and write the output file
  const output = compiledTemplate();
  fs.writeFileSync(outputFile, output);

  console.log(`Template ${file} compiled successfully.`);
});

console.log('Build process completed.');
