const UserDao = require ('../DAO/user-dao.mongo')
const User = new UserDao()
const transport = require('../utils/nodemailer.util')
const { userEmail } = require('../configs/app.config')

async function getUserCart(uid) {
    try {
        const user = await User.getUserById(uid)
        return user ? user.cart : null
    } catch (error) {
        throw new Error('Error al obtener el carrito del usuario')
    }
}

async function updateUserCart(uid, cid) {
    try {
        await User.updateUserCart(uid, cid)
    } catch (error) {
        throw new Error('Error al actualizar el carrito del usuario')
    }
}
async function createUser(newUserDto) {
    try {
        const createdUser = await User.createUser(newUserDto);
        await transport.sendMail({
            from: userEmail,
            to: createdUser.email,
            subject: 'Bienvenido a VinoMania',
            html: `
                <h1>Hola ${createdUser.first_name}</h1>
                <p>Mira las promociones actuales</p>
            `
        });
        return createdUser;
    } catch (error) {
        console.error('Error al crear un usuario:', error);
        throw new Error('Error al crear un usuario');
    }
}


module.exports = {
    getUserCart,
    updateUserCart,
    createUser,
}
