import { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function ProductCard({ productProp }) {

    const { _id, name, description, price } = productProp;

    const imageSrc = `../images/${name}.png`;

    return (
        <Card className="mt-3 col-md-3 col-lg-2 m-2">
            <Card.Body className="d-flex flex-column align-items-center">
                <Card.Img className="productImageCard mb-3" variant="top" src={imageSrc} alt={name}/>
                <Card.Title className="text-center">{name}</Card.Title>
                <Card.Text className="text-justify">{description}</Card.Text>
            </Card.Body>

            <Card.Footer className="text-center">
                <h5>₱ {price.toFixed(2)}</h5>

                <Link className="detailsButton" to={`/products/${_id}`}>Details</Link>
            </Card.Footer>
        </Card>
    );
}