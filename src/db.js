import {createPool} from 'mysql2/promise'


const  pool = createPool({
    host:'localhost',
    user: 'root',
    password:'123456789',
    database: 'ofertapp',
    port: 3306
})

export default pool