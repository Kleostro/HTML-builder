const fs = require('fs');
const path = require('path');

const pathFolderStyles = path.join(__dirname, 'styles');
const bundleFolder = path.join(__dirname, 'project-dist');
const bundleFile = path.join(bundleFolder, 'bundle.css');

fs.readdir(pathFolderStyles, { withFileTypes: true }, (err, files) => {
  if (err) return console.log(err.message);

  const writeStream = fs.createWriteStream(bundleFile);

  files.forEach((file) => {
    if (file.isFile() && path.parse(file.name).ext === '.css') {
      const pathFile = path.join(pathFolderStyles, file.name);
      const readStream = fs.createReadStream(pathFile, 'utf-8');
      readStream.pipe(writeStream);
    }
  });
});
