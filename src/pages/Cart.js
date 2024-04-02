import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Cart(props) {
    const navigate = useNavigate();
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
                    price: product ? product.price : 0,
                    imageSrc: product ? `./images/${product.name}.png` : null // Add image source
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
            // Filter out the removed item from the cart items
            const updatedCartItems = cart.cartItems.filter(item => item.productId !== productId);

            // Recalculate total price
            const updatedTotalPrice = calculateTotal(updatedCartItems);

            // Update the cart with the updated cart items and total price
            setCart({
                ...cart,
                cartItems: updatedCartItems,
                totalPrice: updatedTotalPrice
            });
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

    const updateQuantity = (productId, quantity) => {
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
            // Fetch updated product details including name and price
            fetchProductsDetails(data.updatedCart.cartItems);

            // Recalculate total price
            const updatedTotalPrice = calculateTotal(data.updatedCart.cartItems);
            setCart(prevCart => ({
                ...prevCart,
                cartItems: data.updatedCart.cartItems,
                totalPrice: updatedTotalPrice
            }));
        })
        .catch(error => {
            console.error('Error updating item quantity:', error);
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'An error occurred while updating item quantity. Please try again later.'
            });
        });
    };

    const increaseQuantity = (productId) => {
        updateQuantity(productId, 1);
    };

    const decreaseQuantity = (productId) => {
        updateQuantity(productId, -1);
    };

    const calculateTotal = (cartItems) => {
        return cartItems.reduce((total, item) => total + item.subtotal, 0);
    };

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
            navigate("/order");
        })
        .then(() => {
            Swal.fire({
                title: 'Checkout Successful!',
                icon: 'success',
                text: 'Your order has been created successfully'
            });
            setCart({ cartItems: [], totalPrice: 0 });
            navigate("/order");
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

    const clearCart = () => {
        fetch(`${process.env.REACT_APP_API_URL}/cart/clear-cart`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(res => res.json())
        .then(data => {
            setCart({ cartItems: [], totalPrice: 0 });
            Swal.fire({
                title: 'Success',
                icon: 'success',
                text: 'Cart cleared successfully.'
            });
        })
        .catch(error => {
            console.error('Error clearing cart:', error);
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'An error occurred while clearing the cart. Please try again later.'
            });
        });
    };

    return (
        <div className="container">
            <h2 className="my-5 pt-5">Shopping Cart</h2>
            {cart && cart.cartItems && cart.cartItems.length > 0 ? (
                <div>
                    {cart.cartItems.map(item => (
                        <div key={item.productId} className="item-row card mb-3">
                            <div className="card-body d-flex">
                                {item.imageSrc && (
                                    <img className="productImageCard mb-3 mr-3" src={item.imageSrc} alt={item.name} style={{ width: '250px', height: '250px' }} />
                                )}
                                <div>
                                    <h5 className="card-title">Product ID: {item.productId}</h5>
                                    <p className="card-text"><strong>Product Name:</strong> {item.name}</p>
                                    <p className="card-text"><strong>Price:</strong> ₱ {item.price}</p>
                                    <div className="d-flex align-items-center mb-3">
                                        <Button size="sm" variant="outline-dark" onClick={() => decreaseQuantity(item.productId)}>-</Button>
                                        <span className="mx-2">{item.quantity}</span>
                                        <Button size="sm" variant="outline-dark" onClick={() => increaseQuantity(item.productId)}>+</Button>
                                    </div>
                                    <p className="card-text"><strong>Subtotal:</strong> ₱ {item.subtotal.toFixed(2)}</p>
                                    <Button variant="danger" onClick={() => removeItem(item.productId)}>Remove</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="total-row d-flex justify-content-between border-top pt-3 mt-3">
                        <div><strong>Total:</strong> ₱ {cart.totalPrice.toFixed(2)}</div>
                    </div>
                    <div className="actions my-4">
                        <Button variant="success" onClick={checkout} className="mr-4">Checkout</Button>
                        <Button variant="danger" onClick={clearCart}>Clear Cart</Button>
                    </div>
                </div>
            ) : (
                <div>
                    <p className="my-5 pt-5">Cart is empty.</p>
                    <Link className="btn btn-primary" to={"/products"}>Products</Link>
                </div>
            )}
        </div>
    );
}