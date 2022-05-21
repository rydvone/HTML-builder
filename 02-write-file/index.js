const path = require('path');
const fs = require('fs');
const process = require('process');
const { stdin, stdout, exit } = process;
const readline = require('readline');
// const EventEmitter = require('events');
// const em = new EventEmitter();
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const currentPath = path.join(__dirname, 'notes.txt');
const outStream = fs.createWriteStream(currentPath);
// const inStream = fs.createReadStream();

stdout.write('\nHello, friend!\nPS: Write your text below. Dont forget press Ctrl+C or write <exit> to the end your message\n');
let i = 1;
rl.on('line', (line) => {
  let arrTemp = line.split(' ');
  let findExit = arrTemp.includes('exit');
  
  if (findExit) {
    rl.close();

  }

  outStream.write(line + '\n')
  console.log('line-' + i + ': ' + line + '\n');
  i++;
});

rl.on('close', () => process.exit(0));
process.on('exit', () => console.log('\nGoodbuy, friend.'));
