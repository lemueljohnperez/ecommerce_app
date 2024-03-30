import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import bannerImage from '../images/home_bg.png';

export default function Banner({data}) {

	console.log(data);
    const {title, content, destination, label} = data;

	return (
		<Row>
			<Col className = "my-5 p-5 text-center bannerTitle">
				<h1>{title}</h1>
				<p className="bannerContent">{content}</p>
				<Link className="bannerButton" to={destination}>{label}</Link>
				<img src={bannerImage} alt="" className="banner-image mt-5" />
			</Col>
		</Row>
	)
}