const fsPromises = require('fs').promises;
const fs = require('fs');
const path = require('path');

const pathFolderDist = path.join(__dirname, 'project-dist');

const pathTemplateFile = path.join(__dirname, 'template.html');
const pathHtmlFile = path.join(pathFolderDist, 'index.html');

const pathFolderStyles = path.join(__dirname, 'styles');
const pathFileStyles = path.join(pathFolderDist, 'style.css');

const pathFolderAssets = path.join(__dirname, 'assets');
const pathFolderAssetsCopy = path.join(pathFolderDist, 'assets');

const pathFolderComponents = path.join(__dirname, 'components');

const createDir = () => {
  return fsPromises
    .rm(pathFolderDist, { recursive: true, force: true })
    .then(() => fsPromises.mkdir(pathFolderDist, { recursive: true }))
    .then(() => {
      copyFolder(pathFolderAssets, pathFolderAssetsCopy);
      bundleHtml();
      bundleCSS();
    })
    .catch((error) => console.log(error.message));
};

const copyFolder = (folder, copyFold) => {
  return fsPromises
    .rm(copyFold, { recursive: true, force: true })
    .then(() => fsPromises.mkdir(copyFold, { recursive: true }))
    .then(() => fsPromises.readdir(folder, { withFileTypes: true }))
    .then((files) => {
      const promises = files.map((file) => {
        const pathFile = path.join(folder, file.name);
        const pathFileCopy = path.join(copyFold, file.name);

        file.isDirectory()
          ? copyFolder(pathFile, pathFileCopy)
          : fsPromises.copyFile(pathFile, pathFileCopy);
      });
      return Promise.all(promises);
    })
    .catch((error) => console.log(error.message));
};

const bundleHtml = () => {
  return fsPromises
    .readdir(pathFolderComponents, { withFileTypes: true })
    .then((files) => {
      return fsPromises.readFile(pathTemplateFile, 'utf-8').then((str) => {
        const promises = files.map((file) => {
          const nameComponent = path.parse(file.name).name;
          const fileComponent = path.join(pathFolderComponents, file.name);
          return fsPromises
            .readFile(fileComponent, 'utf-8')
            .then((readComponent) => {
              str = str.replaceAll(`{{${nameComponent}}}`, readComponent);
            });
        });
        return Promise.all(promises).then(() => {
          return fsPromises.writeFile(pathHtmlFile, str);
        });
      });
    })
    .catch((error) => console.log(error.message));
};

const bundleCSS = () => {
  return fsPromises
    .readdir(pathFolderStyles, { withFileTypes: true })
    .then((files) => {
      const writeStream = fs.createWriteStream(pathFileStyles);

      files.forEach((file) => {
        if (file.isFile() && path.parse(file.name).ext === '.css') {
          const pathFile = path.join(pathFolderStyles, file.name);
          const readStream = fs.createReadStream(pathFile, 'utf-8');
          readStream.pipe(writeStream);
        }
      });
    })
    .catch((error) => console.log(error.message));
};

createDir();
