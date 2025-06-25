import dotenv from "dotenv";
import mongodbConnection from "./db/index.js";
import { app } from "./app.js";

dotenv.config({path: './.env'});


mongodbConnection()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server running in port ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MongoDB connection failed ", err);
    process.exit(1);
});


