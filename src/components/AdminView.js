//a. Add importations
import { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import EditProduct from './EditProduct';
import ArchiveProduct from './ArchiveProduct';


export default function AdminView({ productsData, fetchData }) {

    // b. Add state to store all courses 
    const [products, setProducts] = useState([])


    //c. Getting the coursesData from the courses page
    useEffect(() => {
        const productsArr = productsData.map(product => {
            return (
                <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.price}</td>
                    <td className={product.isActive ? "text-success" : "text-danger"}>
                        {product.isActive ? "Available" : "Unavailable"}
                    </td>
                    {/*We are passing the course id as a prop*/}
                    <td><EditProduct product={product._id} fetchData={fetchData}/></td> 
                    {/*<td><button className="btn btn-danger">Archive</button></td>*/}
                    <td><ArchiveProduct product={product._id} isActive={product.isActive} fetchData={fetchData}/></td>    
                </tr>
                )
        })
        //d. pass the value (coursesArr) as courses in the tbody of the return statemet below
        setProducts(productsArr)

    }, [productsData])


    return(
        <>
            <h1 className="text-center my-4"> Admin Dashboard</h1>
            
            <Table striped bordered hover responsive>
                <thead>
                    <tr className="text-center">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Availability</th>
                        <th colSpan="2">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {products}
                </tbody>
            </Table>    
        </>

        )
}