import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { startAuthentication, startRegistration } from "@simplewebauthn/browser"

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();



    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/login`, { email, password });
            localStorage.setItem("token", data.token);
            localStorage.setItem("isLoggedIn", true);


            // navigate('/home')
            const isWebAuthReg = await registerPassKey();
            if (isWebAuthReg) {
                const isWebAuthLog = await loginPassKey();
                if (isWebAuthLog) {
                    console.log("successfully project completed")
                    localStorage.setItem('webAuth', true)
                    navigate('/home')
                }
            }
        }
        catch (err) {
            if (err.response && err.response.status === 401) {
                setMessage(err.response.data.message);
            } else {
                setMessage("Something went wrong. Please try again.");
                console.log(err)
            }
        }
    }

    async function registerPassKey() {
        const email = localStorage.getItem('userEmail')
        if (!email) {
            alert("No email found")
        }

        const initResponse = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/api/webauthn/init-register?email=${email}`,
            { credentials: "include" }
        )
        const options = await initResponse.json()
        if(options.isAlredyReg){
            return true
        }
        if (!initResponse.ok) {
            console.log(options.error)
        }

        //passkey
        const registrationJSON = await startRegistration(options)

        const verifyResponse = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/webauthn/verify-register`, {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registrationJSON),
        })

        const verifyData = await verifyResponse.json()
        if (!verifyResponse.ok) {
            console.log(verifyData.error)
        }
        if (verifyData.verified) {
            console.log(`Successfully registered ${email}`)
            return true
        } else {
            console.log("Failed to register")
        }
    }

    async function loginPassKey() {
        const email = localStorage.getItem('userEmail')

        const initResponse = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/webauthn/init-auth?email=${email}`, {
            credentials: "include",
        })
        const options = await initResponse.json()
        console.log('weblog: ', options)
        if (!initResponse.ok) {
            console.log(options.error)
        }

        //get passkey
        const authJSON = await startAuthentication(options)

        //verify passkey
        const verifyResponse = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/webauthn/verify-auth`, {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(authJSON),
        })

        const verifyData = await verifyResponse.json()
        if (!verifyResponse.ok) {
            console.log(verifyData.error)
        }
        if (verifyData.verified) {
            console.log(`Successfully Loggged in ${email}`)
            return true
        } else {
            console.log("Failed to loggin")
        }
    }


    return (
        <div>
            <div className="w-full flex justify-center items-center">
                <div className="bg-white p-8 rounded shadow-lg w-full mx-4 md:w-1/2 lg:w-1/3">
                    <div className='mb-8'>
                        <h1 className="text-3xl mb-2 font-bold text-center uppercase">Login</h1>
                        <p className='text-center'>Sign in to your Account</p>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block font-semibold text-gray-700 mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="email" type="email" placeholder="Enter your email address" onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold text-gray-700 mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id="password" type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} required />
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
                                Login
                            </button>
                            <a href="/register" className='text-blue-600'>I don't have account</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}