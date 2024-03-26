import { useState, useEffect } from 'react';
import { UserProvider } from './UserContext';
//Bootstrap
import { Container } from 'react-bootstrap';

//Route Components
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';

// Components
import AppNavbar from './components/AppNavbar';

//Pages
import Register from './pages/Register';
import Login from './pages/Login';
import Error from './pages/Error';

//CSS
import './App.css';

function App() {

    const [user, setUser] = useState({
        id: null,
        isAdmin: null 
    })

    const unsetUser = () =>{
        localStorage.clear()
    }

    useEffect(()=>{
        fetch(`http://localhost:4000/users`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(typeof data.user !== "undefined"){
                setUser({
                    id: data.user._id,
                    isAdmin: data.user.isAdmin
                })
            }
            else{
                setUser({
                    id: null,
                    isAdmin: null
                })
            }
        })
    },[])

    return (
        <UserProvider value={{user, setUser, unsetUser}}>
            <Router>
                <AppNavbar />
                <Container fluid>
                    <Routes>
                        <Route path="/register" element={<Register/>} />
                        <Route path="/login" element={<Login/>}/>
                        <Route path="*" element={<Error />}/>
                    </Routes>
                </Container>
            </Router>
        </UserProvider>
    );
}

export default App;
