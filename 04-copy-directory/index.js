const path = require('path');
const fsPromises = require('fs/promises');

const pathFolder = path.join(__dirname, 'files');
const pathFolderCopy = path.join(__dirname, 'files-copy');

const getFiles = async (path) => {
  return await fsPromises.readdir(path, { withFileTypes: true });
};

const makeDir = async (path) => {
  await fsPromises.mkdir(
    path,
    { recursive: true },
    (err) => {
      if (err) throw console.log(err.message);
    }
  );
};

const delFiles = async (pth) => {
  let curList = await fsPromises.readdir(pth);
  for (const el of curList) {
    let checkIsFile = (await fsPromises.lstat(path.join(pth, el))).isFile();
    if (checkIsFile) {
      await fsPromises.rm(path.join(pth, el), {recursive: true});
    } else {
      await delFiles(path.join(pth, el));
    }
  }
};

const delFolders = async (pth) => {
  await fsPromises.rm(pth, { recursive: true });
};

const delFoldersFiles = async (pth) => {
  let curFiles = await getFiles(__dirname);
  let findDist = curFiles.find(
    (el) => el.isDirectory() && el.name === 'files-copy'
  );
  if (findDist) {
    await delFiles(pth);
    await delFolders(pth);
  }
};

const copyCurFile = async (path, pathCopy) => {
  await fsPromises.copyFile(path, pathCopy);
};

const copyFolder = async (from, to) => {
  await makeDir(to);
  let curList = await fsPromises.readdir(from);
  for (const el of curList) {
    let checkIsFile = (await fsPromises.lstat(path.join(from, el))).isFile();
    if (checkIsFile) {
      await copyCurFile(path.join(from, el), path.join(to, el));
    } else {
      await copyFolder(path.join(from, el), path.join(to, el));
    }
  }
};


async function mainFn() {
  try {
    await delFoldersFiles(pathFolderCopy);
    await makeDir(pathFolderCopy);
    await copyFolder(pathFolder, pathFolderCopy);    
  } catch (error) {
    console.log(error.message);
  }  
}

mainFn();


