//Import the useContext hook
import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

//import the UserContext object
import UserContext from '../UserContext';

console.log(process.env.REACT_APP_API_URL);

export default function Login(props) {

    //deconstruct the user state  and setUser setter function
    //allows us to consume the User context object and its properties to use for user validation
    const { user, setUser } = useContext(UserContext);



    // State hooks to store the values of the input fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // State to determine whether submit button is enabled or not
    const [isActive, setIsActive] = useState(true);


    function authenticate(e) {

        console.log(process.env.REACT_APP_API_URL);

        // Prevents page redirection via form submission
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

            //If no user information is found, the "access" property will not be available and will return undefined

            //if(data.access)


            //Using the typeof operator will return a string of the data type of the variable/expression which is why the value being compared is in a string data type
            if(typeof data.access !== "undefined"){

                //Set the token of the authenticated user in the local storage
                //Syntax:
                    //localStorage.setItem("propertyName",value);
                //storing information in the localStorage will make the data persistent even as the page is refreshed

                //We commented out these statements so that there will be no conflict with the user info to be stored
                localStorage.setItem('token', data.access);
                
                //we invoke this function here to retrieve the user details
                    //the user details will be used to set the value of the user state to id and admin
                retrieveUserDetails(data.access);


                //setting the GLOBAL user state to have properties obtained from the local storage

                // setUser({
                //     access: localStorage.getItem('token')
                // })

            
                //alert(`You are now logged in`);

                Swal.fire({
                    title:"Login Successful!",
                    icon: "success",
                    text: "Welcome to Zuitt!"
                })


                // Clear input fields after submission
                setEmail('');
                setPassword('');
            
            } else if (data.error === "No Email Found") {

                //alert(`Email not found`);

                Swal.fire({
                    title:`${email} not found`,
                    icon: "error",
                    text: "Check your login credentials and try again."
                })


            } else {

                //alert(`${email} does not exist`)

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