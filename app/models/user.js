module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: Sequelize.STRING(100),
            unique: {
                args: true,
                msg: 'Email sudah digunakan'
            }
        },
        password: {
            type: Sequelize.STRING(60)
        },
        nama: {
            type: Sequelize.STRING(50)
        },
        alamat: {
            type: Sequelize.STRING(100)
        },
        no_hp: {
            type: Sequelize.STRING(15)
        },
        role: {
            type: Sequelize.STRING(10)
        },
        status: {
            type: Sequelize.STRING(50)
        },
        managed_by: {
            type: Sequelize.STRING(50)
        },
        assisted_by: {
            type: Sequelize.STRING(50)
        },
        resetPassword: {
            type: Sequelize.STRING(100)
        }
        /* createdAt: {
             type: Sequelize.DATE,
             defaultValue: Sequelize.NOW
             //defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()')
             //defaultValue: Sequelize.fn('NOW')
         },
         updatedAt: {
             type: Sequelize.DATE,
             defaultValue: Sequelize.NOW
             //defaultValue: Sequelize.literal('CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()')
             //defaultValue: Sequelize.fn('NOW')
         }*/
    });

    return User;
}