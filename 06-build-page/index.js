const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const pathDist = path.join(__dirname, 'project-dist');
const pathComponents = path.join(__dirname, 'components');
const pathStyles = path.join(__dirname, 'styles');
const pathAssets = path.join(__dirname, 'assets');
const pathTemplate = path.join(__dirname, 'template.html');
const pathIndexHtml = path.join(__dirname, 'project-dist', 'index.html');
const pathStyleCss = path.join(__dirname, 'project-dist', 'style.css');

// let dataTemplate = '';

const delFolderFile = async (pth) => {
  await fsPromises.rmdir(pth, { recursive: true, force: true }, ((err) => {
    if (err) throw err;
  }));
};

async function workDir() {
  try {
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
    console.log(cssFiles);
    // merge css files 
    await mergeCss(cssFiles);

    const pathFrom = path.join(__dirname, 'assets');
    const pathTo = path.join(__dirname, 'project-dist', 'assets');

    // await copyFiles(pathAssets);

    // copy assets to project-dist
    // let someth = await copyFolder(pathFrom, pathTo);
    // console.log(someth);


    await delFolderFile(pathDist);
  } catch (error) {
    console.log('error is: ' + error.message);
  }
}

workDir();

