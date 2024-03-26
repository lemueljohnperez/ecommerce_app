import { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function CourseCard({ courseProp }) {
    // if (!courseProp || Object.keys(courseProp).length === 0) {
    //     return null; // Render nothing if courseProp is empty or undefined
    // }

    // const { id, name, description, price } = courseProp ?? {};

    // Deconstruct the course properties into their own variables
    const { _id, name, description, price } = courseProp;

    //State Hook
    // Use the state hook for this component to be able to store its state
    // States are used to keep track of information related to individual components
    //Syntax
        //const [getter, setter] = useState(initialValueofGetter)
    // const [count, setCount] = useState(0);
    // Using the state hook returns an array with the first element being a value and the second element as a function that's used to change the value of the first element
    //const [seats, setSeats] = useState(10);
    //console.log(useState(0));

    // Function that keeps track of the enrollees for a course
    // By default JavaScript is synchronous it executes code from the top of the file all the way to the bottom and will wait for the completion of one expression before it proceeds to the next
    // The setter function for useStates are asynchronous allowing it to execute separately from other codes in the program
    // The "setCount" function is being executed while the "console.log" is already completed resulting in the value to be displayed in the console to be behind by one count
    
    // function enroll(){

    //     if(seats > 0){
    //          setCount(count+1);
    //         console.log("Enrollees: " + count);
    //         setSeats(seats-1);
    //         console.log('Seats: '+ seats)
    //     }else{
    //         alert("No more available seats")
    //     }
       

    // }

    return (
        <Card className="mt-3">
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Subtitle>Description:</Card.Subtitle>
                <Card.Text>{description}</Card.Text>
                <Card.Subtitle>Price:</Card.Subtitle>
                <Card.Text>PhP{price}</Card.Text>
                {/*<Card.Text>Enrollees:{count}</Card.Text>
                <Card.Text>Seats: {seats}</Card.Text>*/}
                {/*<Button variant="primary" onClick={enroll}>Enroll</Button>*/}

                <Link className="btn btn-primary" to={`/courses/${_id}`}>Details</Link>

            </Card.Body>
        </Card>
    );
}

// export default function CourseCard({courseProp}) {

//     const { id, name, description, price } = courseProp ?? {};

//         return (

//             <Card className="mt-3">
//                 <Card.Body>
//                     <Card.Title>{id}</Card.Title>
//                     <Card.Title>{name}</Card.Title>
//                     <Card.Subtitle>Description:</Card.Subtitle>
//                     <Card.Text>{description}</Card.Text>
//                     <Card.Subtitle>Price:</Card.Subtitle>
//                     <Card.Text>PhP{price}</Card.Text>
//                     <Button variant="primary">Enroll</Button>
//                 </Card.Body>
//             </Card>
//         );
// }