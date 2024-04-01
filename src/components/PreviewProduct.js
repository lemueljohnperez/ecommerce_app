import { Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function PreviewProduct(props) {

	const {breakPoint, data} = props

	const {_id, name, description, price} = data

	const imageSrc = `./images/${name}.png`;

	return (
		<Col xs={12} md={breakPoint}>

			<Card className="cardHighlight featuredProduct">
				<Card.Body>
					<Card.Img className="mb-3" variant="top" src={imageSrc} alt=""/>
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