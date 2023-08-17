import mongoose from "mongoose"

const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true},
    surname: { type: String, required: true},
    number: { type: String, required: true },
    userOwner: {type: mongoose.Schema.Types.ObjectId, ref:"users", required:true}
  });
  
  export const ContactModel = mongoose.model("contacts", ContactSchema);