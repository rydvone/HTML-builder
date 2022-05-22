const path = require('path');
const process = require('process');
const fs = require('fs');
const fsPromises = require('fs/promises');

const pathFolder = path.join(__dirname, 'files');
const pathFolderCopy = path.join(__dirname, 'files-copy');

const makeDir = async (path) => {
  await fsPromises.mkdir(
    path,
    { recursive: true },
    (err) => {
      if (err) throw console.log(err.message);
    }
  );
};

const delFromFilesCopy = async (path) => {
  await fsPromises.rm(path);
};
// const delFromFilesCopy = async (files) => {
//   files.forEach((el) => {
//     let pathDel = path.join(__dirname, 'files-copy', el);
//     fsPromises.rm(pathDel);
//   });
// };

const copyAllFiles = async (path, pathCopy) => {
  await fsPromises.copyFile(path, pathCopy);
};

const getFiles = async (path) => {
  return await fsPromises.readdir(path);
};

async function workDir() {
  await makeDir(pathFolderCopy);
  let curFilesCopy = await getFiles(pathFolderCopy);

  console.log('curFilesCopy       1 =     ' + curFilesCopy);
  curFilesCopy.forEach((el) => {
    let pathDel = path.join(__dirname, 'files-copy', el);
    delFromFilesCopy(pathDel);
  });

  // await delFromFilesCopy(curFilesCopy);

  curFilesCopy = await getFiles(pathFolderCopy);
  console.log('curFilesCopy after del =   ' + curFilesCopy);

  const curFiles = await getFiles(pathFolder);
  curFiles.forEach((el) => {
    let pathSrc = path.join(__dirname, 'files', el);
    let pathDest = path.join(__dirname, 'files-copy', el);
    copyAllFiles(pathSrc, pathDest);
  });
  curFilesCopy = await getFiles(pathFolderCopy);
  console.log('curFilesCopy final =   ' + curFilesCopy);
}

try {
  workDir();
} catch (error) {
  console.log(error.message);
}

