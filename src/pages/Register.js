import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';


export default function Register() {

	const {user} = useContext(UserContext);

	console.log(user);

	//State hooks to store the values of the input fields
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");	
	const [email,setEmail] = useState("");
    const [mobileNo,setMobileNo] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // State to determine whether submit button is enabled or not
    const [isActive, setIsActive] = useState(false);

    console.log(firstName);
    console.log(lastName);
    console.log(email);
    console.log(mobileNo);
    console.log(password);
    console.log(confirmPassword);


    function registerUser(e) {

    	// Prevents page redirection via form submission
    	e.preventDefault();

    	fetch(`${process.env.REACT_APP_API_URL}/users/`, {

    		method:'POST',
    		headers: {
    			"Content-Type":"application/json"
    		},
    		body: JSON.stringify({

    			firstName: firstName,
    			lastName: lastName,
    			email: email,
    			mobileNo: mobileNo,
    			password: password

    		})
    	}).then(res => res.json())
    	.then(data => {

    		//data is the response of the api/server after its been proccessed as JS object through our res.json method
    		console.log(data)
    		//data will only contain an email property if we can properly save our user.
    		if(data.message === "Registered Successfully") {

    			setFirstName('');
    			setLastName('');
    			setEmail('');
    			setMobileNo('');
    			setPassword('');
    			setConfirmPassword('');

    			Swal.fire({
			        icon: 'success',
			        title: 'Success',
			        text: "Registration successful!",
			    });

    		}

    		else if (data.error === "Email invalid") {
    			Swal.fire({
			        icon: 'error',
			        title: 'Email is invalid',
			        text: 'Ok'
    			});
    		}

    		else if(data.error === "Mobile number invalid") {
    			Swal.fire({
			        icon: 'error',
			        title: 'Mobile number is invalid',
			        text: 'Ok'
    			});
    		}

    		else if(data.error === "Password must be atleast 8 characters") {
    			Swal.fire({
			        icon: 'error',
			        title: 'Password must be at least 8 characters',
			        text: 'Ok'
			    });
    		}

    		else if(data.error === "Duplicate Email Found") {
    			Swal.fire({
			        icon: 'error',
			        title: 'Duplicate Email',
			        text: 'Please use a different email adderss'
			    });
    		}

    		else {
    			Swal.fire({
			        icon: 'error',
			        title: 'Something went wrong',
			        text: 'Ok'
			    });
    		}
    	})
    }


    useEffect(() => {

    	if((firstName !== "" && lastName !== "" && email !== "" && mobileNo !== "" && password !=="" && confirmPassword !=="") && (password === confirmPassword) && (mobileNo.length === 11)) {
    		setIsActive(true)
    	}

    	else {
    		setIsActive(false)
    	}

    }, [firstName, lastName, email, mobileNo, password, confirmPassword])

    console.log("token",user.token)
    console.log("access",user.access)
    console.log("email", user.email)

	return (
        (user.id !== null) ?
            <Navigate to="/products" />
            :
            <div className="d-flex justify-content-center align-items-center vh-100 mt-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={6}>
                            <div className="rounded p-4 border">
                                <h1 className="text-center mb-4">Register</h1>
                                <Form onSubmit={(e) => registerUser(e)}>
                                    <Form.Group>
                                        <Form.Label>First Name:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter First Name"
                                            required
                                            value={firstName}
                                            onChange={e => { setFirstName(e.target.value) }}
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Last Name:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Last Name"
                                            required
                                            value={lastName}
                                            onChange={e => { setLastName(e.target.value) }}
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Email:</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter Email"
                                            required
                                            value={email}
                                            onChange={e => { setEmail(e.target.value) }}
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Mobile No:</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter 11 Digit No."
                                            required
                                            value={mobileNo}
                                            onChange={e => { setMobileNo(e.target.value) }}
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Password:</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter Password"
                                            required
                                            value={password}
                                            onChange={e => { setPassword(e.target.value) }}
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Confirm Password:</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Confirm Password"
                                            required
                                            value={confirmPassword}
                                            onChange={e => { setConfirmPassword(e.target.value) }}
                                        />
                                    </Form.Group>

                                    {/*conditionally render submit button based on the isActive state*/}
                                    <Form.Group className="text-center mt-4">
                                        {isActive ?
                                            <Button variant="primary" type="submit" id="submitBtn" className="w-100">Submit</Button>
                                            :
                                            <Button variant="danger" type="submit" id="submitBtn" disabled className="w-100">Please enter your registration details</Button>
                                        }
                                    </Form.Group>

                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
	)
}