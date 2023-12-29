const fs = require('fs');
const path = require('path');
const { stdout } = process;
const pathFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathFolder, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err.message);
  files.forEach((file) => {
    if (file.isFile()) {
      const pathFile = path.join(pathFolder, file.name);
      const fileName = path.parse(pathFile).name;
      const fileExt = path.parse(pathFile).ext.slice(1);
      fs.stat(pathFile, (err, stats) => {
        if (err) console.log(err.message);
        stdout.write(`${fileName} - ${fileExt} - ${stats.size / 1000}kb\n`);
      });
    }
  });
});
