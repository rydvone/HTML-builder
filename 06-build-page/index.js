const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");

const pathDist = path.join(__dirname, "project-dist");
const pathComponents = path.join(__dirname, "components");
const pathStyles = path.join(__dirname, "styles");
const pathAssets = path.join(__dirname, "assets");
const pathTemplate = path.join(__dirname, "template.html");
const pathIndexHtml = path.join(__dirname, "project-dist", "index.html");
const pathStyleCss = path.join(__dirname, "project-dist", "style.css");
const pathTemp = path.join(__dirname, "text.txt");

// let dataTemplate = '';

// const readTemplate = (path) => {
//   let dataTemp = '';
//   const rs = fs.createReadStream(path, 'utf-8');

//   rs.on('data', (chunk) => dataTemp += chunk);
//   rs.on('end', () => console.log(dataTemp));

//   // let finder = dataTemp.match(/{{.*}}/);
//   // console.log(finder);
//   console.log(dataTemp);
//   return dataTemp;
// };

// console.log(readTemplate(pathTemplate));
// /{{.*}}/g
// '12-34-56'.replace( /-/g, ":" )



const makeDir = async (path) => {
  await fsPromises.mkdir(
    path,
    { recursive: true },
    (err) => {
      if (err) throw console.log(err.message);
    }
  );
};

// get list file
const getFiles = async (path) => {
  return await fsPromises.readdir(path, { withFileTypes: true });
};

const getComponentsData = async (files) => {
  let objComponentsData = {};
  for (const el of files) {
    const rs = fs.createReadStream(
      path.join(__dirname, "components", el),
      "utf-8"
    );
    // const chunks = [];
    let dataTemp = "";
    for await (const chunk of rs) {
      // chunks.push(chunk);
      dataTemp += chunk;
      // console.log(chunk);
    }
    objComponentsData[el.slice(0, -5)] = dataTemp;
    // if (el.slice(0, -5) == 'header') {
    //   fs.appendFile(path.join(__dirname, 'components', 'el.html'),
    //     dataTemp,
    //     (err) => {if (err) console.log(err.message)});
    // }
  }
  return objComponentsData;
};

const getTemplateData = async (path) => {
  const rs = fs.createReadStream(path, "utf-8");
  let dataTemp = "";
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
  const ws = fs.createWriteStream(path, "utf-8");
  ws.write(data);
  ws.end();
};

const mergeCss = async (files) => {
  const ws = fs.createWriteStream(pathStyleCss);
  files.forEach((el) => {
    const rs = fs.createReadStream( path.join(__dirname, 'styles', el), 'utf-8');
    let dataTemp = '';
    rs.on('data', chunk => dataTemp += chunk);
    rs.on('end', () => 
      fs.appendFile(pathStyleCss, 
        dataTemp, 
        (err) => {if (err) console.log(err.message)}));
    rs.on('error', (err) => console.log('error:', err.message));
  });
};

// const copyFiles = async (path1) => {
//   fs.readdir(path1, (err, files) => {
//     if(err) console.log('error:', err.message);
//     for (let file of files){
//        fs.stat(path.join(__dirname, file),
//         (errStat, status) => {
//           if(errStat) console.log('error:', errStat.message);

//           if(status.isFile()){
//              console.log('Папка: ' + file);
//              copyFiles(path1 + '/' + file);
//           }else{
//              console.log('Файл: ' + file);
//           }
//        });
//     }
//  });
// };

const copyFolder = async (from, to) => {  
  fs.mkdir(to);
  fs.readdir(from).forEach(element => {
      if (fs.stat(path.join(from, element)).isFile()) {
          fs.copyFile(path.join(from, element), path.join(to, element));
      } else {
          copyFolder(path.join(from, element), path.join(to, element));
      }
  });
}
copy

async function workDir() {
  await makeDir(pathDist);
  let curFiles = await getFiles(pathComponents);

  // get object w content html components
  let componentsFiles = curFiles.filter(
    (el) => el.isFile() && path.extname(el.name) === ".html"
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


  // await copyFiles(pathAssets);

  


  //   fs.appendFile(path.join(__dirname, 'components', 'el.html'),
  //     dataTemp,
  //     (err) => {if (err) console.log(err.message)});

  // console.log(componentsFilesFinder);
  // console.log(templateData);
  // await copyData(cssFiles);
}

try {
  workDir();
} catch (error) {
  console.log(error.message);
}
