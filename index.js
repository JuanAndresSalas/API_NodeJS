import express from "express"
import { Sequelize } from "sequelize";
import indexRoutes from "./routes/router.js"

const app = express()
const sequelize = new Sequelize(process.env.CONFIG)
sequelize.sync()

app.use(indexRoutes)

app.listen(4000, () =>{
    console.log("api puerto 4000")
})





