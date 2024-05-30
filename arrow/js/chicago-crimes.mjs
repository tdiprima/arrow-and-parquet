// https://observablehq.com/@randomfractals/apache-arrow
import { readFileSync } from 'fs';

// Apache Arrow JS Import
import { tableFromIPC } from 'apache-arrow';

// Sample Arrow Data
// let dataUrl = "https://raw.githubusercontent.com/RandomFractals/ChicagoCrimes/master/data/chicago-crimes-2017.arrow";
let dataUrl = "../data/chicago-crimes-2017.arrow";
// let dataUrl = "../data/chicago-crimes-2018.arrow";

// Loading Arrow Data
const arrow = readFileSync(dataUrl);

// const crimes = loadData(dataUrl).then(buffer => arrow.Table.from(new Uint8Array(buffer)));
const crimes = tableFromIPC(arrow); // todo: like this!

let arr = crimes.toArray();

// Getting Records Count
let rowCount = arr.length;
console.log("rowCount:", rowCount);

// Getting Arrow Schema Metadata
let fields = crimes.schema.fields.map(f => f.name);
console.log("fields:", fields);

let fieldTypeNames = crimes.schema.fields.map(f => f.type.toString());
console.log("fieldTypeNames:", fieldTypeNames);

// Accessing Arrow Table Row Data
let firstRow = crimes.get(0).toString(); // 1st row data
console.log("firstRow:", firstRow);

let lastRow = crimes.get(rowCount - 1).toString(); // last row data
console.log("lastRow:", lastRow);

let randomRow = crimes.get(Math.random() * rowCount);
console.log("randomRow:", randomRow);

// Arrow Record toJSON and toArray
let toJSON = crimes.get(0).toJSON();
console.log("toJSON:", toJSON);

let toArray = crimes.get(rowCount - 1).toArray();
console.log("row toArray:", toArray);

// Custom arrow data range stepper for sampling data:
function range(data, start, end, step) {
  const slice = [];
  // const rowCount = data.count();
  const rowCount = data.toArray().length;
  for (let i = start; i < end && i < rowCount; i += step) {
    slice.push(data.get(i).toArray());
  }
  return slice;
}

// Slicing Arrow Data
let every10KRow = range(crimes, 0, rowCount, 10000);
console.log("every10KRow:", every10KRow);

// Generating Arrow Data Markdown Table for Preview
function getMarkdown(dataFrame, fields, dateFields = []) {
  let markdown = `${fields.join(' | ')}\n --- | --- | ---`; // header row
  let i = 0;
  for (let row of dataFrame) {
    markdown += '\n ';
    let td = '';
    let k = 0;
    for (let cell of row) {
      if (Array.isArray(cell)) {
        td = '[' + cell.map((value) => value == null ? 'null' : value).join(', ') + ']';
      } else if (fields[k] === 'Date' || dateFields.indexOf(fields[k]) >= 0) {
        td = toDate(cell).toLocaleString(); // convert Apache arrow Timestamp to Date and format
      } else {
        td = cell.toString();
      }
      markdown += ` ${td} |`;
      k++;
    }
  }
  return markdown;
}

console.log("markdown:\n", getMarkdown(every10KRow, fields));

// Custom toDate function to convert Timestamp
function toDate(timestamp) {
  return new Date(timestamp);
}

console.log("toDate:", toDate(toJSON.Date));
console.log("toDate:", toDate(JSON.parse(lastRow).Date));

// Custom numeric and date column stats functions:
function columnStats(columnName) {
  // const column = crimes.getColumn(columnName);
  const column = crimes.getChild(columnName);
  let max = column.get(0);
  let min = max;
  for (let value of column) {
    if (value > max) {
      max = value;
    } else if (value < min) {
      min = value;
    }
  }
  return { min, max, range: max - min };
}

// todo: toDate no.
function dateStats(columnName) {
  // const column = crimes.getColumn(columnName);
  const column = crimes.getChild(columnName);
  let max = toDate(column.get(0));
  let min = max;
  for (let value of column) {
    const date = toDate(value);
    if (date > max) {
      max = date;
    } else if (date < min) {
      min = date;
    }
  }
  return { min, max, range: max - min };
}

// Getting Column Data Stats
let latitude = columnStats('Latitude');
console.log("latitude stats:", latitude);

let longitude = columnStats('Longitude');
console.log("longitude stats:", longitude);

// Filtering Timestamped Data
let millisPerHour = 60 * 60 * 1000;

let datesStats = dateStats("Date");

let startDate = new Date(datesStats.max - 2 * millisPerHour);
console.log("startDate:", startDate);

let endDate = new Date(datesStats.max - 1 * millisPerHour);
console.log("endDate:", endDate);

// Filtering by Days
let millisPerDay = 24 * millisPerHour;
console.log("millisPerDay:", millisPerDay);
