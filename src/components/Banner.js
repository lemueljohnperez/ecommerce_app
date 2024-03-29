import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import bannerImage from '../images/home_bg.png';

export default function Banner({data}) {

	console.log(data);
    const {title, content, destination, label} = data;

	return (
		<Row>
			<Col className = "my-5 p-5 text-center title">
				<h1>{title}</h1>
				<p className="banner">{content}</p>
				<Link className="homeButton" to={destination}>{label}</Link>
				<img src={bannerImage} alt="" className="banner-image mt-5" />
			</Col>
		</Row>
	)
}