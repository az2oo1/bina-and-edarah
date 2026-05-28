import fetch from 'node-fetch';

async function test() {
  const data = {
    rows: [
      [
        "F1-9",
        "جواهر الدعامة للمقاولات",
        "567175250",
        "لايوجد",
        "120",
        "700SAR",
        "84000SAR",
        "12600SAR",
        "1000SAR",
        "97600SAR",
        "لا",
        "12/31/2026",
        "01/01/2019",
        "02/12/2019"
      ]
    ]
  };

  const res = await fetch('http://localhost:3000/api/admin/buildings/b1/upload-json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  console.log(await res.text());
}
test();
