import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import db from "../firebase/firebase-config"
import React, { useState } from 'react'
import Swal from 'sweetalert2'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddQuery() {

    const [question, setQuery] = useState("")
    const [answer, setAnswer] = useState("")
    const [questionFile, setFile] = useState(null)

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!question && !questionFile) {
            Swal.fire({
                icon: "warning",
                title: "Warning",
                text: "Please upload a file or enter a question!",
            });

            return;
        }

        if (!answer) {
            Swal.fire({
                icon: "warning",
                title: "Warning",
                text: "Answer is required!",
            });

            return;
        }

        try {
            const queryRef = collection(db, "queries")
            const questionQuery = query(queryRef, where("question", "==", question))
            const questionSnapshot = await getDocs(questionQuery);

            // if (!questionSnapshot.empty) {
            //     Swal.fire({
            //         icon: "error",
            //         title: "Duplicate Entry",
            //         text: "Question is Already Exists!",
            //     });
            //     return
            // }

            let filePath = null;

            if (questionFile) {
                const formData = new FormData();
                formData.append("file", questionFile);

                const uploadResponse = await axios.post(
                    "https://treasure-hunt-uploads.onrender.com/upload",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                )

                filePath = uploadResponse.data.filePath;
            }

            await addDoc(queryRef, { question, answer, filePath, answeredBy: "" })

            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Question Added Successfully!",
            });

            navigate("/queries/view-queries")

            setQuery("")
            setAnswer("")
            setFile(null)

        }
        catch (error) {
            console.error("Error while add queries ", error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong while adding the questions!",
            });
        }

    }

    return (
        <div className='container'>
            <h3>Add Questions</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label>Question</label>
                    <textarea rows="3" className='form-control' placeholder='Enter Question' onChange={(e) => setQuery(e.target.value)}></textarea>
                </div><br />
                <div className='form-group'>
                    <label>Upload Question</label>
                    <input type='file' className='form-control' onChange={(e) => setFile(e.target.files[0])}></input>
                </div><br />
                <div className='form-group'>
                    <label>Answer</label><span className='text-danger'>*</span>
                    <input type='text' className='form-control' placeholder='Answer' onChange={(e) => setAnswer(e.target.value)}></input>
                </div><br />
                <button type='submit' className='btn btn-success text-white'>Add</button>
            </form>
        </div>
    )
}
