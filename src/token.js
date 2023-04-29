import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()



function generarToken(payload) {
    const claveSecreta = process.env.CLAVE_SECRETA;
    const token = jwt.sign(payload, claveSecreta, { expiresIn: '1y' });
    return token;
}


export function validarToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ mensaje: 'No se proporcionó un token' });
    }
    try {
      const claveSecreta = process.env.CLAVE_SECRETA; 
      const verificado = jwt.verify(token, claveSecreta);
      req.usuario = verificado; 
      next()
    } catch (error) {
      return res.status(401).json({ mensaje: 'Token inválido' });
    }
  }
