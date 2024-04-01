import { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function ProductCard({ productProp }) {

    const { _id, name, description, price } = productProp;

    const imageSrc = `../images/${name}.png`;

    return (
        <Card className="mt-3 col-2 m-2">
            <Card.Body>
                <Card.Img className="productImageCard mb-3" variant="top" src={imageSrc} alt={name}/>
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