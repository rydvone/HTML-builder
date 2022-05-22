const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const pathStyles = path.join(__dirname, 'styles');
const pathBundle = path.join(__dirname, 'project-dist', 'bundle.css');

const getFiles = async (path) => {
  return await fsPromises.readdir(path, { withFileTypes: true });
};

const copyData = async (files) => {
  const ws = fs.createWriteStream(pathBundle);

  files.forEach((el) => {
    const rs = fs.createReadStream( path.join(__dirname, 'styles', el), 'utf-8');
    let dataTemp = '';
    rs.on('data', chunk => dataTemp += chunk);
    rs.on('end', () => 
      fs.appendFile(pathBundle, 
        dataTemp, 
        (err) => {if (err) console.log(err.message)}));
    rs.on('error', error => console.log('Error', error.message));
  });
};

async function workDir() {
  let curFiles = await getFiles(pathStyles);
  let cssFiles = curFiles.filter((el) => el.isFile() && path.extname(el.name) === '.css');
  cssFiles = cssFiles.map((el) => el.name);
  await copyData(cssFiles);
}

try {
  workDir();
} catch (error) {
  console.log(error.message);
}

