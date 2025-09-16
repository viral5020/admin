import React, { useState } from 'react'
import { uploadUserTypeQtyMasterAPI } from './API/API'

const Masterqtysetting = () => {
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage("Please select a CSV file first.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");
            const data = await uploadUserTypeQtyMasterAPI(file);
            setMessage(`✅ ${data.message || "File uploaded successfully."}`);
        } catch (err) {
            setMessage("❌ Upload failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Inline styles
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f4f4'
    }

    const cardStyle = {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
    }

    const inputStyle = {
        display: 'block',
        width: '100%',
        padding: '10px',
        marginBottom: '15px',
        borderRadius: '6px',
        border: '1px solid #ccc'
    }

    const buttonStyle = {
        width: '100%',
        padding: '10px',
        backgroundColor: '#00bfa5',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px'
    }

    const messageStyle = {
        marginTop: '15px',
        fontWeight: '500',
        color: message.startsWith('✅') ? 'green' : 'red'
    }

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={{ marginBottom: '20px' }}>Upload User Type Qty Master CSV</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        style={inputStyle}
                    />
                    <button type="submit" disabled={loading} style={buttonStyle}>
                        {loading ? 'Uploading...' : 'Submit'}
                    </button>
                </form>
                {message && <p style={messageStyle}>{message}</p>}
            </div>
        </div>
    )
}

export default Masterqtysetting
