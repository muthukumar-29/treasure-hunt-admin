import React, { useEffect, useState } from "react"
import { collection, deleteDoc, getDocs, doc } from "firebase/firestore"
import db from "../firebase/firebase-config"
import Swal from "sweetalert2";

export default function ListQuery() {

    const [queries, setQuery] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchQueries = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "queries"));

            const queryList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            // usersList.map((item)=>{
            //   console.log(item.email);
            // })

            setQuery(queryList);
            setLoading(false);
        }
        catch (error) {
            console.error("error to fetch users", error);
        }
    }

    useEffect(() => {
        fetchQueries()
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    const handleDelete = async (id) => {

        const result = await Swal.fire({
            title: 'Are you sure to Delete Question?',
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
                await deleteDoc(doc(db, "queries", id))
                setQuery(queries.filter((query) => query.id != id));

                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: "Question Deleted Successfully",
                });
            } catch (error) {
                console.error("Error Deleting query:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to Delete Query",
                });
            }
        }
    }

    return (
        <div className="container">
            <h2>Query List</h2>
            {
                queries.length === 0 ? (
                    <p>No Users found!!!</p>
                ) : (
                    <table className="table table-striped">
                        <thead><tr>
                            {/* <th scope="col">ID</th> */}
                            <th scope="col">Question</th>
                            <th scope="col">Question File</th>
                            <th scope="col">Answer</th>
                            <th scope="col">Status</th>
                            <th scope="col">Answered By</th>
                            <th scope="col">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                queries.map((query) => (
                                    <tr>
                                        {/* <td scope="row">{user.id}</td> */}
                                        <td>{query.question}</td>
                                        <td>
                                            {query.filePath ? (<img className="img-fluid" width="200" src={query.filePath} alt="Question File"></img>) : "No file Uploaded"}
                                        </td>
                                        <td>{query.answer}</td>
                                        <td>{query.answered}</td>
                                        <td>{query.answeredBy ?? "none"}</td>
                                        <td>
                                            <button type="submit" className="btn btn-danger text-white" onClick={() => handleDelete(query.id)}>Delete</button>
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
