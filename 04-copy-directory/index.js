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

  for (const el of curFilesCopy) {
    let pathDel = path.join(__dirname, 'files-copy', el);
    await delFromFilesCopy(pathDel);
  }

  const curFiles = await getFiles(pathFolder);
  for (const el of curFiles) {
    let pathSrc = path.join(__dirname, 'files', el);
    let pathDest = path.join(__dirname, 'files-copy', el);
    await copyAllFiles(pathSrc, pathDest);
  }
}

try {
  workDir();
} catch (error) {
  console.log(error.message);
}

