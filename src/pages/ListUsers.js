import React, { useEffect, useState } from "react"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import db from "../firebase/firebase-config"
import Swal from "sweetalert2";

export default function ListUsers() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));

      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      // usersList.map((item)=>{
      //   console.log(item.email);
      // })

      setUsers(usersList);
      setLoading(false);
    }
    catch (error) {
      console.error("error to fetch users", error);
    }
  }

  useEffect(() => {
    fetchUsers()
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleDelete = async (id) => {

    const result = await Swal.fire({
      title: 'Are you sure to Delete User?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "users", id))
        setUsers(users.filter((users) => users.id != id));

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "User Deleted Successfully",
        });

      } catch (error) {
        console.error("Error Deleting query:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to Delete User",
        });
      }
    }
  }

  return (
    <div>
      <h2>User List</h2>

      {
        users.length === 0 ? (
          <p>No Users found!!!</p>
        ) : (
          <table className="table table-striped">
            <thead><tr>
              {/* <th scope="col">ID</th> */}
              <th scope="col">Lot Number</th>
              <th scope="col">Email</th>
              <th scope="col">Action</th>
            </tr>
            </thead>
            <tbody>
              {
                users.map((user) => (
                  <tr>
                    {/* <td scope="row">{user.id}</td> */}
                    <td>{user.lotno}</td>
                    <td>{user.email}</td>
                    <td>
                      <button type="submit" className="btn btn-danger text-white" onClick={() => handleDelete(user.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        )
      }
    </div>
  )
}
