import React, { useEffect, useState } from 'react'
import db from "../firebase/firebase-config";
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilDelete } from '@coreui/icons';

export default function ViewQR() {

    const [clues, setClues] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchClues = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "clue"));

            const clueList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            setClues(clueList);
            setLoading(false);

        } catch (error) {
            console.error("error to fetch Clues", error);
        }
    }

    useEffect(() => {
        fetchClues()
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    const handleDelete = async (id) => {

        const result = await Swal.fire({
            title: 'Are you sure to delete QR?',
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
                await deleteDoc(doc(db, "clue", id))
                setClues(clues.filter((clues) => clues.id != id));

                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'The clue has been deleted.',
                });

            } catch (error) {
                console.error("Error deleting clue:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an issue deleting the clue.',
                });
            }
        }
    }

    const handleDownloadWithPadding = (imageUrl, filename) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.crossOrigin = 'anonymous'; // Allow cross-origin images to be used in the canvas
        img.src = imageUrl;

        img.onload = () => {
            const padding = 20; // Set padding around the image
            canvas.width = img.width + padding * 2;
            canvas.height = img.height + padding * 2;

            // Fill the canvas background with white
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw the image with padding
            ctx.drawImage(img, padding, padding);

            // Convert the canvas to a data URL and download
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
    };

    return (
        <div>
            <h2>QR Code</h2>

            {
                clues.length === 0 ? (
                    <p>No QR Code Found!!!</p>
                ) : (
                    <div className='container'>
                        <div className='row'>
                            {
                                clues.map((clues) => (
                                    <div className='col-md-4 col-lg-3 col-12 col-sm-4'>
                                        <div className="card">
                                            <img className="card-img-top img-fluid p-3" src={clues.qrCodeImagePath} alt="Card image cap" />
                                            <div className="card-body">
                                                {/* <p>{clues.encryptedClue}</p> */}
                                                <div className='d-flex justify-content-around'>
                                                    {/* <a href={clues.qrCodeImagePath} download={`clue-${clues.id}.png`} className='btn btn-primary text-white' >
                                                        <CIcon icon={cilCloudDownload} customClassName="nav-icon" width={30} />
                                                    </a> */}
                                                    <button type='button' className='btn btn-primary text-white' onClick={() => handleDownloadWithPadding(clues.qrCodeImagePath, `clue-${clues.id}.png`)}><CIcon icon={cilCloudDownload} customClassName="nav-icon" width={30} /></button>
                                                    <button type='submit' className='btn btn-danger text-white' onClick={() => handleDelete(clues.id)} ><CIcon icon={cilDelete} customClassName="nav-icon" width={30} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )
            }
        </div >
    )
}
