const path = require('path');
const fs = require('fs');
const process = require('process');
const { stdout} = process;
const readline = require('readline');

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const currentPath = path.join(__dirname, 'notes.txt');
const outStream = fs.createWriteStream(currentPath);

stdout.write('\nHello, friend!\nPS: Write your text below. Dont forget press Ctrl+C or write <exit>+press<Enter> to exit\n');

rl.on('line', (line) => {

  if (line.trim() === 'exit') {
    rl.close();
  }
  outStream.write(line + '\n');
});

rl.on('close', () => process.exit(0));
process.on('exit', () => console.log('\nGoodbuy, friend.'));

