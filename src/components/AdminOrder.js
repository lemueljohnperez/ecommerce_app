import React, { useState, useEffect } from 'react';
import { Accordion, Card, Container, Row, Col } from 'react-bootstrap';

export default function OrderPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/all-orders`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            return response.json();
        })
        .then(data => {
            // Group orders by user ID
            const groupedOrders = groupOrdersByUserId(data.orders);
            setOrders(groupedOrders);
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
        });
    };

    // Function to group orders by user ID
    const groupOrdersByUserId = (orders) => {
        const groupedOrders = {};
        orders.forEach(order => {
            if (!groupedOrders[order.userId]) {
                groupedOrders[order.userId] = [];
            }
            groupedOrders[order.userId].push(order);
        });
        return groupedOrders;
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={8}>
                    <h1 className='my-5 pt-5 text-center'>All Orders</h1>
                    <Accordion>
                        {Object.keys(orders).map(userId => (
                            <Card key={userId} className="mb-3">
                                <Accordion.Toggle as={Card.Header} eventKey={userId} className="bg-dark text-white">
                                    Orders for User ID: {userId} (Click for details)
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey={userId} className="ml-2">
                                    <Card.Body>
                                        {orders[userId].map(order => (
                                            <div key={order._id} className="mb-3">
                                                <p>Order ID: {order._id}</p>
                                                <p>Total Price: ₱ {order.totalPrice.toFixed(2)}</p>
                                                <p>Ordered On: {new Date(order.orderedOn).toLocaleString()}</p>
                                                <p>Status: {order.status}</p>
                                                <hr />
                                            </div>
                                        ))}
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