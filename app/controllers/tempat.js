const db = require("../models");
const Tempat = db.tempat;
const Pertemuan = db.pertemuan;
const User = db.users;

//BPBA menambah list tempat SLP (sentra layana priority(?))
exports.addLoc = async (req, res) => {
  const post = {
    nama_tempat: req.body.nama_tempat,
  };
  Tempat.create(post)
    .then((result) => {
      res.send({
        message: "Data berhasil di input!",
        data: {
          id: result.id,
          nama_tempat: result.nama_tempat,
        },
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Data gagal di input!",
      });
    });
};

//BPBA melihat list of location
exports.getAllLoc = (req, res) => {
  Tempat.findAll()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "error mengambil data",
      });
    });
};

//BPBA mengedit list of location
exports.updateLoc = (req, res) => {
  const id = req.params.id;
  Tempat.update(
    {
      nama_tempat: req.body.nama_tempat,
    },
    {
      where: { id: id },
    }
  )
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Data berhasil di update",
        });
      } else {
        res.send({
          message: `Id ${id} tidak ditemukan. Periksa kembali email anda`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Data gagal di update",
      });
    });
};

// exports.getPertemuanTempat = (req, res) => {
//   const tempat = req.params.tempat;
//   Pertemuan.findAll({
//     include: [
//       {
//         model: User,
//         require: true,
//         as: "user_pcu",
//         attributes: ["id", "email", "nama"],
//       },
//       {
//         model: User,
//         require: true,
//         as: "user_pba",
//         attributes: ["id", "email", "nama"],
//       },
//       {
//         model: Tempat,
//         attributes: ["id", "nama_tempat"],
//         where: { nama_tempat: tempat },
//       },
//     ],
//   })
//     .then((result) => {
//       res.send({
//         status: "Success",
//         data: result,
//       });
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message || "error mengambil data",
//       });
//     });
// };
