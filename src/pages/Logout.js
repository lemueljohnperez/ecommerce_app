import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../UserContext';


export default function Logout() {

	//consume the UserContext obj and destructured it to access the user state and unsetUser function from the context provider

	const { unsetUser, setUser } = useContext(UserContext);

	//Clear the localStorage of the user's info
	unsetUser();

	useEffect(() => {
		
		setUser({
			id: null,
			isAdmin: null
		})

	}, [])

	//Redirect back to login
	return (
		<Navigate to='/login'/>
	)
}