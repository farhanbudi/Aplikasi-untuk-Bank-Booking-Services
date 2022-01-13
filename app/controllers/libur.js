const db = require("../models");
const Holidays = db.jadwal_libur;

// get semua tanggal libur
exports.getAllHolidays = (req, res) => {
  Holidays.findAll()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "error mengambil data",
      });
    });
};

//BPBA menambah jadwal libur
exports.postHoliday = async (req, res) => {
  const { tanggal_mulai, tanggal_selesai, keterangan } = req.body;
  const post = {
    tanggal_mulai,
    tanggal_selesai,
    keterangan,
  };

  if (Date.parse(tanggal_selesai) < Date.parse(tanggal_mulai)) {
    res.status(500).send({
      message: "Data tidak valid. Mohon Periksa kembali!",
    });
    document.getElementById("tanggal_selesai").value = "";
  }

  Holidays.create(post)
    .then((data) => {
      res.send(data);
      console.log("Tanggal berhasil ditambahkan");
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Tanggal gagal ditambahkan",
      });
    });
};

//BPBA mengupdate jadwal libur
exports.updateHolidays = (req, res) => {
  const id = req.params.id;
  const { tanggal_mulai, tanggal_selesai, keterangan } = req.body;
  const update = {
    id,
    tanggal_mulai,
    tanggal_selesai,
    keterangan,
  };

  if (Date.parse(tanggal_selesai) < Date.parse(tanggal_mulai)) {
    res.status(500).send({
      message: "Data tidak valid. Mohon Periksa kembali!",
    });
    document.getElementById("tanggal_selesai").value = "";
  }

  Holidays.update(update, {
    where: { id: req.params.id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Data berhasil diupdate",
        });
      } else {
        res.send({
          message: `Data tidak ditemukan di jadwal libur. Mohon periksa kembali!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Data gagal diupdate",
      });
    });
};

//BPBA menghapus jadwal libur
exports.deleteHolidays = (req, res) => {
  Holidays.update(
    { keterangan: "deleted" },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Data berhasil dihapus",
        });
      } else {
        res.send({
          message: `Data tidak ditemukan di jadwal libur. Mohon periksa kembali!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Data gagal dihapus",
      });
    });
};
