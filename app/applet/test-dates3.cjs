const XLSX = require('xlsx');

const ws = XLSX.utils.aoa_to_sheet([[ { t: 'n', v: 43466, z: 'yyyy-mm-dd' } ]]); 
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
const buffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });

const readWb = XLSX.read(buffer, { type: 'array', cellDates: true });
const sheet = readWb.Sheets[readWb.SheetNames[0]];
const rowsRaw = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true });

const val = rowsRaw[0][0];

console.log("Val is Date?", val instanceof Date);
console.log("Val:", val);
console.log("y-m-d:", val.getFullYear(), val.getMonth() + 1, val.getDate());
console.log("UTC y-m-d:", val.getUTCFullYear(), val.getUTCMonth() + 1, val.getUTCDate());
