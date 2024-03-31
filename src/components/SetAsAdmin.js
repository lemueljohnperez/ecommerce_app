import React, { useState, useEffect, useContext } from 'react';
import { Table, Button } from 'react-bootstrap';
import UserContext from '../UserContext';

function SetAsAdmin() {
    const {user} = useContext(UserContext);
    const [ details, setDetails ] = useState({})
    const [ message, setMessage ] = useState("");

    console.log(user)

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log("Data:", data);
            if (data && data.user) {
                setDetails(data.user); // Assuming `data.user` contains the user details
            }
        })
        .catch(error => {
            console.error('Error fetching user details:', error);
        });
    }, []);

    const handleSetAsAdmin = async (userId) => {
        try {
            const response = await fetch(`/users/${userId}/set-as-admin`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                setMessage('User set as admin successfully.');
            }

            else {
                setMessage('Failed to set user as admin.');
            }
        } catch (error) {
            setMessage('An error occurred.');
            console.error('Error setting user as admin:', error);
        }
    };

    return (
        <div>
            <h1 className="my-5 pt-5">Set User as Admin</h1>
            <Table striped bordered hover responsive>
                <thead className="bg-dark text-white">
                    <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile No</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {details && (
                        <tr key={details._id}>
                            <td>{details._id}</td>
                            <td>{`${details.firstName} ${details.lastName}`}</td>
                            <td>{details.email}</td>
                            <td>{details.mobileNo}</td>
                            <td>
                                <Button onClick={() => handleSetAsAdmin(details._id)}>Set as Admin</Button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {message && <p>{message}</p>}
        </div>
    );
};

export default SetAsAdmin;