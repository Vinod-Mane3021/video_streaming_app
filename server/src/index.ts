import dotenv from 'dotenv'
import { connectDB } from './config/database.config'
import app from './app'
import { Keys } from './config/keys'



dotenv.config({
    path: "./.env",
})


connectDB()
.then(() => {
    app.listen(Keys.PORT, () => {
        console.log(`⚙️  Server is running at port : ${Keys.PORT}`);
    })
    app.on("error", (error) => {
        console.error("Database not connected : ", error);
        throw error
    })
})
.catch((error) => {
    console.error("MONGO db connection failed! ", error);
    throw error;
})