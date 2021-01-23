module.exports = (sequelize, Sequelize) => {
    const Tempat2Pba = sequelize.define("tempat2pba", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        id_pba: {
            type: Sequelize.INTEGER,
            references: {
                model: "users",
                key: 'id'
            }
        },
        id_tempat: {
            type: Sequelize.INTEGER,
            references: {
                model: "tempat",
                key: 'id'
            }
        }
    },{
        tableName: 'tempat2pba'
    });

    return Tempat2Pba
}