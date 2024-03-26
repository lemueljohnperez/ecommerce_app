import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';



export default function EditCourse({course, fetchData}){
	//States
	const [courseId, setCourseId] = useState('');
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [showEdit, setShowEdit] = useState(false);

	//Function for opening the modal

	const openEdit = (courseId) =>{

		fetch(`${process.env.REACT_APP_API_URL}/courses/${courseId}`)
		.then(res=>res.json())
		.then(data=>{

			console.log(data);
			console.log(data.course)
			console.log(data.course._id);
			console.log(data.course.name)

			//populate all the input values with the course info that we fetched

			setCourseId(data.course._id);
			setName(data.course.name);
			setDescription(data.course.description);
			setPrice(data.course.price);
		})
		//Then, open the modal
		setShowEdit(true)

	}

	const closeEdit = () =>{

		setShowEdit(false);
		setName('');
		setDescription('');
		setPrice('');

	}

	//function to update the course
	const editCourse = (e, courseId) =>{

		e.preventDefault();

		fetch(`http://localhost:4000/courses/${ courseId }`, {
	        method: 'PATCH',
	        headers: {
	            'Content-Type': 'application/json',
	            Authorization: `Bearer ${localStorage.getItem('token')}`
	        },
	        body: JSON.stringify({
	            name: name,
	            description: description,
	            price: price
	        })
	    })
	    .then(res => res.json())
	    .then(data => {
	        console.log(data)

	        if(data.message === "Course updated successfully") {
	            Swal.fire({
	                title: 'Success!',
	                icon: 'success',
	                text: 'Course Successfully Updated'
	            })
	            closeEdit();
	            fetchData();
	            
	        } else {
	            Swal.fire({
	                title: 'Error!',
	                icon: 'error',
	                text: 'Please try again'
	            })
	            closeEdit();
	            fetchData();
	            
	        }
	    })
	}



	return(

		<>
			<Button variant = "primary" size="sm" onClick={()=>openEdit(course)}>Edit</Button>


			{/*Edit Modal*/}

			<Modal show={showEdit} onHide={closeEdit}>
				<Form onSubmit={e => editCourse(e, courseId)}>
					<Modal.Header closeButton>
						<Modal.Title>Edit Course</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group controlId="courseName">
							<Form.Label>Name</Form.Label>
							<Form.Control
							type="text"
							value={name}
							onChange={e=>setName(e.target.value)}
							required/>
						</Form.Group>
						<Form.Group controlId="courseDescription">
							<Form.Label>Description</Form.Label>
							<Form.Control
							type="text"
							value={description}
							onChange={e=>setDescription(e.target.value)}
							required/>
						</Form.Group>
						<Form.Group controlId="coursePrice">
							<Form.Label>Price</Form.Label>
							<Form.Control
							type="text" 
							value={price}
							onChange={e=>setPrice(e.target.value)}
							required/>
						</Form.Group>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={closeEdit}>Close</Button>
						<Button variant="success" type="submit">Submit</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</>
		)

}