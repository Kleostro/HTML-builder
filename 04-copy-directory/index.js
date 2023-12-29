const fsPromises = require('fs').promises;
const path = require('path');
const pathFolder = path.join(__dirname, 'files');
const pathFolderCopy = path.join(__dirname, 'files-copy');

const copyDir = () => {
  return fsPromises
    .mkdir(pathFolderCopy, { recursive: true })
    .then(() => fsPromises.readdir(pathFolder, { withFileTypes: true }))
    .then((files) => {
      return Promise.all(
        files.map((file) => {
          const pathFile = path.join(pathFolder, file.name);
          const pathFileCopy = path.join(pathFolderCopy, file.name);
          return fsPromises.copyFile(pathFile, pathFileCopy);
        }),
      );
    });
};

copyDir();
