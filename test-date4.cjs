const XLSX = require('xlsx');

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet([[ { t: 'n', v: 42551, z: 'm/d/yy' } ]]);
XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
const buffer = XLSX.write(wb, { type: 'buffer' });

const readWb = XLSX.read(buffer, { cellDates: true });
const rows = XLSX.utils.sheet_to_json(readWb.Sheets.Sheet1, { header: 1, raw: true });
const formatted = rows.map(row => row.map(val => val instanceof Date ? val.toISOString().split('T')[0] : val));
console.log(formatted);
