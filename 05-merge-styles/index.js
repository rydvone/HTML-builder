const path = require('path');
const process = require('process');
const fs = require('fs');
const fsPromises = require('fs/promises');

const pathStyles = path.join(__dirname, 'styles');
const pathBundle = path.join(__dirname, 'project-dist', 'bundle.css');


const delFromFilesCopy = async (path) => {
  await fsPromises.rm(path);
};

const copyAllFiles = async (path, pathCopy) => {
  await fsPromises.copyFile(path, pathCopy);
};

const getFiles = async (path) => {
  return await fsPromises.readdir(path, { withFileTypes: true });
};

async function workDir() {

  let curFiles = await getFiles(pathStyles);
  // let resExtnameIn = path.extname(el.name);

  console.log('curFilesCopy       1 =     ');
  console.log(curFiles);
  let cssFiles = curFiles.filter((el) => el.isFile() && path.extname(el.name) === '.css');
  cssFiles = cssFiles.map((el) => el.name);
  console.log(cssFiles);
  // curFilesCopy.forEach((el) => {
  //   let pathDel = path.join(__dirname, 'files-copy', el);
  //   delFromFilesCopy(pathDel);
  // });

  // await delFromFilesCopy(curFilesCopy);

  // curFilesCopy = await getFiles(pathFolderCopy);
  // console.log('curFilesCopy after del =   ' + curFilesCopy);

  // const curFiles = await getFiles(pathFolder);
  // curFiles.forEach((el) => {
  //   let pathSrc = path.join(__dirname, 'files', el);
  //   let pathDest = path.join(__dirname, 'files-copy', el);
  //   copyAllFiles(pathSrc, pathDest);
  // });
  // curFilesCopy = await getFiles(pathFolderCopy);
  // console.log('curFilesCopy final =   ' + curFilesCopy);
}

try {
  workDir();
} catch (error) {
  console.log(error.message);
}

