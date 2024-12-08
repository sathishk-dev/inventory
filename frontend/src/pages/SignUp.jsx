import React from 'react'
import RegisterForm from '../components/RegisterForm'

export default function SignUp() {
  return (
    <div className='bg-[#f1f1f1] h-screen flex justify-center flex-col gap-8'>
        <h1 className='text-center font-bold text-[26px]'>Inventory Management</h1>
        <RegisterForm/>
    </div>
  )
}
