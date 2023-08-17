import {Link, useNavigate} from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import axios from "axios"
import { getUserID } from "../hooks/getUserID";
import View from "./View";

export const Home = () => {
    const [cookies,setCookies] = useCookies(["access_token"])
    const navigate = useNavigate()

    const logout = () => {
        setCookies("access_token","")
        window.localStorage.removeItem("userID")
        navigate("/auth")
    }

    const [contacts,setContacts] = useState([])

    const userID = getUserID()

    const [contact,setContact] = useState({
        name: "",
        surname: "",
        number: "",
        userOwner: userID
    })

    const [updatedID,setUpdatedID] = useState("")

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/contacts/${userID}`)
                setContacts(response.data)
            } catch (error) {
                console.error(error)
            }
        }

        fetchContacts()
    }, [])

    

    const handleChange = (event) => {
        const {name,value} = event.target
        setContact({...contact, [name]:value})
    }

    const [add,setAdd] = useState(false)
    const [edit,setEdit] = useState(false)

    const handleAdd = () => {      
        if(add) {
            setAdd(false)
        }
        else{
            setAdd(true)
        }
        if(edit) {
            setEdit(false)
        }
        setContact({
            name: "",
            surname: "",
            number: "",
            userOwner: userID
        })

    }

    const handleAddEdit = () => {
        if(edit) {
            edit ? setEdit(false) : setEdit(true)
            if(add) setAdd(false);
        }
        if(add) {
            add ? setAdd(false) : setAdd(true)
            if(edit) setEdit(false);
        }
        setContact({
            name: "",
            surname: "",
            number: "",
            userOwner: userID
        })
    }

    const addContact = async (e) => {
        e.preventDefault()

        try {
            const res = await axios.post("http://localhost:3001/contacts",contact)
            setContacts(prev => [...prev,res.data])
            alert("Contact created!")
            setContact({
                name: "",
                surname: "",
                number: "",
                userOwner: userID
            })
            setAdd(false)
        } catch (error) {
            console.error(error)
        }
    }

    const editContact = (id) => {
        edit ? setEdit(false) : setEdit(true)
        add ? setAdd(false) : setAdd(add)
        
        setUpdatedID(id)

        for (let index = 0; index < contacts.length; index++) {
            if(contacts[index]._id === id) {
                setContact({
                    name:contacts[index].name,
                    surname:contacts[index].surname,
                    number:contacts[index].number,
                    userOwner:userID
                })
            }
            
        }

    }

    const updateContact = async (e) => {
        e.preventDefault()
        try {
            const updatedName = contact.name
            const updatedSurname = contact.surname
            const updatedNumber = contact.number
            const res = await axios.put(`http://localhost:3001/contacts/update/${updatedID}`,{updatedName,updatedSurname,updatedNumber})
            alert("Contact updated!")
            setEdit(false)
            const updatedContactIndex = contacts.findIndex(item => item._id === updatedID)
            contacts[updatedContactIndex].name = updatedName
            contacts[updatedContactIndex].surname = updatedSurname
            contacts[updatedContactIndex].number = updatedNumber
        } catch (error) {
            console.error(error)
        }

    }

    const deleteContact = async (id) => {
        try{
            const res = await axios.delete(`http://localhost:3001/contacts/delete/${id}`)
            const newContacts = contacts.filter(item=> item._id !== id);
            setContacts(newContacts);
          }catch(err){
            console.log(err);
          }
    }


    return (

        <div className="home" >
            <div className="home-content">

                {!cookies.access_token ? <Link to="/auth" >Login/Register</Link> : <button className="logout" onClick={logout}>Logout</button>}
                <br/>
                <h1>{localStorage.getItem("username")}'s Contacts</h1>
                <button className="add-contact" onClick={handleAdd}>Add Contact</button>
                

                {add && 
                    <div>
                        <div onClick={handleAddEdit} className="overlay"></div>
                            <div className="wrapper">
                                <div className="main">
                                    <div className="form-container">
                                        <form className="form-group" autoComplete="off" onSubmit={addContact}>
                                            <label>Name</label>
                                            <input type="text" className="form-control" name="name" required 
                                            onChange={handleChange} />
                                            <br />
                                            <label>Surname</label>
                                            <input type="text" className="form-control" name="surname" required 
                                            onChange={handleChange} />
                                            <br />
                                            <label>Number</label>
                                            <input type="text" className="form-control" name="number" required 
                                            onChange={handleChange} />
                                            <br />
                                            <button type="submit" className="btn btn-success btn-md">ADD</button>
                                            <button onClick={handleAdd} className="close-btn">CLOSE</button>
                                        </form>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {edit && 
                    <div>
                        <div onClick={handleAddEdit} className="overlay"></div>
                            <div className="wrapper">
                                <div className="main">
                                    <div className="form-container">
                                        <form className="form-group" autoComplete="off" onSubmit={(e) => {updateContact(e)}}>
                                            <label>Name</label>
                                            <input type="text" id="name-text" className="form-control" name="name" required 
                                             value={contact.name} onChange={handleChange} />
                                            <br />
                                            <label>Surname</label>
                                            <input type="text" id="surname-text" className="form-control" name="surname" required 
                                             value={contact.surname} onChange={handleChange} />
                                            <br />
                                            <label>Number</label>
                                            <input type="text" className="form-control" name="number" required 
                                             value={contact.number} onChange={handleChange} />
                                            <br />
                                            <button type="submit" id="save-btn" className="btn btn-success btn-md">SAVE</button>
                                            <button onClick={handleAddEdit} className="close-btn">CLOSE</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                }

                <div className="view-container">
                    {contacts.length >0 && <>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th id="table-th">Id</th>
                                        <th id="table-th">Name</th>
                                        <th id="table-th">Surname</th>
                                        <th id="table-th">Number</th>
                                        <th id="table-th">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <View contacts={contacts} editContact={editContact} deleteContact={deleteContact}/>
                                </tbody>
                            </table>
                        </div>
                    </>}
                    {contacts.length < 1 && <div>There are currently no entries in your directory.</div>}  
                </div>

            </div>
        </div>
    )
}