import GreenLogo from '../assets/GreenLogo';
import Button from './Button';
import useAuthStore from '../store/authStore.js';
import { useState } from 'react';

const Login = ({ setIsAuthenticated }) => {

    const [form, setForm] = useState({phone: '', password: ''});

    const handleLogin = useAuthStore((state) => state.handleLogin);
    const isLoading = useAuthStore((state) => state.isLoading);

    const handleOnChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        const response = await handleLogin(form.phone, form.password);
        if(response){
            setIsAuthenticated(true);
        }
    }

  return (
    <div className='div-container bg-authBg text-black'>
        <div className='flex justify-center items-center gap-1'>
            <div>
                <GreenLogo className='text-LogoGreen' />
            </div>
            <div className='grow'>
                <p className='text-LogoGreen text-[1.4em] font-bold'>WhatsApp</p>
            </div>
        </div>
        <form className='w-[calc(100%-700px)] flex flex-col justify-center items-center border-2 border-black rounded-3xl mt-[150px] mb-5 mx-auto py-10 px-3 bg-white'>
            <h1 className='heading'>Enter phone number</h1>
            <p className='text-[1.2em] font-normal mb-6'>Enter your phone number.</p>
            <input type='tel' name='phone' placeholder='Enter phone number' className='text-black font-semibold bg-white w-[250px] py-3 pl-2 pr-5 rounded-lg border-2 border-black mb-4' onChange={handleOnChange} />
            <input type="password" name='password' placeholder='Enter password' className='text-black font-semibold bg-white w-[250px] py-3 pl-2 pr-5 rounded-lg border-2 border-black mb-4' onChange={handleOnChange} />
            <Button 
                className={`green-btn px-5 py-1.5 text-[1.05em] ${isLoading ? 'invisible' : 'visible'}`} 
                handleOnClick={handleOnSubmit}
            >
                Next
            </Button>
        </form>
        <div className='flex justify-center items-center'>
            <p className='text-[1.1em] font-normal'>Don't have a WhatsApp account? <span className='underline decoration-green-400 underline-offset-4 cursor-pointer'>Get started</span></p>
        </div>
    </div>
  )
}

export default Login;