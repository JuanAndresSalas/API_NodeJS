//Import variables y funciones
import dotenv from "dotenv"
import { tablaUsuario, tablaCategoria, tablaSubcategoria, tablaOferta, sequelize } from "./models.js";
import { compararContraseña } from "./bcrypt.js";
import { Sequelize } from "sequelize";

//Configuración dotenv
dotenv.config()

//Funciones
export async function obtenerUsuario(username, password) {
    //Selección de columnas requeridas para presentar la información solicitada
    try {
        let data = await tablaUsuario.findOne({ where: { correo: username}, attributes: ['idusuario', 'nombre', 'correo', 'apellido','contrasena','admin'] })
        if(data!= null){
            let comparacion = compararContraseña(data.contrasena, password)
            if(comparacion){
                return data
            }else{
                return null
            }
        }else{
            return data
        }
        
    } catch (error) {
        throw error
    }
}

export async function obtenerCategorias() {
    const query = "SELECT nombre from subcategoria"
    try {
        const categorias = await sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
        return categorias
    } catch (error) {
        return error
    }
}

export async function ingresarOferta(body) {
    let { lugar, descripcion,latitud, longitud, id, categoria, precio, imagen } = body
    try {
        const queryUsuario = `SELECT idsubcategoria as id
                            FROM subcategoria
                            WHERE nombre LIKE '${categoria}'`

        let datos = await sequelize.query(queryUsuario, { type: Sequelize.QueryTypes.SELECT });
        
        let idsubcategoria = parseInt(datos[0].id)
        id = parseInt(id)
        const ofertaNueva = { precio: precio, lugar: lugar, longitud: longitud, latitud: latitud, descripcion: descripcion, imagen: imagen,  idsubcategoria_subcategoria: idsubcategoria, idusuario_usuario: id }

        try{
            tablaOferta.create(ofertaNueva)
            return true
        }catch(error){
            console.log(error)
            return false
        }
    }catch(error){
        console.log(error)
        return false
    }
}

export async function nuevoUsuario(body){
    let {correo, nombre, apellido, password} = body
    let usuarioNuevo = {nombre: nombre, apellido: apellido, correo: correo,contrasena: password}
    try{
        let comprobacion = await tablaUsuario.findOne({where:{correo: correo},attributes:['correo']})
        if(comprobacion != null){
            return false
        }else{
            let resp = tablaUsuario.create(usuarioNuevo)
            return true
        } 
    }catch (error) {
        console.log(error)
        return false
    }
}

export async function busquedaOfertas(busqueda){
    busqueda = busqueda.toUpperCase()
    let query = `SELECT o.precio AS precio,
                        o.lugar AS lugar,
                        o.longitud AS longitud,
                        o.latitud AS latitud,
                        o.descripcion AS descripcion,
                        o.imagen AS imagen
                FROM oferta o 
                JOIN subcategoria s ON(o.idsubcategoria_subcategoria = s.idsubcategoria)
                WHERE o.descripcion LIKE '%${busqueda}%' OR s.nombre LIKE '%${busqueda}%'
                `
    try{
        let ofertas = await sequelize.query(query,{ type: Sequelize.QueryTypes.SELECT })
        
        return ofertas
    }catch(error){
        console.log(error)
        return []
    }
    
}

export async function ofertasSugeridas(){
    //Uso se sentencias de ordenamiento
    let query = `SELECT precio,
                lugar,
                longitud,
                latitud,
                descripcion,
                imagen
                FROM oferta
                ORDER BY precio ASC
                LIMIT 6`
    try{
        let ofertas = await sequelize.query(query,{ type: Sequelize.QueryTypes.SELECT })
        return ofertas
    }catch(error){
        console.log(error)
        return []
    }
    
}

export async function infoInteraccionUsuarios(){
    //Uso de cláusulas de agrupación de información para obtener datos agregados
let query =     `SELECT u.idusuario AS id,
                u.nombre AS nombre,
                u.apellido AS apellido,
                u.correo AS correo,
                COUNT(o.idoferta) AS cantidadOfertas
                FROM oferta o 
                JOIN usuarios u on (o.idusuario_usuario = u.idusuario)
                GROUP BY u.nombre, u.apellido, u.correo
                ORDER BY cantidadOfertas DESC`
    let respuesta = sequelize.query(query,{ type: Sequelize.QueryTypes.SELECT })
    return respuesta
}