const path = require('path');
const process = require('process');
const fs = require('fs');
const fsPromises = require('fs/promises');

const pathFolder = path.join(__dirname, 'files');
const pathFolderCopy = path.join(__dirname, 'files-copy');



async function delPrevFiles(path) {
  fsPromises.readdir(path, (err, files) => {
    if (err) throw err;
    for (let file of files) {
      fs.stat('file.txt', (errStat, status) => {
        if (errStat) throw errStat;

        if (status.isDerictory()) {
          console.log('folder: ' + file);
          delPrevFiles(path + '/' + file); // продолжаем рекурсию
        } else {
          console.log('file: ' + file);
        }
      });
    }
  });
}
// const delPrevFile = async () => {
// }
async function copyAllFiles(path, pathCopy) {
  await fsPromises.copyFile(path, pathCopy);
}


async function workDir() {
  await fsPromises.mkdir(
    pathFolderCopy,
    { recursive: true },
    (err) => {
      if (err) throw console.log(err.message);
    }
  );
  const curFiles = await fsPromises.readdir(pathFolder);
    // ,(err) => {
    //   if (err) throw console.log(err.message);
    // });

  console.log('files - ', curFiles);
  curFiles.forEach((el) => {
    let pathSrc = path.join(__dirname, 'files', el);
    let pathDest = path.join(__dirname, 'files-copy', el);
    console.log('path 1 = ' + pathSrc + '\npath 2 = ' + pathDest);
    copyAllFiles(pathSrc, pathDest);
  });
  // await fsPromises.copyFile(
  //   pathFolder,
  //   pathFolderCopy,
  //   { recursive: true },
  //   (err) => {
  //     if (err) throw console.log(err.message);
  //   }
  // );

  // await delPrevFiles(pathFolderCopy);
}



try {
  workDir();
} catch (error) {
  console.log(error.message);
}


// fs.mkdir(folderPathCopy,
//   { recursive: true },
//   (err) => {
//     if(err) throw console.log(err.message);
//     console.log('ok');
// });

// fs.readdir(folderPath,
//   { recursive: true },
//   (err) => {
//     if(err) throw console.log(err.message);
//     console.log('ok');
// });

// fs.rmdir(folderPathCopy,
//   { recursive: true },
//   (err) => {
//     if(err) throw console.log(err.message);
//     console.log('ok');
// });

