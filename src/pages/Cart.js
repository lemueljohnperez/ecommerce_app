import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Cart() {
    const [cart, setCart] = useState({ cartItems: [], totalPrice: 0 });

    const fetchProductsDetails = (cartItems) => {
        const productIds = cartItems.map(item => item.productId);
        fetch(`${process.env.REACT_APP_API_URL}/products?ids=${productIds.join(',')}`)
            .then(res => res.json())
            .then(data => {
                const products = data.products;
                const updatedCartItems = cartItems.map(item => {
                    const product = products.find(prod => prod._id === item.productId);
                    return {
                        ...item,
                        name: product ? product.name : 'Product Name Not Available',
                        price: product ? product.price : 0
                    };
                });
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

    const removeItem = (productId) => {
        fetch(`${process.env.REACT_APP_API_URL}/cart/${productId}/remove-from-cart`, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => {
                Swal.fire({
                    title: 'Success',
                    icon: 'success',
                    text: 'Successfully removed item from the cart.'
                })
                setCart(data.updatedCart);
            })
            .catch(error => {
                console.error('Error removing item from cart:', error);
                Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'An error occurred while removing item from cart. Please try again later.'
                });
            });
    };

    const increaseQuantity = (productId) => {
        const updatedCartItems = cart.cartItems.map(item => {
            if (item.productId === productId) {
                const updatedQuantity = item.quantity + 1;
                const updatedSubtotal = updatedQuantity * item.price;
                return {
                    ...item,
                    quantity: updatedQuantity,
                    subtotal: updatedSubtotal
                };
            }
            return item;
        });
        setCart(prevCart => ({
            ...prevCart,
            cartItems: updatedCartItems,
            totalPrice: calculateTotal(updatedCartItems)
        }));
    };

    const decreaseQuantity = (productId) => {
        const updatedCartItems = cart.cartItems.map(item => {
            if (item.productId === productId && item.quantity > 1) {
                const updatedQuantity = item.quantity - 1;
                const updatedSubtotal = updatedQuantity * item.price;
                return {
                    ...item,
                    quantity: updatedQuantity,
                    subtotal: updatedSubtotal
                };
            }
            return item;
        });
        setCart(prevCart => ({
            ...prevCart,
            cartItems: updatedCartItems,
            totalPrice: calculateTotal(updatedCartItems)
        }));
    };

    const calculateTotal = (cartItems) => {
        return cartItems.reduce((total, item) => total + item.subtotal, 0);
    };

    const updateCartQuantity = (productId, quantity) => {
        fetch(`${process.env.REACT_APP_API_URL}/cart/update-cart-quantity`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                productId,
                quantity
            })
        })
            .then(res => res.json())
            .then(data => {
                setCart(data.updatedCart);
            })
            .catch(error => {
                console.error('Error updating cart quantity:', error);
                Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'An error occurred while updating cart quantity. Please try again later.'
                });
            });
    };

    const checkout = (e) => {
        e.preventDefault();
        // Add checkout logic
    };

    return (
        <div>
            <h2 className="my-5 pt-5">Shopping Cart</h2>
            {cart && cart.cartItems && cart.cartItems.length > 0 ? (
                <React.Fragment>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Product ID</th>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.cartItems.map(item => (
                                <tr key={item.productId}>
                                    <td>{item.productId}</td>
                                    <td>{item.name}</td>
                                    <td>PHP {item.price}</td>
                                    <td>
                                        <Button size="sm" variant="outline-dark" onClick={() => decreaseQuantity(item.productId)}>-</Button>
                                        <span style={{ margin: '0 5px' }}>{item.quantity}</span>
                                        <Button size="sm" variant="outline-dark" onClick={() => increaseQuantity(item.productId)}>+</Button>
                                    </td>
                                    <td>PHP {item.subtotal}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => removeItem(item.productId)}>Remove</Button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="5">Total:</td>
                                <td>PHP {cart.totalPrice}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <Button onClick={checkout}>Checkout</Button>
                </React.Fragment>
            ) : (
                <>
                    <div>
                        <p className="my-5 pt-5">Cart is empty.</p>
                        <Link className="btn btn-primary" to={"/products"}>Products</Link>
                    </div>
                </>
            )}
        </div>
    );
}