import React from 'react'
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import { app } from './../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
export default function OAuth() {
  const disapatch = useDispatch();
  const navigate = useNavigate();
    const handleGoogleClick = async()=>{
            try {
                const provider = new GoogleAuthProvider()
                const auth = getAuth(app);
                const result = await signInWithPopup(auth,provider);
                console.log("result = ",result);

                const res = await fetch("/api/auth/google",{
                  method:'POST',
                  headers:{
                    'content-type':'application/json'
                  },
                  body:JSON.stringify({name: result.user.displayName,email:result.user.email,avatar:result.user.photoURL})
                });

                const data = await res.json();
                
                disapatch(signInSuccess(data));
                navigate("/");
            } catch (error) {
                console.log("Could not signin to google",error);
            }
    }

  return (
    <button type="button" onClick={handleGoogleClick} className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Continue with google</button>
  )
}
