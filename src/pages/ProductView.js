import { useState, useEffect, useContext } from 'react';
import { Container, Card, Button, Row, Col, Form } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function ProductView() {

    const { user } = useContext(UserContext);
    const { productId } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1); // Default quantity is 1

    const handleQuantityChange = (event) => {
        setQuantity(parseInt(event.target.value)); // Convert value to integer
    };

    const addToCart = () => {
        fetch(`${process.env.REACT_APP_API_URL}/cart/add-to-cart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                productId: productId,
                quantity: quantity // Use the selected quantity
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.message) {
                    Swal.fire({
                        title: "Success",
                        icon: 'success',
                        text: data.message
                    });
                    navigate("/products");
                }

                else if (data.updatedCart) {
                    Swal.fire({
                        title: "Success",
                        icon: 'success',
                        text: `successfully added product to cart`
                    });
                    navigate("/products");
                    console.log("Updated Cart:", data.updatedCart);
                    // You can use the updatedCart data as needed in your application
                }

                else {
                    // Handle other scenarios if needed
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    title: "Error",
                    icon: "error",
                    text: "Failed to add the product to the cart."
                });
            });
    }

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setName(data.product.name);
                setDescription(data.product.description);
                setPrice(data.product.price);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [productId]);

    return (
        <Container className="mt-5 pt-5">
            <Row>
                <Col lg={{ span: 6, offset: 3 }}>
                    <Card>
                        <Card.Body>
                            <Card.Title>{name}</Card.Title>
                            <Card.Subtitle>Description:</Card.Subtitle>
                            <Card.Text>{description}</Card.Text>
                            <Card.Subtitle>Price:</Card.Subtitle>
                            <Card.Text>PhP {price}</Card.Text>
                            <Form.Group controlId="quantity">
                                <Form.Label>Quantity:</Form.Label>
                                <Form.Control type="number" min="1" value={quantity} onChange={handleQuantityChange} />
                            </Form.Group>
                            {user.id !== null ?
                                <Button variant="primary" onClick={addToCart}>Add to Cart</Button>
                                :
                                <Link className="btn btn-danger btn-block" to="/login">Log in to add to cart</Link>
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}