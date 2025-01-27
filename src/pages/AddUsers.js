import React, { useState } from 'react'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import db from "../firebase/firebase-config"
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function AddUsers() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [lotno, setLotno] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !lotno || !name) {

      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please Fill Out All Fields!",
      });

      return;
    }

    try {
      const usersRef = collection(db, "users")
      const emailQuery = query(usersRef, where("email", "==", email))
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        Swal.fire({
          icon: "error",
          title: "Duplicate Entry",
          text: "Email is Already Exists!",
        });
        return
      }

      const lotnoQuery = query(usersRef, where("lotno", "==", lotno));
      const lotnoSnapshot = await getDocs(lotnoQuery);

      if (!lotnoSnapshot.empty) {
        Swal.fire({
          icon: "error",
          title: "Duplicate Entry",
          text: "Lot Number already exists!",
        });
        return;
      }

      await addDoc(usersRef, { name, email, lotno, status: 0 });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "User Added Successfully!",
      });

      navigate("/users/view-users")

      setName("")
      setEmail("")
      setLotno("")
    }

    catch (error) {
      console.error("Error in adding user", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while adding the user!",
      });
    }

  }

  return (
    <div className='container'>
      <h3>Add Users</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label><span className='text-danger'>*</span>
          <input type="text" className="form-control" placeholder="Name" onChange={(e) => setName(e.target.value)} />
        </div>
        <br></br>
        <div>
          <label>Email</label><span className='text-danger'>*</span>
          <input type="email" className="form-control" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <br></br>
        <div>
          <label>Lot Number</label><span className='text-danger'>*</span>
          <input type='number' className='form-control' placeholder='Lot Number' onChange={(e) => setLotno(e.target.value)} />
        </div>
        <br></br>
        <input type='submit' value="Add" className='btn btn-success text-white' />
      </form>
    </div>
  )
}
