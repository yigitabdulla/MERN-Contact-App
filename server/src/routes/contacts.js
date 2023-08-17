import { ContactModel } from "../models/Contacts.js";
import {UserModel} from "../models/Users.js"
import express from "express";
import mongoose from "mongoose";

const router = express.Router()

router.get("/:id", async (req,res) => {
    try {
        const id = req.params.id;
        const response = await ContactModel.find({userOwner:id})
        res.json(response)
    } catch (error) {
        res.json(error)
    }
}) 

router.put("/update/:id", async (req,res) => {
    try {
        const updatedName = req.body.updatedName
        const updatedSurname = req.body.updatedSurname
        const updatedNumber = req.body.updatedNumber
        await ContactModel.findByIdAndUpdate(req.params.id,{ $set:{name:updatedName, surname:updatedSurname, number:updatedNumber }})
        res.status(200).json('Item updated');
    } catch (error) {
        res.json(error)
    }
})

router.post("/", async (req,res) => {

    const contact = new ContactModel(req.body)

    try {
        const response = await contact.save()
        res.json(response)
    } catch (error) {
        res.json(error)
    }
})

router.delete('/delete/:id', async (req, res)=>{
    try{
      //find the item by its id and delete it
      const deleteItem = await ContactModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Item Deleted');
    }catch(err){
      res.json(err);
    }
  })


export {router as contactsRouter}
