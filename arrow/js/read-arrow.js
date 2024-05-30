const arrow = require('apache-arrow');
const fs = require('fs');
// import * as fs from 'fs';

function readArrowFile(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const arrowTable = arrow.tableFromIPC(fileBuffer);
  console.log(arrowTable.toString());
}

readArrowFile('../data/hello_world.arrow');
