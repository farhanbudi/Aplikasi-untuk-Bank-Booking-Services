const db = require('../models')
const Cuti = db.cuti;
const User = db.users;
const Op = db.Sequelize.Op;

//membuat jadwal cuti
exports.addCuti = async (req, res) => {
    const { id_pba, tanggal_mulai, tanggal_selesai} = req.body
    const post = {
        id_pba,
        tanggal_mulai,
        tanggal_selesai,
        keterangan: "active"
    }


    if ((Date.parse(tanggal_selesai) < Date.parse(tanggal_mulai)) ){
        res.status(500).send({
            message :  "Data tidak valid. Mohon Periksa kembali!"
        });
        document.getElementById("tanggal_selesai").value= "";
    };

    User.findOne(
        {where: { [Op.and]: [
            {id: req.body.id_pba},
            {role: 'pba'},
        ]}
        })
        .then(function(result){
            if (result) {
                Cuti.create(post)
                .then((data) => {
                    res.send(data);
                    console.log('Data berhasil di input!')
                })
                .catch((err) => {
                    res.status(500).send({
                        message: err.message || "Data gagal di input!"
                    });
                });
            } else {
                res.send({status: "failed", message:"User tidak terdaftar sebagai pba"})
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Data gagal di input!"
            });
        });
}

//mengupdate jadwal cuti
exports.updateCuti = (req, res) => {
    const {id, tanggal_mulai, tanggal_selesai, keterangan } = req.body;
    const update = {
        id,
        tanggal_mulai,
        tanggal_selesai,
        keterangan
    }

    if ((Date.parse(tanggal_selesai) < Date.parse(tanggal_mulai))){
        res.status(500).send({
            message :  "Data tidak valid. Mohon Periksa kembali!"
        });
        document.getElementById("tanggal_selesai").value= "";
    };

    Cuti.update(update, {
        where: { id : req.body.id}
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Data berhasil diupdate"
                });
            } else {
                res.send({
                    message: `Data tidak ditemukan di jadwal cuti. Mohon periksa kembali!`
                })
            }

        }).catch((err) => {
            res.status(500).send({
                message: err.message || "Data gagal diupdate"
            });
        });
}




//menghapus jadwal cuti
exports.deleteCuti = (req, res) => {
    Cuti.update({ keterangan: "deleted" }, {
        where: {
            id: req.body.id
        }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "jadwal libur berhasil dihapus"
            });
        } else {
            res.send({
                message: `id ${req.body.id} tidak ditemukan`
            })
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "PBAM tidak berhasil di set"
        });
    })
}

//mendapatkan semua jadwal cuti
exports.getAllCuti = (req, res) => {
    Cuti.findAll()
        .then((result) => {
            res.send({
                "status": "Success",
                "data": result
            })
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "error mengambil data"
            });
        });
}

// mendapatkan jadwal cuti dengan id
exports.getCuti = (req, res) => {
    Cuti.findAll({
        where: {
            id: req.params.id
        }
    })
        .then((result) => {
            res.send({
                "status": "Success",
                "data": result
            })
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "error mengambil data"
            });
        });
}
