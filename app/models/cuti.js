module.exports = (sequelize, Sequelize) => {
    const Cuti = sequelize.define("cuti", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        id_pba: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: 'id'
            }
        },
        tanggal_mulai: {
            type: Sequelize.DATEONLY
        },
        tanggal_selesai: {
            type: Sequelize.DATEONLY
        },
        keterangan: {
            type: Sequelize.STRING(10)
        }
    }, {
        tableName: 'jadwal_cuti'
    });

    return Cuti
}