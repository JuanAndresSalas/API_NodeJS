import Sequelize from "sequelize"
import dotenv from "dotenv"
import mysql from "mysql2"
import { llenadoTablas } from "./scriptBD.js";

dotenv.config()

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

//Función que comprueba si existe la base de datos, si existe crea los modelos y los exporta, si no existe crea la base, inserta los datos necesarios e inserta los datos necesarios en las tablas
async function setupDatabase() {
    let [comprobacionDB] = await connection.promise().query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${process.env.DATABASE}'`)
    if (comprobacionDB.length == 0){
        try {
            await connection.promise().query(`CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE}`);
            console.log('Base de datos creada correctamente.');
    
    
            // Crear la instancia de Sequelize y autenticarla
            const sequelize = new Sequelize(process.env.CONFIG);
            await sequelize.authenticate();
            console.log('Conexión exitosa a la base de datos.');
    
            // Definir los modelos de las tablas
            const tablaCategoria = sequelize.define('categoria', {
                idcategoria: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: 10 },
                nombre: { type: Sequelize.STRING, allowNull: false }
            }, { timestamp: false, createdAt: false, updatedAt: false })
    
            const tablaUsuario = sequelize.define('usuario', {
                idusuario: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: 1000 },
                nombre: { type: Sequelize.STRING, allowNull: false },
                apellido: { type: Sequelize.STRING, allowNull: false },
                correo: { type: Sequelize.STRING, allowNull: false, unique: true },
                contrasena: { type: Sequelize.STRING, allowNull: false },
                admin: { type: Sequelize.INTEGER, allowNull: true }
            }, { timestamp: false, createdAt: false, updatedAt: false })
    
            const tablaSubcategoria = sequelize.define('subcategoria', {
                idsubcategoria: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: 100 },
                nombre: { type: Sequelize.STRING, allowNull: false }
            }, { timestamp: false, createdAt: false, updatedAt: false })
    
            const tablaOferta = sequelize.define('oferta', {
                idoferta: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, },
                precio: { type: Sequelize.INTEGER, allowNull: false },
                lugar: { type: Sequelize.STRING, allowNull: false },
                longitud: { type: Sequelize.STRING, allowNull: false },
                latitud: { type: Sequelize.STRING, allowNull: false },
                descripcion: { type: Sequelize.STRING, allowNull: false },
                imagen: {
                    type: Sequelize.STRING, allowNull: true, defaultValue: null,
                    set(value) {
                        if (value === '') {
                            this.setDataValue('imagen', null);
                        } else {
                            this.setDataValue('imagen', value);
                        }
                    }
                },
                idsubcategoria_subcategoria: { type: Sequelize.INTEGER, allowNull: false },
                idusuario_usuario: { type: Sequelize.INTEGER, allowNull: false }
            }, { timestamp: false, createdAt: false, updatedAt: false })
    
            // Relaciones entre tablas
            await tablaSubcategoria.belongsTo(tablaCategoria, { foreignKey: 'idcategoria_categoria' });
            await tablaCategoria.hasMany(tablaSubcategoria, { foreignKey: 'idcategoria_categoria' });
    
            await tablaOferta.belongsTo(tablaUsuario, { foreignKey: 'idusuario_usuario' });
            await tablaUsuario.hasMany(tablaOferta, { foreignKey: 'idusuario_usuario' });
    
            await tablaOferta.belongsTo(tablaSubcategoria, { foreignKey: 'idsubcategoria_subcategoria' });
            await tablaSubcategoria.hasMany(tablaOferta, { foreignKey: 'idsubcategoria_subcategoria' });
    
            // Relaciones entre tablas
            await tablaSubcategoria.belongsTo(tablaCategoria, { foreignKey: 'idcategoria_categoria' });
            await tablaCategoria.hasMany(tablaSubcategoria, { foreignKey: 'idcategoria_categoria' });
    
            await tablaOferta.belongsTo(tablaUsuario, { foreignKey: 'idusuario_usuario' });
            await tablaUsuario.hasMany(tablaOferta, { foreignKey: 'idusuario_usuario' });
    
            await tablaOferta.belongsTo(tablaSubcategoria, { foreignKey: 'idsubcategoria_subcategoria' });
            await tablaSubcategoria.hasMany(tablaOferta, { foreignKey: 'idsubcategoria_subcategoria' });
    
    
            
            try {
                // Sincronización de las tablas con la base de datos
                await sequelize.sync();
                console.log('Tablas creadas y sincronizadas correctamente');
                connection.end();
                await llenadoTablas(tablaCategoria,tablaSubcategoria, tablaUsuario)   
    
                return { tablaCategoria, tablaOferta, tablaSubcategoria, tablaUsuario }
            } catch (error) {
                console.error('Error al sincronizar tablas:', error);
            }
    
        } catch (error) {
            console.log("Error: ", error)
        }
    }else{
        console.log(`Base de datos ${process.env.DATABASE}  ya existe`)
        const sequelize = new Sequelize(process.env.CONFIG);
            await sequelize.authenticate();
            console.log('Conexión exitosa a la base de datos.');
         // Definir los modelos de las tablas
         const tablaCategoria = sequelize.define('categoria', {
            idcategoria: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: 10 },
            nombre: { type: Sequelize.STRING, allowNull: false }
        }, { timestamp: false, createdAt: false, updatedAt: false })

        const tablaUsuario = sequelize.define('usuario', {
            idusuario: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: 1000 },
            nombre: { type: Sequelize.STRING, allowNull: false },
            apellido: { type: Sequelize.STRING, allowNull: false },
            correo: { type: Sequelize.STRING, allowNull: false, unique: true },
            contrasena: { type: Sequelize.STRING, allowNull: false },
            admin: { type: Sequelize.INTEGER, allowNull: true }
        }, { timestamp: false, createdAt: false, updatedAt: false })

        const tablaSubcategoria = sequelize.define('subcategoria', {
            idsubcategoria: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: 100 },
            nombre: { type: Sequelize.STRING, allowNull: false }
        }, { timestamp: false, createdAt: false, updatedAt: false })

        const tablaOferta = sequelize.define('oferta', {
            idoferta: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, },
            precio: { type: Sequelize.INTEGER, allowNull: false },
            lugar: { type: Sequelize.STRING, allowNull: false },
            longitud: { type: Sequelize.STRING, allowNull: false },
            latitud: { type: Sequelize.STRING, allowNull: false },
            descripcion: { type: Sequelize.STRING, allowNull: false },
            imagen: {
                type: Sequelize.BLOB, allowNull: true, defaultValue: null,
                set(value) {
                    if (value === '') {
                        this.setDataValue('imagen', null);
                    } else {
                        this.setDataValue('imagen', value);
                    }
                }
            },
            idsubcategoria_subcategoria: { type: Sequelize.INTEGER, allowNull: false },
            idusuario_usuario: { type: Sequelize.INTEGER, allowNull: false }
        }, { timestamp: false, createdAt: false, updatedAt: false })

        // Relaciones entre tablas
        await tablaSubcategoria.belongsTo(tablaCategoria, { foreignKey: 'idcategoria_categoria' });
        await tablaCategoria.hasMany(tablaSubcategoria, { foreignKey: 'idcategoria_categoria' });

        await tablaOferta.belongsTo(tablaUsuario, { foreignKey: 'idusuario_usuario' });
        await tablaUsuario.hasMany(tablaOferta, { foreignKey: 'idusuario_usuario' });

        await tablaOferta.belongsTo(tablaSubcategoria, { foreignKey: 'idsubcategoria_subcategoria' });
        await tablaSubcategoria.hasMany(tablaOferta, { foreignKey: 'idsubcategoria_subcategoria' });

        // Relaciones entre tablas
        await tablaSubcategoria.belongsTo(tablaCategoria, { foreignKey: 'idcategoria_categoria' });
        await tablaCategoria.hasMany(tablaSubcategoria, { foreignKey: 'idcategoria_categoria' });

        await tablaOferta.belongsTo(tablaUsuario, { foreignKey: 'idusuario_usuario' });
        await tablaUsuario.hasMany(tablaOferta, { foreignKey: 'idusuario_usuario' });

        await tablaOferta.belongsTo(tablaSubcategoria, { foreignKey: 'idsubcategoria_subcategoria' });
        await tablaSubcategoria.hasMany(tablaOferta, { foreignKey: 'idsubcategoria_subcategoria' });


        
        try {
            // Sincronización de las tablas con la base de datos
            await sequelize.sync();
            console.log('Tablas creadas y sincronizadas correctamente');
            connection.end();
            return { tablaCategoria, tablaOferta, tablaSubcategoria, tablaUsuario }
    }catch(error){
        console.log(error)
    }
    

    }
}
export default await setupDatabase()

