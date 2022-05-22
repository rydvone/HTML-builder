const path = require('path');
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
  await fsPromises.rm(path, { recursive: true }, (err) => {if (err) console.log(err.message);});
};

const copyAllFiles = async (path, pathCopy) => {
  await fsPromises.copyFile(path, pathCopy);
};

const getFiles = async (path) => {
  return await fsPromises.readdir(path);
};

async function workDir() {
  await makeDir(pathFolderCopy);
  let curFilesCopy = await getFiles(pathFolderCopy);
  
  curFilesCopy.forEach(async (el) => {
    let pathDel = path.join(__dirname, 'files-copy', el);
    await delFromFilesCopy(pathDel);
  });
  curFilesCopy = await getFiles(pathFolderCopy);

  const curFiles = await getFiles(pathFolder);
  curFiles.forEach((el) => {
    let pathSrc = path.join(__dirname, 'files', el);
    let pathDest = path.join(__dirname, 'files-copy', el);
    copyAllFiles(pathSrc, pathDest);
  });
}

try {
  workDir();
} catch (error) {
  console.log(error.message);
}

