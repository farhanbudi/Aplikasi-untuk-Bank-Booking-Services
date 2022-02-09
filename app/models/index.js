const dbConfig = require("../config/db");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.min,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("../models/user")(sequelize, Sequelize);
db.jadwal_libur = require("../models/jadwal_libur")(sequelize, Sequelize);
db.pertemuan = require("../models/pertemuan")(sequelize, Sequelize);
db.tempat = require("../models/tempat")(sequelize, Sequelize);
db.cuti = require("../models/cuti")(sequelize, Sequelize);

db.users.hasMany(db.users, {
  foreignKey: "managed_by",
  sourceKey: "email",
});
db.users.hasMany(db.users, {
  foreignKey: "assisted_by",
  sourceKey: "email",
});
db.users.belongsTo(db.users, {
  foreignKey: "managed_by",
  sourceKey: "email",
  as: "managed",
});
db.users.belongsTo(db.users, {
  foreignKey: "assisted_by",
  sourceKey: "email",
  as: "assisted",
});

db.users.hasMany(db.pertemuan, { foreignKey: "id_pcu", sourceKey: "id" });
db.users.hasMany(db.pertemuan, { foreignKey: "id_pba", sourceKey: "id" });
db.pertemuan.belongsTo(db.users, {
  foreignKey: "id_pcu",
  sourceKey: "id",
  as: "user_pcu",
});
db.pertemuan.belongsTo(db.users, {
  foreignKey: "id_pba",
  sourceKey: "id",
  as: "user_pba",
});

db.users.hasMany(db.cuti, { foreignKey: "id_pba", sourceKey: "id" });
db.cuti.belongsTo(db.users, { foreignKey: "id_pba", sourceKey: "id" });

db.pertemuan.belongsTo(db.tempat, { foreignKey: "tempat_id", targetKey: "id" });
db.tempat.hasMany(db.pertemuan, { foreignKey: "tempat_id", targetKey: "id" });

module.exports = db;
