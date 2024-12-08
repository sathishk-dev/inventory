import LoginForm from '../components/LoginForm'

export default function Login() {

  return (
    <div className='bg-[#f1f1f1] h-screen flex justify-center flex-col gap-8'>
        <h1 className='text-center font-bold text-[26px]'>Inventory Management</h1>
        <LoginForm/>
    </div>
  )
}
