import React, { useState } from 'react';

export default function UpdateProfile() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobileNo, setMobileNo] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        const profileData = {
            firstName,
            lastName,
            mobileNo,
        };

        fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(profileData),
        })
        .then(res => res.json())
        .then((response) => {
            if (response._id) {
                window.location.reload();
            }

            else {
                throw new Error('Profile update failed');
            }
        })
        .catch((error) => {
            console.error(error);
        });
    };

    return (
        <div className='container'>
            <h2 className='my-4'>Update Profile</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                
                <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                
                <div className="mb-3">
                    <label htmlFor="mobileNo" className="form-label">Mobile Number</label>
                    <input
                        type="text"
                        className="form-control"
                        id="mobileNo"
                        value={mobileNo}
                        onChange={(e) => setMobileNo(e.target.value)}
                    />
                </div>

                <button type="submit" className="btn btn-primary">Update Profile</button>
            </form>
        </div>
    );
};