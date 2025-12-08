import { readdir } from 'fs';
import { extname } from 'path';

function listFilesByType(directoryPath, fileExtension) {
  readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    const filteredFiles = files.filter(file => {
      return extname(file).toLowerCase() === `.${fileExtension.toLowerCase()}`;
    });

    console.log(`Files with extension .${fileExtension} in ${directoryPath}:`);
    filteredFiles.forEach(file => console.log(file));
  });
}
export { listFilesByType };

if (typeof window !== 'undefined') {
    window.listfilesByType = listFilesByType;
}