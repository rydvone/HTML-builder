const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const pathDist = path.join(__dirname, 'project-dist');
const pathDistAssets = path.join(__dirname, 'project-dist', 'assets');
const pathComponents = path.join(__dirname, 'components');
const pathStyles = path.join(__dirname, 'styles');
const pathAssets = path.join(__dirname, 'assets');
const pathTemplate = path.join(__dirname, 'template.html');
const pathIndexHtml = path.join(__dirname, 'project-dist', 'index.html');
const pathStyleCss = path.join(__dirname, 'project-dist', 'style.css');

const makeDir = async (path) => {
  await fsPromises.mkdir(
    path,
    { recursive: true },
    (err) => {
      if (err) throw console.log(err.message);
    }
  );
};

const getFiles = async (path) => {
  return await fsPromises.readdir(path, { withFileTypes: true });
};

const getComponentsData = async (files) => {
  let objComponentsData = {};
  for (const el of files) {
    const rs = fs.createReadStream(
      path.join(__dirname, 'components', el),
      'utf-8'
    );
    let dataTemp = '';
    for await (const chunk of rs) {
      dataTemp += chunk;
    }
    objComponentsData[el.slice(0, -5)] = dataTemp;
  }
  return objComponentsData;
};

const getTemplateData = async (path) => {
  const rs = fs.createReadStream(path, 'utf-8');
  let dataTemp = '';
  for await (const chunk of rs) {
    dataTemp += chunk;
  }
  return dataTemp;
};

const makeIndexHtmlData = async (templateData, componentsData) => {
  let res = templateData;
  for (let key in componentsData) {
    let re = new RegExp(`{{${key}}}`);
    res = res.replace(re, componentsData[key]);
  }
  return res;
};

const writeIndexHtml = async (data, path) => {
  const ws = fs.createWriteStream(path, 'utf-8');
  ws.write(data);
  ws.end();
};

const mergeCss = async (files) => {
  const ws = fs.createWriteStream(pathStyleCss);
  files.forEach((el) => {
    const rs = fs.createReadStream(path.join(__dirname, 'styles', el), 'utf-8');
    let dataTemp = '';
    rs.on('data', chunk => dataTemp += chunk);
    rs.on('end', () =>
      fs.appendFile(pathStyleCss,
        dataTemp,
        (err) => { if (err) console.log(err.message) }));
    rs.on('error', (err) => console.log('error:', err.message));
  });
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

const delFiles = async (pth) => {
  let curList = await fsPromises.readdir(pth);
  for (const el of curList) {
    let checkIsFile = (await fsPromises.lstat(path.join(pth, el))).isFile();
    if (checkIsFile) {
      await fsPromises.rm(path.join(pth, el));
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
    (el) => el.isDirectory() && el.name === 'project-dist'
  );
  if (findDist) {
    await delFiles(pth);
    await delFolders(pth);
  }
};


async function mainFn() {
  try {
    // delete project-dist before new build
    await delFoldersFiles(pathDist);

    await makeDir(pathDist);
    
    let curFiles = await getFiles(pathComponents);
    // get object w content html components
    let componentsFiles = curFiles.filter(
      (el) => el.isFile() && path.extname(el.name) === '.html'
    );
    componentsFiles = componentsFiles.map((el) => el.name);
    // let componentsFilesFinder = componentsFiles.map((el) => el.slice(0, -5));
    let componentsData = await getComponentsData(componentsFiles);

    // get data w content html template
    let templateData = await getTemplateData(pathTemplate);

    // make data w content html template + components
    let indexHtmlData = await makeIndexHtmlData(templateData, componentsData);
    
    // write data html to file
    await writeIndexHtml(indexHtmlData, pathIndexHtml);

    // get name css files 
    curFiles = await getFiles(pathStyles);
    let cssFiles = curFiles.filter((el) => el.isFile() && path.extname(el.name) === '.css');
    cssFiles = cssFiles.map((el) => el.name);
    // merge css files 
    await mergeCss(cssFiles);

    const pathFrom = path.join(__dirname, 'assets');
    const pathTo = path.join(__dirname, 'project-dist', 'assets');

    // copy assets to project-dist
    await copyFolder(pathFrom, pathTo);

  } catch (error) {
    console.log('error is: ' + error.message);
  }
}

mainFn();

