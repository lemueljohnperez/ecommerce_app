import { Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import product from '../images/product.png';

export default function PreviewProduct(props) {

	const {breakPoint, data} = props

	const {_id, name, description, price} = data


	return (
		<Col xs={12} md={breakPoint}>

			<Card className="cardHighlight featuredProduct">
				<Card.Body>
					<Card.Img className="mb-3" variant="top" src={product}/>
					<Card.Title className="text-center">
						<Card.Text>{name}</Card.Text>
					</Card.Title>
					<Card.Text className="text-justify">{description}</Card.Text>
				</Card.Body>
				<Card.Footer>
					<h5 className="text-center">₱ {price.toFixed(2)}</h5>
					<Link className="detailsButton d-block text-center" to={`/products/${_id}`}>Details</Link>
				</Card.Footer>
			</Card>

		</Col>
	)
}