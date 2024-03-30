import { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function ProductCard({ productProp }) {

    const { _id, name, description, price } = productProp;

    return (
        <Card className="mt-3">
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Subtitle>Description:</Card.Subtitle>
                <Card.Text>{description}</Card.Text>
                <Card.Subtitle>Price:</Card.Subtitle>
                <Card.Text>₱ {price.toFixed(2)}</Card.Text>

                <Link className="detailsButton" to={`/products/${_id}`}>Details</Link>
            </Card.Body>
        </Card>
    );
}