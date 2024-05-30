import { readFileSync } from 'fs';
import { tableFromIPC, Table } from 'apache-arrow';

const crimes = tableFromIPC(readFileSync("../data/chicago-crimes-2017.arrow"));

// Check if 'crimes' is an instance of Table
if (crimes instanceof Table) {
  console.log("crimes is an instance of Table");

  // Getting header names
  const headers = crimes.schema.fields.map(field => field.name);
  console.log("Header names:", headers);

  // iterateRows();
} else {
  console.log("crimes is not an instance of Table");
}

function iterateRows() {
  // Iterating over rows and printing data
  let arr = crimes.toArray();
  let rowCount = arr.length;
  for (let i = 0; i < rowCount; i++) {
    // Create an array to hold the data of the current row
    let rowData = [];

    // Iterate over each column in the row
    crimes.schema.fields.forEach(field => {
      const columnName = field.name;
      const cellData = crimes.getChild(columnName).get(i);
      rowData.push(`${columnName}: ${cellData}`);
    });

    // Print the current row's data
    console.log(`Row ${i}:`, rowData.join(', '));
  }
}
