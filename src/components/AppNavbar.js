import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink, useLocation } from 'react-router-dom';
import UserContext from '../UserContext';

export default function AppNavbar() {

    const { user } = useContext(UserContext);
    const location = useLocation();

    return (
        <Navbar bg="light" expand="lg" fixed="top">
            <Container fluid>
                <Navbar.Brand as={NavLink} to="/">UrbanEdge</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link as={NavLink} to="/" exact={true} isActive={() => location.pathname === '/'}>Home</Nav.Link>
                        <Nav.Link as={NavLink} to="/products" exact={true}>Products</Nav.Link>

                        {(user.id !== null) ? 
                            user.isAdmin ?
                                <>
                                    <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
                                </>
                                :
                                <>
                                    <Nav.Link as={NavLink} to="/cart">Cart</Nav.Link>
                                    <Nav.Link as={NavLink} to="/order">My Orders</Nav.Link>
                                    <Nav.Link as={NavLink} to="/profile">Profile</Nav.Link>
                                    <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
                                </>
                            : 
                            <>
                                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
                            </>
                        }  
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
