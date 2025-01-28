import React, { useState } from 'react'
import CryptoJS from 'crypto-js'

export default function decrypt() {

    const [encrypted, setEncrypted] = useState("");
    const [decrypted, setDecrypted] = useState("");
    
    const secretKey = "my-secret-key"

    const handleSubmit = (e) => {

        e.preventDefault();

        const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        console.log("Decrypted:" + decrypted);

        setDecrypted(decrypted);

        setEncrypted("");
    }


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type='text' className='form-control' onChange={(e) => setEncrypted(e.target.value)} placeholder='Enter code to decrypt'></input>
                <br />
                <input type='submit' value="decrypt" className='btn btn-success text-white' />
                
                <p>Decrypted : {decrypted}</p>
            </form>
        </div>
    )
}
