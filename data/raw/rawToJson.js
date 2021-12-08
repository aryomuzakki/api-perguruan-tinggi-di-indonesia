const xlsx = require("xlsx");
const fs = require("fs");

const convertRawToJson = () => {
  const file = xlsx.readFile("./data/raw/Data_Perguruan_Tinggi.xlsx");
  const newData = [];

  const sheet = file.Sheets[file.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet, { defval: "" });

  data.map((pt) => {
    newData.push({
      kode: pt.npsn.trim(),
      nama: pt.nama_pt.trim(),
      provinsi: pt.provinsi_pt.trim(),
      kabupatenKota: pt["Kabupaten/Kota"].trim(),
      kecamatan: pt.kec_pt.trim(),
      alamat: pt.jln.trim(),
      tautan: pt.website.trim(),
      telepon: pt.no_tel.trim(),
      surel: pt.email.trim(),
      bentuk: pt.nm_bp.trim(),
      lembaga: pt.lembaga.trim(),
      kelompokKoordinator: pt.kelompok_koordinator.trim(),
    });
  });

  try {
    fs.writeFileSync("./data/pt.json", JSON.stringify(newData));
  } catch (err) {
    return err;
  }
};

module.exports = convertRawToJson;
