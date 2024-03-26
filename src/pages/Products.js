import { useEffect, useState, useContext } from 'react';
import UserView from '../components/UserView';
import AdminView from '../components/AdminView';
import UserContext from '../UserContext';

export default function Products() {

	const { user } = useContext(UserContext);
	const [products, setProducts] = useState([])

	useEffect(()=>{
		fetch(`${process.env.REACT_APP_API_URL}/products/`)
		.then(res=>res.json())
		.then(data=>{
			console.log(data.products)
			const productdata = data.products
			setProducts(productdata)
		})
	},[]);


	const fetchData = () => {
		fetch(`${process.env.REACT_APP_API_URL}/products/`)
		.then(res => res.json())
		.then(data =>{
			console.log(data);
			setProducts(data.products);
		})
	}

	useEffect(()=>{

		fetchData();

	},[])




		return(
            <>
                {
                    (user.isAdmin === true) ?
                        <AdminView productsData={products} fetchData={fetchData} isActive={true}/>
                        :
                        <UserView productsData={products} />
                }
            </>
        )
}