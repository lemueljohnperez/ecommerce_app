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

    const imageSrc = `../images/${name}.png`;

    const handleQuantityChange = (event) => {
        setQuantity(parseInt(event.target.value)); // Convert value to integer
    };

    const addToCart = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/add-to-cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                productId: productId,
                quantity: quantity
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            Swal.fire({
                title: 'Success',
                icon: 'success',
                text: 'Item added to cart successfully.'
            });
            navigate("/products");
        })
        .catch(error => {
            console.error('Error adding item to cart:', error);
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'An error occurred while adding item to cart. Please try again later.'
            });
        });
    };

    const handleCheckout = () => {
        navigate("/cart");
    };

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`)
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
                            <Card.Img variant="top" src={imageSrc} alt=""/>
                            <Card.Title>{name}</Card.Title>
                            <Card.Subtitle>Description:</Card.Subtitle>
                            <Card.Text className="text-justify">{description}</Card.Text>
                            <Card.Subtitle>Price:</Card.Subtitle>
                            <Card.Text>₱ {price.toFixed(2)}</Card.Text>
                            {user.isAdmin ? (
                                <Button variant="danger" disabled>Add to Cart</Button>
                            ) : (
                                <Form.Group controlId="quantity">
                                    <Form.Label>Quantity:</Form.Label>
                                    <Form.Control type="number" min="1" value={quantity} onChange={handleQuantityChange} />
                                </Form.Group>
                            )}
                            {!user.isAdmin && user.id ? (
                                <>
                                    <div className="d-flex flex-column justify-content-between ml-2">
                                        <Button variant="success" onClick={handleCheckout} className="d-block mb-2">Checkout</Button>
                                        <Button variant="primary" onClick={addToCart} className="d-block">Add to Cart</Button>
                                    </div>
                                </>
                            ) : user.id === null ? (
                                <Link className="btn btn-danger btn-block mt-3" to="/login">Login to Add to Cart</Link>
                            ) : null}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}