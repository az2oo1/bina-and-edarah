const XLSX = require('xlsx');

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet([[ { t: 'n', v: 42551, z: 'm/d/yy' } ]]);
XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

// standard raw:false
console.log('raw:false =>', XLSX.utils.sheet_to_json(ws, { header: 1, raw: false }));

// raw: false, dateNF
console.log('dateNF =>', XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, dateNF: 'yyyy-mm-dd' }));

const wb2 = XLSX.read(XLSX.write(wb, { type: 'buffer' }), { cellDates: true });
console.log('cellDates =>', XLSX.utils.sheet_to_json(wb2.Sheets.Sheet1, { header: 1 }));
console.log('cellDates + raw:true =>', XLSX.utils.sheet_to_json(wb2.Sheets.Sheet1, { header: 1, raw: true }));
