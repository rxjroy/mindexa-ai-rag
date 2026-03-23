const fs = require('fs');
const path = require('path');
fs.copyFileSync(
  path.join(__dirname, 'logo', 'Futuristic Modern Black and White Logo.png'),
  path.join(__dirname, 'public', 'logo.png')
);
console.log('Copied successfully!');
