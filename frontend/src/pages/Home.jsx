import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function Home() {
    const [inventory, setInventory] = useState([]); //for store the data

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFile, setSelectedFile] = useState(null);

    //inventory data fetch
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/inventory/getInventory`);
                console.log(data);
                setInventory(data)
            } catch (error) {
                console.error("Error fetching inventory:", error.message);
            }
        };
        fetchInventory();
    }, [selectedFile]);



    //file upload logic here
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handleFileUpload = async () => {

        if (!selectedFile) {
            alert("Please select a file!");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const { data } = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/api/inventory/upload`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            alert(`File uploaded successfully.`);
            setSelectedFile(null);
        }
        catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload file, try again.");
        }
        finally {
            setSelectedFile(null);
        }
    };

    //clear inventory data
    const clearInventoryData = ()=>{
        const confirmClearData = window.confirm("Are you sure want to clear?");
        if (confirmClearData) {
            setInventory([]);
            axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/inventory/clear`);
        }
        
    }

    //pagination logic
    const itemsPerPage = 10;

    const totalPages = Math.ceil(inventory.length / itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = inventory.slice(startIndex, startIndex + itemsPerPage);



    return (
        <div>
            <Navbar />

            <div className="bg-[#f1f1f1] min-h-screen p-5 pt-6 md:px-20">
                <div className="flex justify-between md:items-center items-end flex-col md:flex-row">
                    <div className="mb-4">
                        <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            htmlFor="file-upload"
                        >
                            Upload Inventory File (.xlsx)
                        </label>
                        <div className="border-2 flex w-fit rounded-full p-1">
                            <input
                                type="file"
                                id="file-upload"
                                accept=".xlsx"
                                onChange={handleFileChange}
                                className="file:md:mr-4 file:md:py-2 file:p-2 file:text-xs file:px-4 w-full file:rounded-full file:border-0 file:md:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                            />
                            <button
                                onClick={handleFileUpload}
                                className="md:px-4 md:py-2 p-2 text-xs md:text-base bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={clearInventoryData}
                            className="md:px-4 md:py-2 p-2 mb-3 md:m-0 text-xs md:text-base bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            Clear Data
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-indigo-600 text-white">
                            <tr>
                                <th className="px-4 py-2">ID</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Quantity</th>
                                <th className="px-4 py-2">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="px-4 py-2">{item.id}</td>
                                        <td className="px-4 py-2">{item.name}</td>
                                        <td className="px-4 py-2">{item.quantity}</td>
                                        <td className="px-4 py-2">${item.price}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center px-4 py-2 text-gray-500">
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
