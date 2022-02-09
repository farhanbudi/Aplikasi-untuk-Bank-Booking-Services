const db = require("../models");
const sequelize = require("sequelize");
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
                                  .then((result) => {
                                    res.send({
                                      message: "Data berhasil di input!",
                                      data: {
                                        id_pcu: result.id_pcu,
                                        id_pba: result.id_pba,
                                        topik: result.topik,
                                        tanggal: result.tanggal,
                                        jam_mulai: result.jam_mulai,
                                        jam_selesai: result.jam_selesai,
                                        tempat_id: result.tempat_id,
                                      },
                                    });
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
          alasan: req.body.rejected_feedback,
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
      datemow: datenow,
      tanggal: tanggal,
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
          data: {
            rating: req.body.rating_pcu,
            feedback: req.body.feedback_pcu,
          },
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
          data: {
            rating: req.body.rating_pba,
            feedback: req.body.feedback_pba,
          },
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
      {
        model: User,
        require: true,
        as: "user_pcu",
        attributes: ["id", "email", "nama"],
      },
      {
        model: User,
        require: true,
        as: "user_pba",
        attributes: ["id", "email", "nama"],
      },
      {
        model: Tempat,
        attributes: ["id", "nama_tempat"],
      },
    ],
    where: {
      id: req.params.id_pertemuan,
    },
    attributes: [
      "id",
      "id_pcu",
      "id_pba",
      "topik",
      "tanggal",
      "jam_mulai",
      "jam_selesai",
      "status",
      "rating_pcu",
      "feedback_pcu",
      "rating_pba",
      "feedback_pba",
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

//get data by id pcu dari tabel pertemuan + feedback
exports.meetFindByPcu = (req, res) => {
  Meet.findAll({
    include: [
      {
        model: User,
        require: true,
        as: "user_pcu",
        attributes: ["id", "email", "nama"],
      },
      {
        model: User,
        require: true,
        as: "user_pba",
        attributes: ["id", "email", "nama"],
      },
      {
        model: Tempat,
        attributes: ["id", "nama_tempat"],
      },
    ],
    where: {
      id_pcu: req.params.id_pcu,
    },
    attributes: [
      "id",
      "id_pcu",
      "id_pba",
      "topik",
      "tanggal",
      "jam_mulai",
      "jam_selesai",
      "status",
      "rating_pcu",
      "feedback_pcu",
      "rating_pba",
      "feedback_pba",
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

//get data by id pba dari tabel pertemuan + feedback
exports.meetFindByPba = (req, res) => {
  Meet.findAll({
    include: [
      {
        model: User,
        require: true,
        as: "user_pcu",
        attributes: ["id", "email", "nama"],
      },
      {
        model: User,
        require: true,
        as: "user_pba",
        attributes: ["id", "email", "nama"],
      },
      {
        model: Tempat,
        attributes: ["id", "nama_tempat"],
      },
    ],
    where: {
      id_pba: req.params.id_pba,
    },
    attributes: [
      "id",
      "id_pcu",
      "id_pba",
      "topik",
      "tanggal",
      "jam_mulai",
      "jam_selesai",
      "status",
      "rating_pcu",
      "feedback_pcu",
      "rating_pba",
      "feedback_pba",
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

//get semua data dari tabel pertemuan + feedback
exports.meetFindAll = (req, res) => {
  Meet.findAll({
    include: [
      {
        model: User,
        require: true,
        as: "user_pcu",
        attributes: ["id", "email", "nama"],
      },
      {
        model: User,
        require: true,
        as: "user_pba",
        attributes: ["id", "email", "nama"],
      },
      {
        model: Tempat,
        attributes: ["id", "nama_tempat"],
      },
    ],
    attributes: [
      "id",
      "id_pcu",
      "id_pba",
      "topik",
      "tanggal",
      "jam_mulai",
      "jam_selesai",
      "status",
      "rating_pcu",
      "feedback_pcu",
      "rating_pba",
      "feedback_pba",
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

//get data by tanggal dari tabel pertemuan + feedback untuk pbam
exports.pbaReportDaily = (req, res) => {
  Meet.findAll({
    include: [
      {
        model: User,
        require: true,
        as: "user_pcu",
        attributes: ["id", "email", "nama"],
      },
      {
        model: User,
        require: true,
        as: "user_pba",
        attributes: ["id", "email", "nama"],
      },
      {
        model: Tempat,
        attributes: ["id", "nama_tempat"],
      },
    ],
    where: {
      tanggal: req.params.tanggal,
    },
    attributes: [
      "id",
      "id_pcu",
      "id_pba",
      "topik",
      "tanggal",
      "jam_mulai",
      "jam_selesai",
      "status",
      "rating_pcu",
      "feedback_pcu",
      "rating_pba",
      "feedback_pba",
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

//get data by tanggal dan id pba dari tabel pertemuan + feedback untuk pbam
exports.pbaReportDailyById = (req, res) => {
  Meet.findAll({
    include: [
      {
        model: User,
        require: true,
        as: "user_pcu",
        attributes: ["id", "email", "nama"],
      },
      {
        model: User,
        require: true,
        as: "user_pba",
        attributes: ["id", "email", "nama"],
      },
      {
        model: Tempat,
        attributes: ["id", "nama_tempat"],
      },
    ],
    where: {
      tanggal: req.params.tanggal,
      id_pba: req.params.id_pba,
    },
    attributes: [
      "id",
      "id_pcu",
      "id_pba",
      "topik",
      "tanggal",
      "jam_mulai",
      "jam_selesai",
      "status",
      "rating_pcu",
      "feedback_pcu",
      "rating_pba",
      "feedback_pba",
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

// Rangking PBA perhari
exports.reportRankPBA = (req, res) => {
  Meet.findAll({
    attributes: [
      [sequelize.fn("avg", sequelize.col("rating_pcu")), "average_rating"],
    ],
    include: [
      {
        model: User,
        require: true,
        as: "user_pba",
        attributes: ["id", "email", "nama"],
      },
    ],
    where: {
      tanggal: req.params.tanggal,
    },
    group: ["user_pba.id"],
    raw: true,
    order: sequelize.literal("average_rating DESC"),
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

exports.findTanggal = (req, res) => {
  Meet.findAll({
    where: {
      [Op.and]: [
        { tanggal: { [Op.gte]: req.params.tanggal_mulai } },
        { tanggal: { [Op.lte]: req.params.tanggal_selesai } },
      ],
    },
    include: [
      {
        model: User,
        require: true,
        as: "user_pcu",
        attributes: ["id", "email", "nama"],
      },
      {
        model: User,
        require: true,
        as: "user_pba",
        attributes: ["id", "email", "nama"],
      },
    ],
  })
    .then((result) => {
      res.send({ data: result });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "error mengambil data",
      });
    });
};
