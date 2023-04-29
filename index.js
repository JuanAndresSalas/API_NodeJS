import express from "express"
import { sequelize } from "./src/models.js"
import indexRoutes from "./routes/router.js"

const app = express()

sequelize.sync()

app.use(indexRoutes)

app.listen(4000, () =>{
    console.log("api puerto 4000")
})





