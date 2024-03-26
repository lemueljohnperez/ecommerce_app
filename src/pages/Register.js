import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import UserContext from '../UserContext';


export default function Register(){

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


    function registerUser(e){

    	// Prevents page redirection via form submission
    	e.preventDefault();

    	fetch('http://localhost:4000/users/register',{

    		method:'POST',
    		headers:{
    			"Content-Type":"application/json"
    		},
    		body: JSON.stringify({

    			firstName: firstName,
    			lastName: lastName,
    			email: email,
    			mobileNo: mobileNo,
    			password: password

    		})
    	}).then(res=>res.json())
    	.then(data =>{

    		//data is the response of the api/server after its been proccessed as JS object through our res.json method
    		console.log(data)
    		//data will only contain an email property if we can properly save our user.
    		if(data.message === "Registered Successfully"){

    			setFirstName('');
    			setLastName('');
    			setEmail('');
    			setMobileNo('');
    			setPassword('');
    			setConfirmPassword('');

    			alert("Registration successful!")

    		}else if (data.error === "Email invalid"){
    			alert("Email is invalid")
    		}else if(data.error === "Mobile number invalid"){
    			alert("Mobile number is invalid")
    		}else if(data.error === "Password must be atleast 8 characters"){
    			alert("Password must be at least 8 characters")
    		}else{
    			alert("Something went wrong")
    		}


    	})




    }



    //useEffect() has 2 arguments:
    	//function - represents the side effect you want to perform. This will be executed when the component renders.
    	//dependency - optional array. The effect will run when there are changes in the component's dependencies. When there is no provided array, the effect will run on every render of the component.

    useEffect(()=>{

    	if((firstName !== "" && lastName !== "" && email !== "" && mobileNo !== "" && password !=="" && confirmPassword !=="") && (password === confirmPassword) && (mobileNo.length === 11)){

    		setIsActive(true)

    	}else{
    		setIsActive(false)
    	}

    },[firstName, lastName, email, mobileNo, password, confirmPassword])

    console.log("token",user.token)
    console.log("access",user.access)
    console.log("email", user.email)

	return (

		(user.id !== null)?
		<Navigate to="/courses" />
		:
		<Form onSubmit={(e)=>registerUser(e)}>
			<h1 className="my-5 text-center">Register</h1>
			<Form.Group>
				<Form.Label>First Name:</Form.Label>
				<Form.Control
					type="text"
					placeholder="Enter First Name"
					required
					value={firstName}
					onChange={e=>{setFirstName(e.target.value)}}
				/>
			</Form.Group>
			<Form.Group>
				<Form.Label>Last Name:</Form.Label>
				<Form.Control
					type="text"
					placeholder="Enter Last Name"
					required
					value={lastName}
					onChange={e=>{setLastName(e.target.value)}}
				/>
			</Form.Group>
			<Form.Group>
				<Form.Label>Email:</Form.Label>
				<Form.Control
					type="email"
					placeholder="Enter Email"
					required
					value={email}
					onChange={e=>{setEmail(e.target.value)}}
				/>
			</Form.Group>
			<Form.Group>
				<Form.Label>Mobile No:</Form.Label>
				<Form.Control
					type="number"
					placeholder="Enter 11 Digit No."
					required
					value={mobileNo}
					onChange={e=>{setMobileNo(e.target.value)}}
				/>
			</Form.Group>
			<Form.Group>
				<Form.Label>Password:</Form.Label>
				<Form.Control
					type="password"
					placeholder="Enter Password"
					required
					value={password}
					onChange={e=>{setPassword(e.target.value)}}
				/>
			</Form.Group>
			<Form.Group>
				<Form.Label>Confirm Password:</Form.Label>
				<Form.Control
					type="password"
					placeholder="Confirm Password"
					required
					value={confirmPassword}
					onChange={e=>{setConfirmPassword(e.target.value)}}
				/>
			</Form.Group>

			{/*conditionally render submit button based on the isActive state*/}
			{isActive ?
				<Button variant="primary" type="submit" id="submitBtn">Submit</Button>
				:
				<Button variant="danger" type="submit" id="submitBtn" disabled>Submit</Button>
			}
			

			{/*
				- Whenever an event is triggered in React JS, an event object is created and can be used to retrieve information regarding the triggered event and gain access to methods that would help in development
				- Whenever a state of a component changes, the component rerenders the whole component executing any code found in the component. This is the reason why every individual input added to a form input prints out a console message.
				- The "e.target.value" property allows us to gain access the the input field's current value to be used when submitting form data.

			*/}
		</Form>
	)
}

