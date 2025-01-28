import React, { useState, useRef, useEffect } from 'react'
import Swal from 'sweetalert2';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { collection, addDoc } from 'firebase/firestore';
import db from "../firebase/firebase-config"
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';


export default function GenerateQR() {

    const [clue, setClue] = useState("");
    const [encryptedClue, setEncryptedClue] = useState("")
    const [qrCodeImagePath, setQrCodeImagePath] = useState("");
    const qrCodeRef = useRef(null);
    
    const navigate = useNavigate();

    const secretKey = "my-secret-key"

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (clue.trim() === "") {
            Swal.fire({
                icon: "warning",
                title: "Warning",
                text: "Please enter a clue!",
            });
            return;
        }

        const encrypted = CryptoJS.AES.encrypt(clue, secretKey).toString();
        setEncryptedClue(encrypted);
        console.log("Encrypted:" + encrypted)
    };

    useEffect(() => {

        if (encryptedClue) {

            const generateQrCode = async () => {

                try {

                    // const qrCodeDataUrl = await QRCode.toDataUrl(encrypted, { errorCorrectionLevel: 'H' });

                    const svg = qrCodeRef.current.querySelector("svg")
                    const svgData = new XMLSerializer().serializeToString(svg);
                    const dataUrl = `data:image/svg+xml;base64,${btoa(svgData)}`

                    const blob = dataURLToBlob(dataUrl);


                    const fileName = `${Date.now()}_qr_code.png`;
                    const formData = new FormData();
                    formData.append("file", blob, fileName);

                    const response = await axios.post("http://localhost:3003/upload-qrcode", formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });

                    const filePath = response.data.filePath;
                    setQrCodeImagePath(filePath);

                    await addDoc(collection(db, "clue"), {
                        clue: clue,
                        encryptedClue: encryptedClue,
                        qrCodeImagePath: filePath,
                        createdAt: new Date(),
                    })

                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "QR Uploaded and Store Successfully!",
                    });

                    navigate("/qrcode/view-qrcode")

                } catch (error) {
                    console.error("Error uploading QR code:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "There was an issue generating or uploading the QR code.",
                    });
                }
            };
            generateQrCode();
        }
    }, [encryptedClue]);

    const dataURLToBlob = (dataUrl) => {
        const [header, base64] = dataUrl.split(",");
        const mime = header.match(/:(.*?);/)[1];
        const binary = atob(base64);
        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
        }
        return new Blob([array], { type: mime });
    };

    return (
        <div>
            <div className='container'>
                <h3>Generate QR</h3>
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label>Enter Clue</label><span className='text-danger'>*</span>
                        <input type='text' className='form-control' placeholder='Enter Clue to Generate QR' onChange={(e) => setClue(e.target.value)}></input>
                    </div><br />
                    <input type='submit' className='btn btn-success text-white' value="Generate QR" />
                </form>
            </div>

            <div style={{ display:'none' }} ref={qrCodeRef}>
                <QRCode value={encryptedClue || "default"} />
            </div>

        </div>
    )
}