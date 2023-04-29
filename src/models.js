import Sequelize from "sequelize"
import dotenv from "dotenv"


dotenv.config()
export const sequelize = new Sequelize(process.env.CONFIG)


// Verificar la conexión
sequelize.authenticate()
.then(() => {
    console.log('Conexión exitosa a la base de datos.');
})
.catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
});


export const tablaCategoria = sequelize.define('categoria',{
    idcategoria: {type:Sequelize.INTEGER, primaryKey: true, autoIncrement: 10},
    nombre: {type:Sequelize.STRING, allowNull: false}
},{timestamp: false, createdAt: false,updatedAt: false})

export const tablaUsuario = sequelize.define('usuario',{
    idusuario: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: 1000},
    nombre: {type: Sequelize.STRING, allowNull: false},
    apellido: {type: Sequelize.STRING, allowNull: false},
    correo: {type: Sequelize.STRING, allowNull: false, unique: true},
    contrasena: {type: Sequelize.STRING, allowNull: false},
    admin: {type: Sequelize.INTEGER, allowNull: true}
},{timestamp: false, createdAt: false,updatedAt: false})

export const tablaSubcategoria = sequelize.define('subcategoria',{
    idsubcategoria:{type: Sequelize.INTEGER, primaryKey: true, autoIncrement: 100},
    nombre: {type: Sequelize.STRING, allowNull: false}
},{timestamp: false, createdAt: false,updatedAt: false})

export const tablaOferta = sequelize.define('oferta',{
    idoferta: {type:Sequelize.INTEGER, primaryKey: true, autoIncrement:true,},
    precio: {type: Sequelize.INTEGER, allowNull: false},
    lugar: {type: Sequelize.STRING, allowNull: false},
    longitud: {type: Sequelize.STRING, allowNull: false},
    latitud: {type: Sequelize.STRING, allowNull: false},
    descripcion: {type: Sequelize.STRING, allowNull: false},
    imagen: {type: Sequelize.BLOB, allowNull: true,defaultValue: null,
        set(value) {
          if (value === '') {
            this.setDataValue('imagen', null);
          } else {
            this.setDataValue('imagen', value);
          }
        }},
    idsubcategoria_subcategoria: {type: Sequelize.INTEGER, allowNull: false},
    idusuario_usuario: {type: Sequelize.INTEGER, allowNull: false}
},{timestamp: false, createdAt: false,updatedAt: false})

//Relaciones entre tablas
tablaSubcategoria.belongsTo(tablaCategoria, { foreignKey: 'idcategoria_categoria' })
tablaCategoria.hasMany(tablaSubcategoria,{ foreignKey: 'idcategoria_categoria' })

tablaOferta.belongsTo(tablaUsuario, {foreignKey: 'idusuario_usuario'})
tablaUsuario.hasMany(tablaOferta, {foreignKey: 'idusuario_usuario'})

tablaOferta.belongsTo(tablaSubcategoria, {foreignKey: 'idsubcategoria_subcategoria'})
tablaSubcategoria.hasMany(tablaOferta,  {foreignKey: 'idsubcategoria_subcategoria'})

sequelize.sync()