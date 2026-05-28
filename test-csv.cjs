const csvParser = require('csv-parser');
const { Readable } = require('stream');

const csvText = `رقم الوحدة ,اســـــــــم المستــاجــــر,رقم المستأجر,بندالتاجيرمن الباطن,المساحة  م2
GF1-M-1,مؤسسة الاغذية المختصة لتقديم الوجبات,566848950,لايوجد ,72`;

const results = [];
Readable.from([csvText.replace(/^\uFEFF/, '')])
  .pipe(csvParser({
    mapHeaders: ({ header }) => header?.trim(),
    mapValues: ({ value }) => typeof value === 'string' ? value.trim() : value
  }))
  .on('data', (data) => results.push(data))
  .on('end', () => {
    console.log(results);
    const row = results[0];
    let phoneStr = (row['رقم المستأجر'] || '').replace(/\D/g, ''); 
    const phone = phoneStr.replace(/^0+/, ''); 
    console.log({
      unit: row['رقم الوحدة'],
      renterName: row['اســـــــــم المستــاجــــر'],
      phone
    })
  });
