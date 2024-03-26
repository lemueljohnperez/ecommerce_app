//Import the useContext hook
import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

//import the UserContext object
import UserContext from '../UserContext';

console.log(process.env.REACT_APP_API_URL);

export default function Login(props) {

    const { user, setUser } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(true);


    function authenticate(e) {

        console.log(process.env.REACT_APP_API_URL);

        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_URL}/users/login`,{

        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({

            email: email,
            password: password

        })
    })
    .then(res => res.json())
    .then(data => {

            console.log(data);

            if(typeof data.access !== "undefined"){

                localStorage.setItem('token', data.access);

                retrieveUserDetails(data.access);

                Swal.fire({
                    title:"Login Successful!",
                    icon: "success",
                    text: "Welcome to Zuitt!"
                })

                setEmail('');
                setPassword('');
            
            } else if (data.error === "No Email Found") {

                Swal.fire({
                    title:`${email} not found`,
                    icon: "error",
                    text: "Check your login credentials and try again."
                })


            } else {

                Swal.fire({
                    title:`${email} does not exist`,
                    icon: "error",
                    text: "Check your login credentials and try again."
                })
            }
        })

    }


    const retrieveUserDetails = (token) =>{

        // GET /users verify

        fetch('http://localhost:4000/users',{
            headers:{
                Authorization: `Bearer ${ token }`
            }
        })
        .then(res=>res.json())
        .then(data=>{

            console.log(data);
            //changes the global user state to store the id and isAdmin property of the user which we will be using for validation across our app
            setUser({
                id: data.user._id,
                isAdmin: data.user.isAdmin
            })
        })
    }

    useEffect(() => {
        // Validation to enable submit button when all fields are populated and both passwords match
        if(email !== '' && password !== ''){
            setIsActive(true);
        }else{
            setIsActive(false);
        }
    }, [email, password]);

    console.log(user);

    return (
            //create a conditional statement that will redirect the user to courses page when a user is logged in
            //Comment out the page redirection to make it easy to implement the fetch method in our Login Page
            (user.id !== null)?
            <Navigate to ="/courses"/>
            :
            <Form onSubmit={(e)=>authenticate(e)}>
                <h1 className="my-5 text-center">Login</h1>
                <Form.Group controlId="userEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                { isActive ? 
                    <Button variant="primary" type="submit" id="submitBtn">
                        Submit
                    </Button>
                    : 
                    <Button variant="danger" type="submit" id="submitBtn" disabled>
                        Submit
                    </Button>
                }
            </Form>
    )
}