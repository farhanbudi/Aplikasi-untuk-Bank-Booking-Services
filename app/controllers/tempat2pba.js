const db = require('../models')
const TempatPBA = db.tempat2pba;
const User = db.users;

//menambah tempat untuk pba
exports.addLocPBA = async (req, res) => {
       const {id_pba, id_tempat} = req.body
       const post = {
           id_pba,
           id_tempat
       }
    
    User.findOne(
        {where: { [Op.and]: [
            {id: req.body.id_pba},
            {role: 'pba'},
        ]}
        })
        .then(function(result){
            if(result) {
                TempatPBA.create(post)
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
                res.send({status: "failed", message: "Data tidak terdaftar sebagai pba"})
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "error mengambil data"
            });
        });    
}

//get all location pba
exports.getLocPBA = (req, res) => {
    TempatPBA.findAll()
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