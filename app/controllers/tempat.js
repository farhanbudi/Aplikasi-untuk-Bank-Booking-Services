const db = require('../models')
const Tempat = db.tempat;

//BPBA menambah list tempat SLP (sentra layana priority(?))
exports.addLoc = async (req, res) => {
    const post = {
        nama_tempat: req.body.nama_tempat
    }

    Tempat.create(post)
        .then((data) => {
            res.send(data);
            console.log('Data berhasil di input!')
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Data gagal di input!"
            });
        });
}

//BPBA melihat list of location
exports.getAllLoc = (req, res) => {
    Tempat.findAll()
        .then((result) => {
            res.send(result);
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "error mengambil data"
            });
        });
}

//BPBA mengedit list of location
exports.updateLoc = (req, res) => {
    const id = req.body.id;
    Tempat.update({
        nama_tempat:  req.body.nama_tempat,
    }, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Data berhasil di update"
                });
            } else {
                res.send({
                    message: `Id ${id} tidak ditemukan. Periksa kembali email anda`
                })
            }

        }).catch((err) => {
            res.status(500).send({
                message: err.message || "Data gagal di update"
            });
        });
}
