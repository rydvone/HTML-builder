const fs = require('fs');
const path = require('path');
const { stdout } = process;
const inputStream = fs.createReadStream(
  path.join(__dirname, 'text.txt'),
  'utf-8');

inputStream.on('data', (ch) => stdout.write(ch));
// inputStream.on('end', () => console.log('the end'));
inputStream.on('error', (err) => console.log(err.message));

