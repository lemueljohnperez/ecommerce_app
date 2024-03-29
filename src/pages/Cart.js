import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function Cart() {
    const [cart, setCart] = useState({ cartItems: [], totalPrice: 0 });

    const fetchProductsDetails = (cartItems) => {
        const promises = cartItems.map(item =>
            fetch(`${process.env.REACT_APP_API_URL}/products/${item.productId}`)
                .then(res => res.json())
        );

        Promise.all(promises)
            .then(products => {
                const updatedCartItems = cartItems.map((item, index) => ({
                    ...item,
                    name: products[index].name,
                    price: products[index].price,
                }));
                setCart(prevCart => ({
                    ...prevCart,
                    cartItems: updatedCartItems,
                }));
            })
            .catch(error => {
                console.error('Error fetching product details:', error);
            });
    };

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/cart/get-cart`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log("Data received from API:", data);
                if (data.userCart && data.userCart.length > 0) {
                    setCart(data.userCart[0]);
                    fetchProductsDetails(data.userCart[0].cartItems);
                } else {
                    console.error("Data structure from API is invalid:", data);
                    setCart(null);
                }
            })
            .catch(error => {
                console.error('Error fetching cart data:', error);
            });
    }, []);


    const checkout = (e) => {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_API_URL}/orders/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(() => {
                Swal.fire({
                    title: 'Checkout Successful!',
                    icon: 'success',
                    text: 'Your order has been created successfully'
                });
                setCart({ cartItems: [], totalPrice: 0 });
            })
            .catch(error => {
                console.error('Error during checkout:', error);
                Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'An error occurred during checkout. Please try again later.'
                });
            });
    };

    return (
        <div>
            <h2 className="my-5 pt-5">Shopping Cart</h2>
            {cart && cart.cartItems && cart.cartItems.length > 0 ? (
                <React.Fragment>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Product Id</th>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.cartItems.map(item => (
                                <tr key={item.productId}>
                                    <td>{item.productId}</td>
                                    <td>{item.name}</td>
                                    <td>PHP {item.price}</td>
                                    <td>{item.quantity}</td>
                                    <td>PHP {item.subtotal}</td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="4">Total:</td>
                                <td>PHP {cart.totalPrice}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <Button onClick={checkout}>Checkout</Button>
                </React.Fragment>
            ) : (
                <p className="my-5 pt-5">Cart is empty!</p>
            )}
        </div>
    );
}
