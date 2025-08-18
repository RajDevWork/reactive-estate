import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';
export default function Signin() {
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

    // console.log("formdata = ",formData);

    try{
        setLoading(true);

        const res = await fetch("api/auth/signin",{
          method:"POST",
          headers:{
            'Content-Type':'application/json',
          },
          body: JSON.stringify(formData)
        });
        // console.log(res);

        const data = await res.json();

        // console.log("data = ",data);

        if(data.success ===false){
            setErrorMessage(data.message);
            setLoading(false);
            return;
        }
        // console.log(data);
        setLoading(false);
        // setErrorMessage(null);
        navigate("/");


    }catch(error){
      setLoading(false);
      setErrorMessage(error.message);
    }
    
  }
  // console.log(formData)
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="email" placeholder='email' className='border-1 p-3 rounded-lg bg-white' id="email" onChange={handleChange}/>
        <input type="password" placeholder='password' className='border-1 p-3 rounded-lg bg-white' id="password" onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{
          loading? 'Loading...':'Sign In'
      }</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont Have an account?</p>
        <Link to="/sign-in">
          <span className='text-blue-700 font-semibold hover:underline'>Sign Up</span>
        </Link>
      </div>
      {errorMessage && <p className='text-red-500 mt-5'>{errorMessage}</p>}
    </div>
  )
}
