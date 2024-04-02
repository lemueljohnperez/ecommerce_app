import React, { useState, useEffect } from 'react';
import { Accordion, Card, Container, Row, Col } from 'react-bootstrap';

export default function OrderPage() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState({});

    useEffect(() => {
        const fetchOrders = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not found');
                return;
            }

            fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/my-orders`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                return response.json();
            })
            .then(data => {
                setOrders(data.orders);
                fetchProductsDetails(data.orders);
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
            });
        };

        const fetchProductsDetails = (ordersData) => {
            const productIds = ordersData.flatMap(order => order.productsOrdered.map(product => product.productId));
            fetch(`${process.env.REACT_APP_API_BASE_URL}/products?ids=${productIds.join(',')}`)
                .then(res => res.json())
                .then(data => {
                    const productsData = data.products;
                    const productsMap = productsData.reduce((map, product) => {
                        map[product._id] = product;
                        return map;
                    }, {});
                    setProducts(productsMap);
                })
                .catch(error => {
                    console.error('Error fetching product details:', error);
                });
        };

        fetchOrders();
    }, []);

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={8}>
                    <h1 className='my-5 pt-5 text-center'>My Orders</h1>
                    <Accordion>
                        {orders.map((order, index) => (
                            <Card key={order._id} className="mb-3">
                                <Accordion.Toggle as={Card.Header} eventKey={order._id} className="bg-dark text-white">
                                    Order #{index + 1} - Purchased On: {new Date(order.orderedOn).toLocaleDateString()} (Click for details)
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey={order._id} className="ml-2">
                                    <Card.Body>
                                        <h5>Items:</h5>
                                        <ul className="ml-3">
                                            {order.productsOrdered.map(product => (
                                                <li key={product._id}>
                                                    {products[product.productId]?.name} - Quantity: {product.quantity}
                                                </li>
                                            ))}
                                        </ul>
                                        <p>Total: PHP {order.totalPrice.toFixed(2)}</p>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        ))}
                    </Accordion>
                </Col>
            </Row>
        </Container>
    );
};