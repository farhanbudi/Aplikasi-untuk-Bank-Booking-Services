const db = require("../models");
const Meet = db.pertemuan;
const Tempat = db.tempat;
const Tempat2Pba = db.tempat2pba;
const User = db.users;
const Cuti = db.cuti;
const Libur = db.jadwal_libur;
const Op = db.Sequelize.Op;

//membuat jadwal libur
exports.addMeet = async (req, res) => {
  const { id_pcu, id_pba, topik, tanggal, jam_mulai, jam_selesai, tempat_id } =
    req.body;
  const post = {
    id_pcu,
    id_pba,
    topik,
    tanggal,
    jam_mulai,
    jam_selesai,
    tempat_id,
    status: "created",
  };

  Libur.findOne({
    where: {
      [Op.and]: [
        { tanggal_mulai: { [Op.lte]: req.body.tanggal } },
        { tanggal_selesai: { [Op.gte]: req.body.tanggal } },
      ],
    },
  })
    .then(function (result) {
      if (result) {
        //data exist
        res.send({ status: "failed", message: "bank sedang libur" });
      } else {
        // data not exist
        Cuti.findOne({
          where: {
            [Op.and]: [
              { id_pba: req.body.id_pba },
              { tanggal_mulai: { [Op.lte]: req.body.tanggal } },
              { tanggal_selesai: { [Op.gte]: req.body.tanggal } },
            ],
          },
        })
          .then(function (result) {
            if (result) {
              //data exist
              res.send({ status: "failed", message: "pba sedang cuti" });
            } else {
              // data not exist
              Meet.findOne({
                where: {
                  [Op.and]: [
                    { id_pba: req.body.id_pba },
                    { tanggal: req.body.tanggal },
                    {
                      [Op.or]: [
                        {
                          jam_mulai: {
                            [Op.between]: [
                              req.body.jam_mulai,
                              req.body.jam_selesai,
                            ],
                          },
                        },
                        {
                          jam_selesai: {
                            [Op.between]: [
                              req.body.jam_mulai,
                              req.body.jam_selesai,
                            ],
                          },
                        },
                      ],
                    },
                  ],
                },
              })
                .then(function (result) {
                  if (result) {
                    //data exist
                    res.send({
                      status: "failed",
                      message: "pba sedang melakukan pertemuan",
                    });
                  } else {
                    // data not exist
                    User.findOne({
                      where: {
                        [Op.and]: [{ id: req.body.id_pcu }, { role: "pcu" }],
                      },
                    })
                      .then(function (result2) {
                        if (result2) {
                          //data exist
                          User.findOne({
                            where: {
                              [Op.and]: [
                                { id: req.body.id_pba },
                                { role: "pba" },
                              ],
                            },
                          })
                            .then(function (result2) {
                              if (result2) {
                                //data exist

                                // FUNCTION CREATE NEW DATA
                                Meet.create(post)
                                  .then((data) => {
                                    res.send(data);
                                    console.log("Data berhasil di input!");
                                  })
                                  .catch((err) => {
                                    res.status(500).send({
                                      message:
                                        err.message || "Data gagal di input!",
                                    });
                                  });
                              } else {
                                res.send({
                                  status: "failed",
                                  message: "role id_pba bukan pba",
                                });
                              }
                            })
                            .catch((err) => {
                              res.status(500).send({
                                message: err.message || "error mengambil data",
                              });
                            });
                        } else {
                          res.send({
                            status: "failed",
                            message: "role id_pcu bukan pcu",
                          });
                        }
                      })
                      .catch((err) => {
                        res.status(500).send({
                          message: err.message || "error mengambil data",
                        });
                      });
                  }
                })
                .catch((err) => {
                  res.status(500).send({
                    message: err.message || "error mengambil data",
                  });
                });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "error mengambil data",
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "error mengambil data",
      });
    });
};

//pba mengkonfirmasi jadwal pertemuan dari pcu
exports.pbaConfirmed = (req, res) => {
  const id = req.params.id_pertemuan;
  Meet.update(
    { status: "approved" },
    {
      where: { id: id },
    }
  )
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Pesanan berhasil dikonfirmasi",
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

//pba menolak pertemuan
exports.pbaRejected = (req, res) => {
  const id = req.params.id_pertemuan;
  Meet.update(
    { status: "rejected", rejected_feedback: req.body.rejected_feedback },
    {
      where: { id: id },
    }
  )
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Pesanan ditolak",
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

//pcu mengubah janji
exports.pcuMeetChange = (req, res) => {
  const id = req.params.id_pertemuan;
  const tanggal = req.body.tanggal;

  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  var datenow = year + "-" + month + "-" + date;

  if (datenow < tanggal) {
    Meet.findOne({ where: { id: id } }).then(function (result) {
      var idPba = result.id_pba;
      Libur.findOne({
        where: {
          [Op.and]: [
            { tanggal_mulai: { [Op.lte]: req.body.tanggal } },
            { tanggal_selesai: { [Op.gte]: req.body.tanggal } },
          ],
          [Op.not]: { keterangan: "deleted" },
        },
      })
        .then(function (result) {
          if (result) {
            //data exist
            res.send({ status: result, message: datenow });
          } else {
            // data not exist
            Cuti.findOne({
              where: {
                [Op.and]: [
                  { id_pba: idPba },
                  { tanggal_mulai: { [Op.lte]: req.body.tanggal } },
                  { tanggal_selesai: { [Op.gte]: req.body.tanggal } },
                ],
                [Op.not]: { keterangan: "deleted" },
              },
            })
              .then(function (result) {
                if (result) {
                  //data exist
                  res.send({ status: "failed", message: "pba sedang cuti" });
                } else {
                  // data not exist
                  Meet.findOne({
                    where: {
                      [Op.and]: [
                        { id_pba: idPba },
                        { tanggal: req.body.tanggal },
                        {
                          [Op.or]: [
                            {
                              jam_mulai: {
                                [Op.between]: [
                                  req.body.jam_mulai,
                                  req.body.jam_selesai,
                                ],
                              },
                            },
                            {
                              jam_selesai: {
                                [Op.between]: [
                                  req.body.jam_mulai,
                                  req.body.jam_selesai,
                                ],
                              },
                            },
                          ],
                        },
                      ],
                      [Op.not]: { status: "canceled" },
                    },
                  })
                    .then(function (result) {
                      if (result) {
                        //data exist
                        res.send({
                          status: "failed",
                          message: "pba sedang melakukan pertemuan",
                        });
                      } else {
                        // data not exist

                        User.findOne({
                          where: {
                            [Op.and]: [
                              { id: req.body.id_pcu },
                              { role: "pcu" },
                            ],
                          },
                        })
                          .then(function (result2) {
                            if (result2) {
                              //data exist
                              User.findOne({
                                where: {
                                  [Op.and]: [
                                    { id: req.body.id_pba },
                                    { role: "pba" },
                                  ],
                                },
                              })
                                .then(function (result2) {
                                  if (result2) {
                                    //data exist

                                    // FUNCTION UPDATE DATA
                                    Meet.update(
                                      {
                                        status: "created",
                                        id_pcu: req.body.id_pcu,
                                        id_pba: req.body.id_pba,
                                        topik: req.body.topik,
                                        tanggal: tanggal,
                                        jam_mulai: req.body.jam_mulai,
                                        jam_selesai: req.body.jam_selesai,
                                        tempat_id: req.body.tempat_id,
                                      },
                                      { where: { id: id } }
                                    )
                                      .then((num) => {
                                        if (num == 1) {
                                          res.send({
                                            message: "Pesanan berhasil diubah",
                                          });
                                        } else {
                                          res.send({
                                            message:
                                              "id pertemuan tidak ditemukan",
                                          });
                                        }
                                      })
                                      .catch((err) => {
                                        res.status(500).send({
                                          message:
                                            err.message ||
                                            "Data gagal di update",
                                        });
                                      });
                                  } else {
                                    res.send({
                                      status: "failed",
                                      message: "role id_pba bukan pba",
                                    });
                                  }
                                })
                                .catch((err) => {
                                  res.status(500).send({
                                    message:
                                      err.message || "error mengambil data",
                                  });
                                });
                            } else {
                              res.send({
                                status: "failed",
                                message: "role id_pcu bukan pcu",
                              });
                            }
                          })
                          .catch((err) => {
                            res.status(500).send({
                              message: err.message || "error mengambil data",
                            });
                          });
                      }
                    })
                    .catch((err) => {
                      res.status(500).send({
                        message: err.message || "error mengambil data",
                      });
                    });
                }
              })
              .catch((err) => {
                res.status(500).send({
                  message: err.message || "error mengambil data",
                });
              });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "error mengambil data",
          });
        });
    });
  } else {
    res.send({
      message: "tanggal sudah melebihi h-1",
    });
  }
};

//pcu membatalkan pertemuan
exports.pcuMeetCancel = (req, res) => {
  const id = req.params.id_pertemuan;
  Meet.update(
    { status: "canceled" },
    {
      where: { id: id },
    }
  )
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Pesanan berhasil dibatalkan",
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

//pcu memberi feedback
exports.pcuAddFeedback = (req, res) => {
  const id = req.params.id_pertemuan;
  Meet.update(
    {
      status: "done",
      feedback_pcu: req.body.feedback_pcu,
      rating_pcu: req.body.rating_pcu,
    },
    {
      where: { id: id },
    }
  )
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Feedback berhasil diinput",
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

//pba memberi feedback
exports.pbaAddFeedback = (req, res) => {
  const id = req.params.id_pertemuan;
  Meet.update(
    {
      status: "done",
      feedback_pba: req.body.feedback_pba,
      rating_pba: req.body.rating_pba,
    },
    {
      where: { id: id },
    }
  )
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Feedback berhasil diinput",
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

//get data by id pertemuan dari tabel pertemuan + feedback
exports.meetFindById = (req, res) => {
  Meet.findAll({
    include: [
      { model: User, attributes: ["id", "email", "nama", "role"] },
      { model: Tempat, attributes: ["id", "nama_tempat"] },
    ],
    where: {
      id: req.params.id_pertemuan,
    },
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

//get data by id pcu dari tabel pertemuan + feedback
exports.meetFindByPcu = (req, res) => {
  Meet.findAll({
    include: [
      { model: User, attributes: ["id", "email", "nama", "role"] },
      { model: Tempat, attributes: ["id", "nama_tempat"] },
    ],
    where: {
      id_pcu: req.params.id_pcu,
    },
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

//get data by id pba dari tabel pertemuan + feedback
exports.meetFindByPba = (req, res) => {
  Meet.findAll({
    include: [
      { model: User, attributes: ["id", "email", "nama", "role"] },
      { model: Tempat, attributes: ["id", "nama_tempat"] },
    ],
    where: {
      id_pba: req.params.id_pba,
    },
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

//get semua data dari tabel pertemuan + feedback
exports.meetFindAll = (req, res) => {
  Meet.findAll({
    include: [
      { model: User, attributes: ["id", "email", "nama", "role"] },
      { model: Tempat, attributes: ["id", "nama_tempat"] },
    ],
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

// DELETED
//get tempat yang dapat dipilih oleh pba tertentu
exports.getTempat2Pba = (req, res) => {
  Tempat2Pba.findAll({
    include: [
      { model: User, attributes: ["id", "email", "nama", "role"] },
      { model: Tempat, attributes: ["id", "nama_tempat"] },
    ],
    where: {
      id_pba: req.params.id_pba,
    },
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

//get data by tanggal dari tabel pertemuan + feedback untuk pbam
exports.pbaReportDaily = (req, res) => {
  Meet.findAll({
    include: [
      { model: User, attributes: ["id", "email", "nama", "role"] },
      { model: Tempat, attributes: ["id", "nama_tempat"] },
    ],
    where: {
      tanggal: req.params.tanggal,
    },
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

//get data by tanggal dan id pba dari tabel pertemuan + feedback untuk pbam
exports.pbaReportDailyById = (req, res) => {
  Meet.findAll({
    include: [
      { model: User, attributes: ["id", "email", "nama", "role"] },
      { model: Tempat, attributes: ["id", "nama_tempat"] },
    ],
    where: {
      tanggal: req.params.tanggal,
      id_pba: req.params.id_pba,
    },
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

// Rangking PBA perhari
exports.reportRankPBA = (req, res) => {
  Meet.findAll({
    attributes: [[sequelize.fn("sum", sequelize.col("rating_pcu")), "total"]],
    include: [{ model: User }],
    where: {
      tanggal: req.params.tanggal,
    },
    group: ["User.id"],
    raw: true,
    order: sequelize.literal("total DESC"),
  })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "error mengambil data",
      });
    });
};

//find jadwal apakah available atau tidak
/*exports.pertemuanAvailable = (req, res) => {
    Meet.findOne(
        {where: { [Op.and]: [
            {tanggal: req.params.tanggal},
            {[Op.or]: [
                {jam_mulai: {[Op.between]: [req.params.jam_mulai, req.params.jam_selesai]}},
                {jam_selesai: {[Op.between]: [req.params.jam_mulai, req.params.jam_selesai]}}
            ]}
        ]}
        })
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "error mengambil data"
            });
        });
}*/
