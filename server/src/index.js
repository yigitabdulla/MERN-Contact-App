import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/user.js";
import { contactsRouter } from "./routes/contacts.js";




const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/contacts",contactsRouter)


try {
    mongoose.connect("mongodb+srv://"+process.env.NAME+":"+process.env.LINK+"@contacts.d78wccw.mongodb.net/")
    console.log("Connected to database!");
} catch (error) {
    console.log(err);
}

app.listen(3001,() => {
    console.log("Server started!")
})