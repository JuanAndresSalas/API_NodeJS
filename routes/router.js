import express from "express"
import bodyParser from "body-parser"
import { busquedaOfertas, ingresarOferta, nuevoUsuario, obtenerCategorias, obtenerUsuario, ofertasSugeridas, infoInteraccionUsuarios } from "../src/controllers.js";
import { validarToken } from "../src/token.js";






const router = express.Router()

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }))


router.get('/v1/ingreso', async (req, response) => {
    let {username, password} = req.query
    let comprobacionUsuario = await obtenerUsuario(username, password)
    response.json(comprobacionUsuario)
})

router.get("/v1/buscar-categorias", async (req, res) => {
    const respuesta = await obtenerCategorias()
    res.json(respuesta)
})


router.put("/v1/crear-oferta",validarToken, async (req, res) =>{
    try{
        let respuesta = await ingresarOferta(req.query)
        if(respuesta == true){
            res.json({ success: true })
        }else if (respuesta == false){
            res.json({ success: false })
        }
    }catch(error){
        console.log(error)
        res.json({success:false})
    }
})

router.put("/v1/registrarse", async(req, res) =>{
    
    try {
        let respuesta = await nuevoUsuario(req.body)
        if(respuesta == true){
            res.json({ success: true })
        }else if (respuesta == false){
            res.json({ success: false })
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false})
    }
})

router.get("/v1/buscar-oferta", async(req, res) =>{
   let busqueda = req.query.busqueda
   try{
    let respuesta = await busquedaOfertas(busqueda)   
    
    res.json(respuesta)
    
   }catch(error){
    console.log(error)
    res.json([])
   }
})

router.get("/v1/ofertas-sugeridas", async(req, res) =>{
    let respuesta
    try{
        respuesta = await ofertasSugeridas()
        res.json(respuesta)
    }catch(error){
        res.json([])
    }
})

router.get("/v1/datos-ofertapp", async(req, res) =>{
    try{
        let respuesta = await infoInteraccionUsuarios()
        res.json(respuesta)
    }catch(error){
        console.log(error)
        res.json([])
    }
})
export default router