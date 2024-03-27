import { useState, useEffect, useContext } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function ProductView() {

	const {user} = useContext(UserContext);

	const { productId } = useParams();

	const navigate = useNavigate()


	const [name, setName] = useState("");
	const [description, setDescription] = useState("")
	const [price, setPrice] = useState(0);


	const enroll = (productId) => {

		fetch(`${process.env.REACT_APP_API_URL}/users/enroll`, {
			method:"POST",
			headers:{
				"Content-Type":"application/json",
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				enrolledCourses: [{productId}],
				totalPrice: price
			})
		})
		.then(res => res.json())
		.then(data => {
			
			console.log(data.message);

            if (data.error === 'Admin is forbidden') {
                Swal.fire({
                    title: "Admin enrollment error",
                    icon: 'error',
                    text: "You are an administrator you may not enroll to a course."
                });

            }

            else if (data.message === 'Successfully Enrolled') {
                Swal.fire({
                    title: "Successfully enrolled",
                    icon: 'success',
                    text: "You have successfully enrolled for this course."
                });

                // The "navigate" method allows us to redirect the user to a different page and is an easier approach rather than using the "Navigate" component
                navigate("/products");
            }

            else {
                Swal.fire({
                    title: "Something went wrong",
                    icon: "error",
                    text: "Please try again."
                });
            }
		})
	}


	useEffect(() => {
		console.log(productId);

		fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`)
		.then(res => res.json())
		.then(data => {

			console.log(data);

			setName(data.product.name);
			setDescription(data.product.description);
			setPrice(data.product.price);

		})

	}, [productId])


	return (
		<Container className="mt-5">
			<Row>
				<Col lg={{ span: 6, offset: 3 }}>
					<Card>
						<Card.Body>
							<Card.Title>{name}</Card.Title>
							<Card.Subtitle>Description:</Card.Subtitle>
							<Card.Text>{description}</Card.Text>
							<Card.Subtitle>Price:</Card.Subtitle>
							<Card.Text>PhP {price}</Card.Text>

							{user.id !== null ?
								<Button variant="primary" onClick={() => enroll(productId)}>Enroll</Button>
								:
								<Link className = "btn btn-danger btn-block" to="/login">Log in to Buy</Link>
							}
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}