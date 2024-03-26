import {useEffect, useState} from 'react';
// import coursesData from '../data/coursesData.js';
import CourseCard from '../components/CourseCard';


export default function Courses(){

	const [courses, setCourses] = useState([])

	useEffect(()=>{

		fetch(`${process.env.REACT_APP_API_URL}/courses/`)
		.then(res=>res.json())
		.then(data=>{
			console.log(data);
			console.log(typeof data)
			console.log(data.courses)
			setCourses(data.courses.map(course=>{
					return(
						<CourseCard key={course._id} courseProp={course}/>
					)
				}));
		});
	},[]);


	// console.log(coursesData);
	// console.log(coursesData[0])
	// console.log(coursesData[0].name)

	// return(
	// 	<>
	// 		<h1>Courses</h1>
	// 		<CourseCard courseProp={coursesData[0]}/>
	// 	</>
	// )

	//The courseProp in the CourseCard component is called a prop which is a shorthand for "property" since components are considered as objects in React JS
	//The curly braces ({}) are used for props to signify that we are providing information using JavaScript expressions rather than hard coded values which use double quotes ("")
	//We can pass information from one component to another using props. This is referred to as "props drilling"

		/*const courses = coursesData.map(course => {
			//The "map" method loops through the individual course objects in our array and returns a component for each course
			return (
					//Multiple components created through the map method must have a unique key that will help React JS identify which components/elements have been changed, added or removed
					<CourseCard key={course.id} courseProp={course}/>
					//Everytime the map method loops through the data, it creates a "CourseCard" component and then passes the current element in our coursesData array using the courseProp
			)
		})*/

		return (
			<>
				<h1>Courses</h1>
				{courses}
			</>
		)
}