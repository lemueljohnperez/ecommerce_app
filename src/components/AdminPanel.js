import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import EditProduct from './EditProduct';
import ArchiveProduct from './ArchiveProduct';
import SetAdmin from './SetAdmin';

export default function AdminPanel({ productsData, fetchData }) {
    const [showSetAdminModal, setShowSetAdminModal] = useState(false);

    const handleShowSetAdminModal = () => setShowSetAdminModal(true);
    const handleCloseSetAdminModal = () => setShowSetAdminModal(false);

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const productsArr = productsData.map(product => {
            return (
                <tr key={product._id}>
                    <td>{product.name}</td>
                    <td style={{ whiteSpace: 'pre-line' }}>{product.description}</td>
                    <td>₱&nbsp;{product.price}</td>
                    <td className={product.isActive ? "text-success" : "text-danger"}>
                        {product.isActive ? "Available" : "Unavailable"}
                    </td>
                    <td><EditProduct product={product._id} fetchData={fetchData} /></td>
                    <td><ArchiveProduct product={product._id} isActive={product.isActive} fetchData={fetchData} /></td>
                </tr>
            );
        });

        setProducts(productsArr);

    }, [productsData]);

    return (
        <>
            <h1 className="text-center mt-5 pt-5">Admin Dashboard</h1>
            <div className="text-center mb-3">
                <Button as={Link} to="/addProduct" variant="primary" className="mr-2">Add New Product</Button>
                <Button as={Link} to="/order" variant="success" className="ml-2 mr-3">Show User Orders</Button>
                <SetAdmin/>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr className="text-center bg-dark text-white">
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
    );
}