import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleRegister = async(e)=>{
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Password not match");
            return;
        }

        try {
            const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/register`, { email, password });
            alert(data.message);
            navigate("/");
        } 
        catch (err) {
            setMessage("Registration failed");
        }
    }

    return (
        <div>
            <div className="w-full flex justify-center items-center">
                <div className="bg-white p-8 rounded shadow-lg w-full mx-4 md:w-1/2 lg:w-1/3">
                    <div className='mb-8'>
                        <h1 className="text-3xl mb-2 font-bold text-center uppercase">Sign-up</h1>
                        <p className='text-center'>Register your Account</p>
                    </div>
                    <form onSubmit={handleRegister}>
                        <div className="mb-4">
                            <label className="block font-semibold text-gray-700 mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="email" type="email" placeholder="Enter your email address" onChange={(e)=> setEmail(e.target.value)} required/>
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold text-gray-700 mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id="password" type="password" placeholder="Create password" onChange={(e)=> setPassword(e.target.value)} required/>
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold text-gray-700 mb-2" htmlFor="confirm-password">
                                Confirm Password
                            </label>
                            <input
                                className="border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id="confirm-password" type="password" placeholder="Confirm password" onChange={(e)=> setConfirmPassword(e.target.value)} required/>
                        </div>
                        <div>
                            {message && (
                                <p>{message}</p>
                            )}
                        </div>
                        <div className="mb-6 flex flex-col gap-2">
                            <button
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit">
                                SignUp
                            </button>
                            <a href="/" className='text-blue-600'>I already have account</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
