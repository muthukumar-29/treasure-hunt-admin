import React from 'react'
import db from '../firebase/firebase-config';
import { collection, getDocs, } from 'firebase/firestore'
import { useState, useEffect } from 'react';

export default function Status() {

    const [users, setUsers] = useState([]);
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "users"));

            const usersList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            setUsers(usersList);
            setLoading(false);
        }
        catch (error) {
            console.error("error to fetch users", error);
        }
    }

    const fetchQueries = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "queries"));

            const queryList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            console.log(queryList);

            setQueries(queryList);

        } catch (error) {
            console.error("error to fetch Queries", error);
        }
    }

    useEffect(() => {
        fetchUsers()
        fetchQueries()
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h3>Event Status</h3>

            {/* <div>
                <h4>Queries:</h4>
                {queries.length > 0 ? (
                    queries.map((query) => (
                        <div key={query.id}>{query.answeredBy}</div>
                    ))
                ) : (
                    <p>No queries found</p>
                )}
            </div> */}

            {
                users.length === 0 ? (
                    <p>No Users found!!!</p>
                ) : (
                    <table className="table table-striped table-responsive">
                        <thead>
                            <tr>
                                {/* <th scope="col">ID</th> */}
                                <th scope="col">Lot Number</th>
                                <th scope="col">Email</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.map((user) => {
                                    return (
                                        <tr key={user.id}>
                                            {/* <td scope="row">{user.id}</td> */}
                                            <td>{user.lotno}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <div className='d-flex'>
                                                    {queries.length > 0 ? (
                                                        queries.map((query) => (
                                                            query.answeredBy.includes(user.lotno) ? <div key={query.id} className='bg-success rounded-circle' style={{ width: 20, height: 20, marginRight: 20 }}></div> : ''
                                                        ))
                                                    ) : (
                                                        <p>No queries found</p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                )
            }

        </div>
    )
}
