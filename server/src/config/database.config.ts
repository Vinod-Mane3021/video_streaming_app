import mongoose from "mongoose";
import { Keys } from "./keys";

/**
 * Connecting to the MongoDB database using Mongoose.
 * @returns - A Promise representing the Mongoose connection.
 * @throws {Error} Throws an error if there is an issue connecting to the database.
 */

const connectDB = async () => {
    try {
        const response = await mongoose.connect(`${Keys.DATABASE.URI}/${Keys.DATABASE.NAME}`)
        if(response.connection.readyState === 1) {
            console.log(`✔️ mongoDB connection established | DB_NAME: ${Keys.DATABASE.NAME} | HOST: ${response.connection.host} | MONGODB_URL: ${Keys.DATABASE.URI}`)
        }
        return response;
    } catch (error) {
        // Log an error message and throw the error if there is an issue connecting to the database.
        console.error("Got error while connecting to database : ", error);
        throw error;
    }
}

export { connectDB }


