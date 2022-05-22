const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const pathTemplate = path.join(__dirname, 'template.html');
const pathIndexHtml = path.join(__dirname, 'project-dist', 'index.html');
const pathStyleCss = path.join(__dirname, 'project-dist', 'style.css');


let dataTemplate = '';

const readTemplate = (path) => {
  let dataTemp = '';
  const rs = fs.createReadStream(path, 'utf-8');

  rs.on('data', (chunk) => dataTemp += chunk);
  rs.on('end', () => console.log(dataTemp));

  // let finder = dataTemp.match(/{{.*}}/);
  // console.log(finder);
  console.log(dataTemp);
  return dataTemp;
};

console.log(readTemplate(pathTemplate));
// /{{.*}}/g
// '12-34-56'.replace( /-/g, ":" )