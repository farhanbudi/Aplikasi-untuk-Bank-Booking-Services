module.exports = (sequelize, Sequelize) => {
    const Meet = sequelize.define("pertemuan", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        id_pcu: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: 'id'
            }
        },
        id_pba: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: 'id'
            }
        },
        topik: {
            type: Sequelize.STRING(20)
        },
        tanggal: {
            type: Sequelize.DATEONLY
        },
        jam_mulai: {
            type: Sequelize.TIME
        },
        jam_selesai: {
            type: Sequelize.TIME
        },
        tempat_id: {
            type: Sequelize.INTEGER,
            references: {
                model: "tempat",
                key: 'id'
            }
        },
        status: {
            type: Sequelize.STRING(10)
        },
        rejected_feedback: {
            type: Sequelize.STRING(255)
        },
        feedback_pcu: {
            type: Sequelize.STRING(255)
        },
        feedback_pba: {
            type: Sequelize.STRING(255)
        },
        rating_pcu: {
            type: Sequelize.INTEGER
        },
        rating_pba: {
            type: Sequelize.INTEGER
        },
    },{
        tableName: 'pertemuan'
    });

    return Meet
}