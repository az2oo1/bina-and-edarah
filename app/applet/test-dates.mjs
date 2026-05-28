import * as XLSX from 'xlsx';

const ws = XLSX.utils.aoa_to_sheet([[ { t: 'n', v: 43466, z: 'm/d/yy' } ]]); // Value for Jan 1, 2019
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
const buffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });

const readWb = XLSX.read(buffer, { type: 'array', cellDates: true });
const sheet = readWb.Sheets[readWb.SheetNames[0]];

const rows1 = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });
console.log('raw:false =>', rows1);

const rows2 = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true });
console.log('raw:true =>', rows2);

// serialize
console.log('serialized raw:true =>', JSON.stringify(rows2));
