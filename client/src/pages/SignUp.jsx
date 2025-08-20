import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();
  const handleChange = (e)=>{
      setFormData({
        ...formData,
        [e.target.id] : e.target.value
      })
  }
  const handleSubmit = async(e) =>{
    e.preventDefault();
    // console.log(e);

    try{
        setLoading(true);

        const res = await fetch("api/auth/signup",{
          method:"POST",
          headers:{
            'Content-Type':'application/json',
          },
          body: JSON.stringify(formData)
        });
        // console.log(res);

        const data = await res.json();

        if(data.success ===false){
            setErrorMessage(data.message);
            setLoading(false);
            return;
        }
        console.log(data);
        setLoading(false);
        // setErrorMessage(null);
        navigate("/sign-in");


    }catch(error){
      setLoading(false);
      setErrorMessage(error.message);
    }
    
  }
  // console.log(formData)
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder='username' className='border-1 p-3 rounded-lg bg-white' id="username"   onChange={handleChange}/>
        <input type="email" placeholder='email' className='border-1 p-3 rounded-lg bg-white' id="email" onChange={handleChange}/>
        <input type="password" placeholder='password' className='border-1 p-3 rounded-lg bg-white' id="password" onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{
          loading? 'Loading...':'Sign Up'
      }</button>
      <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className='text-blue-700 font-semibold hover:underline'>Sign In</span>
        </Link>
      </div>
      {errorMessage && <p className='text-red-500 mt-5'>{errorMessage}</p>}
    </div>
  )
}
