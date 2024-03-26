import { useState, useEffect } from 'react';
import { CardGroup } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
import PreviewCourse from './PreviewCourse';

export default function FeaturedCourses(){

	const [preview, setPreview] = useState([]);

	useEffect(()=>{

		fetch(`${process.env.REACT_APP_API_URL}/courses/`)
		.then(res=>res.json())
		.then(data=>{
			console.log(data)

			console.log(data.courses)


			//Added two empty arrays to be used to store random numbers and featured courses data
			const numbers = [];
			const featured = [];

			//This function generates a random number between 0 and the length of the data array (fetched course data from the server)
			//This will check if the random number has already been added to the numbers array
			//If not, it recursively calls itself to generate a new number


			const generateRandomNums = () =>{

				let randomNum = Math.floor(Math.random() * data.courses.length)

				if(numbers.indexOf(randomNum) === -1){
					numbers.push(randomNum)
				}else{
					generateRandomNums()
				}
			}

			//a loop is used to iterate five times (from 0 to 4)
				//Inside the loop, the generateRandomNums Function is called to generate a random number and push it into the numbers array
			for(let i = 0; i<5; i++){
				generateRandomNums()

				featured.push(	
					// This jsx will be pushed into the featured array
					<PreviewCourse key={data.courses[numbers[i]]._id} data={data.courses[numbers[i]]}  breakPoint={2}/>
				)

			}

			//For each iteration of the loop, the PreviewcCourse component is rendered with the course data from the data array based on the random number
				//The key prop is set to _id of the course 

			setPreview(featured)



		})


	},[])


	return(

			<>
				<h2 className="text-center">Featured Courses</h2>
				<CardGroup className="justify-content-center">

					{preview}

				</CardGroup>
			</>


		)

}