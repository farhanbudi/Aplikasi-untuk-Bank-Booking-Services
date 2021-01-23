module.exports = (sequelize, Sequelize) => {
    const Tempat = sequelize.define("tempat", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nama_tempat: {
            type: Sequelize.STRING(100),
            unique: {
                args: true,
                msg: 'Lokasi sudah terdaftar'
            }
        }
    },{
        tableName: 'tempat'
    });

    return Tempat
}