const path = require('path');
const fs = require('fs');

const folderPath = path.join(__dirname, 'secret-folder');
fs.readdir(folderPath,
  { withFileTypes: true },
  (err, files) => {
    if (err) console.log(err.message);
    let arrFiles = files.filter(el => el.isFile());
    arrFiles.forEach(el => {
     
      let res = [];
      fs.stat(path.join(__dirname, 'secret-folder', el.name), (err, stats) => {
        let resExtnameIn = path.extname(el.name);
        let resNameIn = path.basename(el.name);
        res.push(resNameIn.slice(0, (resNameIn.length - resExtnameIn.length)));
        res.push(resExtnameIn.slice(1));
        res.push(stats.size);
        console.log(res.join(' - ') + 'b');
      });
    });
  });



