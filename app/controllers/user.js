const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

// create new user
exports.CreateNewUser = async (req, res) => {
  const { email, password, nama, alamat, no_hp, role } = req.body;
  // const today = new Date().toJSON();
  const hashPassword = await bcrypt.hash(password, 10);
  const post = {
    email,
    password: hashPassword,
    nama,
    alamat,
    no_hp,
    role,
    status: "enable",
  };

  User.create(post)
    .then((result) => {
      res.send({
        message: "Data berhasil di input!",
        data: {
          nama: result.nama,
          email: result.email,
          alamat: result.alamat,
          no_hp: result.no_hp,
          role: result.role,
        },
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Data gagal di input!",
      });
    });
};

// get all Users data
exports.getAllUser = (req, res) => {
  User.findAll({
    attributes: ["id", "nama", "email", "alamat", "no_hp", "role"],
  })
    .then((result) => {
      res.send({
        status: "Success",
        data: result,
      });
    })
    .catch((err) => {
      res.send({
        message: err.message || "error mengambil data",
      });
    });
};

// find Users data with role
exports.getRole = (req, res) => {
  User.findAll({
    where: {
      role: req.params.role,
    },
    attributes: ["id", "nama", "email", "alamat", "no_hp", "role"],
  })
    .then((result) => {
      res.send({
        status: "Success",
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "error mengambil data",
      });
    });
};

// find Users data with name
exports.getName = (req, res) => {
  User.findAll({
    where: {
      nama: req.params.name,
    },
    attributes: ["id", "nama", "email", "alamat", "no_hp", "role"],
  })
    .then((result) => {
      res.send({
        status: "Success",
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "error mengambil data",
      });
    });
};

// find Users data with email
exports.getEmail = (req, res) => {
  User.findAll({
    where: {
      email: req.params.email,
    },
    attributes: ["id", "nama", "email", "alamat", "no_hp", "role"],
  })
    .then((result) => {
      res.send({
        status: "Success",
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "error mengambil data",
      });
    });
};

//Update user
exports.updateUser = (req, res) => {
  const email = req.params.email;
  User.update(
    {
      nama: req.body.nama,
      alamat: req.body.alamat,
      no_hp: req.body.no_hp,
    },
    {
      where: { email: email },
    }
  )
    .then((result) => {
      if (result == 1) {
        res.send({
          message: "Data berhasil di update",
        });
      } else {
        res.send({
          message: `Email ${email} tidak ditemukan. Periksa kembali email anda`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Data gagal di update",
      });
    });
};

//Update status user
exports.deleteUser = (req, res) => {
  User.update(
    { status: "disable" },
    {
      where: { email: req.params.email },
    }
  )
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Status user berhasil diubah",
        });
      } else {
        res.send({
          message: `variabel status tidak ditemukan`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Data gagal di update",
      });
    });
};

//set pbam dari pba
exports.setPBAMdariPBA = (req, res) => {
  User.findOne({ where: { email: req.body.email_pbam, role: "pbam" } })
    .then(function (result) {
      if (result) {
        //data exist
        User.update(
          { managed_by: req.body.email_pbam },
          {
            where: {
              email: req.body.email_pba,
              role: "pba",
              status: { [Op.not]: "disable" },
            },
          }
        )
          .then((num) => {
            if (num == 1) {
              res.send({
                message: "PBAM berhasil di set",
              });
            } else {
              res.send({
                message: `email ${req.body.email_pba} tidak ditemukan atau role bukan pba`,
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "PBAM tidak berhasil di set",
            });
          });
      } else {
        res.send({
          status: "failed",
          message: "role dari email email_pbam bukan pbam",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "error mengambil data",
      });
    });
};

//set pcu dari pba
exports.setPCUdariPBA = async (req, res) => {
  User.findOne({ where: { email: req.body.email_pba, role: "pba" } })
    .then(function (result) {
      if (result) {
        //data exist
        User.update(
          { assisted_by: req.body.email_pba },
          {
            where: {
              email: req.body.email_pcu,
              role: "pcu",
              status: { [Op.not]: "disable" },
            },
          }
        )
          .then((num) => {
            if (num == 1) {
              res.send({
                message: "PBA berhasil di set",
              });
            } else {
              res.send({
                message: `email ${req.body.email_pba} tidak ditemukan atau role bukan pba`,
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "PBAM tidak berhasil di set",
            });
          });
      } else {
        res.send({
          status: "failed",
          message: "role dari email email_pbam bukan pbam",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "error mengambil data",
      });
    });
};

//PBAM edit assisted_by PBA
/*exports.updateAssisted = (req, res) => {
    const email = req.body.email;
    User.update({ assisted_by: req.body.assisted_by }, {
        where: {[ Op.and]: [
            { email: email },
            {role: "pba"}
        ]}
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Data user berhasil diubah."
                });
            } else {
                res.send({
                    message: `Data yang anda masukan salah atau tidak terdaftar sebagai pba. Mohon periksa kembali`
                })
            }
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "Data gagal di update"
            });
        })
}*/
