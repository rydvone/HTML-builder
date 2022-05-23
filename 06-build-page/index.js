const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");

const pathComponents = path.join(__dirname, "components");
const pathTemplate = path.join(__dirname, "template.html");
const pathIndexHtml = path.join(__dirname, "project-dist", "index.html");
const pathStyleCss = path.join(__dirname, "project-dist", "style.css");

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

async function workDir() {
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
