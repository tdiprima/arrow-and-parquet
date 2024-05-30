import { readFileSync } from 'fs';
import { tableFromIPC } from 'apache-arrow';

const crimes = tableFromIPC(readFileSync("../data/chicago-crimes-2017.arrow"));

// Attempt to retrieve the 'Date' column
let dateColumn = crimes.getChild('Date');

// Use dateColumn as needed
let dates = [];
for (const timestamp of dateColumn) {
  dates.push(new Date(timestamp));
}

console.log(dates.length); // how many
console.log(dates[0]); // first
console.log(dates[dates.length - 1]); // last
