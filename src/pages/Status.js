import React from 'react'
import db from '../firebase/firebase-config';
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { useState, useEffect } from 'react';

export default function Status() {

    const [users, setUsers] = useState([]);
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eventstatus, setEventStatus] = useState([]);

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

    const fetchEventStatus = async () => {
        try {
            const eventRef = collection(db, "event");

            const eventQuery = query(eventRef, orderBy("currentDateAndTime"))

            const querySnapshot = await getDocs(eventQuery);

            const queryList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            console.log(queryList);

            setEventStatus(queryList);

        } catch (error) {
            console.error("error to fetch Event status", error);
        }
    }

    useEffect(() => {
        fetchUsers()
        fetchQueries()
        fetchEventStatus()
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
                                <th scope='col'>Status</th>
                                <th scope="col">Event Status</th>
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
                                            <td><button className={`btn ${user.status == 1 ? `btn-success` : `btn-danger`}`}>{user.status == 1 ? 'Active' : 'Inactive'}</button></td>
                                            <td>
                                                <div>
                                                    {/* {queries.length > 0 ? (
                                                        queries.map((query) => (
                                                            query.answeredBy.includes(user.lotno) ? <div key={query.id} className='bg-success rounded-circle' style={{ width: 20, height: 20, marginRight: 20 }}></div> : ''
                                                        ))
                                                    ) : (
                                                        <p>No queries found</p>
                                                    )} */}

                                                    {eventstatus.length > 0 ? (
                                                        eventstatus.map((query) =>
                                                            query.lotNumber === user.lotno ? (
                                                                <ul key={query.id}>
                                                                    <li className='d-flex'>
                                                                        <div key={query.id} className='bg-success rounded-circle' style={{ width: 20, height: 20, marginRight: 20 }}></div>  <div>{new Date(query.currentDateAndTime.seconds * 1000).toLocaleDateString('en-GB', {
                                                                            day: '2-digit',
                                                                            month: '2-digit',
                                                                            year: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                            second: '2-digit',
                                                                            hour12: true
                                                                        })}</div>
                                                                    </li>
                                                                </ul>
                                                            ) : null
                                                        )
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
