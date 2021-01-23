module.exports = (sequelize, Sequelize) => {
    const Holidays = sequelize.define("jadwal_libur", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        tanggal_mulai: {
            type: Sequelize.DATEONLY,
            required: true,
        },

        tanggal_selesai: {
            type: Sequelize.DATEONLY,
            required: true,
        },

        keterangan: {
            type: Sequelize.STRING(500)
        },
    }, {
        tableName: "jadwal_libur"
    });

    return Holidays;
}