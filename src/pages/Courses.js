import { useEffect, useState, useContext } from 'react';
// import CourseCard from '../components/CourseCard';
import UserView from '../components/UserView';
import AdminView from '../components/AdminView';
import UserContext from '../UserContext';

export default function Courses(){

	const { user } = useContext(UserContext);
	const [courses, setCourses] = useState([])

	useEffect(()=>{
		fetch(`${process.env.REACT_APP_API_URL}/courses/all`)
		.then(res=>res.json())
		.then(data=>{
			console.log(data.courses)
			const coursedata = data.courses
			setCourses(coursedata)
			//setCourses(data)
		})
	},[]);


	const fetchData = () =>{

		fetch(`${process.env.REACT_APP_API_URL}/courses/all`)
		.then(res => res.json())
		.then(data =>{
			console.log(data);
			setCourses(data.courses);
		})
	}

	useEffect(()=>{

		fetchData();

	},[])




		return(
            <>
                {
                    (user.isAdmin === true) ?
                    //Pass the fetch Data as a prop
                        <AdminView coursesData={courses} fetchData={fetchData} />
                        :
                        <UserView coursesData={courses} />
                }
            </>
        )
}