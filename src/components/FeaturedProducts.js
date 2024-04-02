import { useState, useEffect } from 'react';
import { CardGroup } from 'react-bootstrap';
import PreviewProduct from './PreviewProduct';

export default function FeaturedProducts() {

	const [preview, setPreview] = useState([]);

	useEffect(() => {

		fetch(`${process.env.REACT_APP_API_BASE_URL}/products/`)
		.then(res => res.json())
		.then(data => {
			console.log(data)

			console.log(data.products)


			//Added two empty arrays to be used to store random numbers and featured products data
			const numbers = [];
			const featured = [];


			const generateRandomNums = () => {

				let randomNum = Math.floor(Math.random() * data.products.length)

				if(numbers.indexOf(randomNum) === -1) {
					numbers.push(randomNum)
				}

				else {
					generateRandomNums()
				}
			}

			//a loop is used to iterate five times (from 0 to 4)
				//Inside the loop, the generateRandomNums Function is called to generate a random number and push it into the numbers array
			for(let i = 0; i < 5; i++) {
				generateRandomNums()

				featured.push(
					<PreviewProduct key={data.products[numbers[i]]._id} data={data.products[numbers[i]]} breakPoint={2}/>
				)

			}

			setPreview(featured)

		})
	}, [])

	return (
		<>
			<h2 className="text-center featuredTitle">BEST SELLERS</h2>
			<CardGroup className="justify-content-center my-5">

				{preview}

			</CardGroup>
		</>
	)
}