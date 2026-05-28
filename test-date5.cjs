const XLSX = require('xlsx');
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet([[ { t: 'n', v: 42551.5, z: 'm/d/yy h:mm' } ]]);
XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
const buffer = XLSX.write(wb, { type: 'buffer' });
const readWb = XLSX.read(buffer, { cellDates: true });
const rows = XLSX.utils.sheet_to_json(readWb.Sheets.Sheet1, { header: 1, raw: true });
console.log(rows[0][0]);
