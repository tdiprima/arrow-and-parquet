// https://arrow.apache.org/docs/js/#md:cookbook
import { readFileSync } from 'fs';
import { tableFromIPC } from 'apache-arrow';

const buffer = readFileSync('../data/hello_world.arrow');
const table = tableFromIPC(buffer);

console.table(table.toArray());
// console.table([...table]);
