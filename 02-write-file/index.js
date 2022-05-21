const path = require('path');
const fs = require('fs');
const { stdin, stdout } = process;
const readline = require('readline/promises');
// const EventEmitter = require('events');
// const em = new EventEmitter();


const currentPath = path.join(__dirname, 'notes.txt');
// const inStream = fs.createReadStream();

stdout.write('Hello, friend!\nPS: Write your text below. Dont forget press Ctrl+C or write <exit> in the end your message\n');

process.on('end', () => console.log('buy'));
