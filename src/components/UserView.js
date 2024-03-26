import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import SearchByPrice from './SearchByPrice';

export default function UserView({productsData}) {

    console.log(productsData)
    //if it is an object, we still need to destructure or use dot notation

    const [products, setProducts] = useState([])

    useEffect(() => {
        const productsArr = productsData.map(product => {

            //only render the active courses since the route used is /all from Course.js page
            if(products.isActive === true) {
                return (
                    <ProductCard productProp={product} key={product._id}/>
                    )
            } else {
                return null;
            }
        })

        //set the courses state to the result of our map function, to bring our returned course component outside of the scope of our useEffect where our return statement below can see.
        setProducts(productsArr)

    }, [productsData])

    return(
        <>
            <SearchByPrice/>
            <>
                { products }
            </>
        </>
    )
}