import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserFailure, updateUserStart, updateUserSuccess,deleteUserStart,deleteUserSuccess,deleteUserFailure,signoutUserStart,signoutUserSuccess,signoutUserFailure } from '../redux/user/userSlice.js';
// import {Link} from 'react-dom';
import {Link} from 'react-router-dom';
// import { Cloudinary } from '@cloudinary/url-gen';
// import { auto } from '@cloudinary/url-gen/actions/resize';
// import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
// import { AdvancedImage } from '@cloudinary/react';



export default function Profile() {
  const {currentUser,loading,error} = useSelector(state=>state.user)
  const fileref = useRef(null);
  const [Uploadedfile, setFile] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [fileUploadError, setFileuploadedError] = useState(false);
  const [myFormData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [showListingError, setListingError] = useState(false);
  const [userListins, setUserListings] = useState([]);

  const dispatch = useDispatch();
  // const cld = new Cloudinary({ cloud: { cloudName: 'dj4qovax8' } });
// console.log("Upload progress: ",progress);
// console.log("fileUploadError: ",fileUploadError);
// console.log("FormData: ",myFormData);
  useEffect(()=>{
      if(Uploadedfile){
        handleFileUpload(Uploadedfile);
      }
  },[Uploadedfile]);


 const handleFileUpload = async (Uploadedfile)=>{

    console.log(Uploadedfile);

    const data = new FormData();
    data.append("file", Uploadedfile);
    data.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET); // Cloudinary dashboard se

    const cloud_name = import.meta.env.VITE_CLOUD_NAME;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.cloudinary.com/v1_1/"+cloud_name+"/image/upload");

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded * 100) / e.total));
      }
    });

    xhr.onload = () => {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        setFormData({...FormData,avatar:res.secure_url});//setting up uploaded image url
        // console.log("Uploaded URL:", res.secure_url);
      }else{
        setFileuploadedError(true);
      }
    };

    xhr.send(data);







  // try {
  //   const res = await fetch(
  //     "https://api.cloudinary.com/v1_1/dj4qovax8/image/upload",
  //     {
  //       method: "POST",
  //       body: data,
  //     }
  //   );

  //   const uploadedImage = await res.json();
  //   console.log("Uploaded Image URL:", uploadedImage.secure_url);

  //   // ✅ Ab aap yeh URL ko DB me save kar sakte ho
  //   // jaise update user profile
  // } catch (err) {
  //   console.error(err);
  // }


 }
 const handleChange = (e)=>{
    setFormData({...myFormData,[e.target.id]:e.target.value});
 }

 const handleSubmit = async (e)=>{
  e.preventDefault();

  try {
      dispatch(updateUserStart());


      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method:'POST',
        headers:{
          'content-type':'application/json'
        },
        body:JSON.stringify(myFormData)
      });
      const data = await res.json();
      if(data ===false){
          dispatch(updateUserFailure(data.message));
          return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);

  } catch (error) {
    dispatch(updateUserFailure(error.message));
  }



 }
//  console.log("error",error);


const handleDeleteUser = async()=>{

  try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{method:'DELETE',});
      const data = await res.json();
      if(data===false){
        dispatch(deleteUserFailure(data.message));
        return
      }

      dispatch(deleteUserSuccess(data));
    
  } catch (error) {
    dispatch(deleteUserFailure(error.message));
  }

}

const handleLogout = async ()=>{

    try {
      dispatch(signoutUserStart())
      const res = await fetch("/api/auth/signout")
      const data = await res.json();
      if(data === false){
        dispatch(signoutUserFailure(data));
        return;
      }
      dispatch(signoutUserSuccess(data));
      
    } catch (error) {
      dispatch(signoutUserFailure(error.message));
    }

}

const handleShowListing = async() =>{

  try {
    setListingError(false);
      const res = await fetch(`/api/user/listing/${currentUser._id}`)
      const data = await res.json();
      if(data.success ===false){
        setListingError(data.message);
        return;
      }
      setUserListings(data);

  } catch (error) {
      setListingError(error.message);
  }
}

const handleDeleteListing = async(listid) =>{

  try {
      const res = await fetch(`/api/listing/delete/${listid}`,{method:'DELETE'});
      const data = await res.json();
      if(data.success === false){
        console.log(data.message);
        return;
      }

      setUserListings((prev)=>{
        prev.filter((listing)=>listing._id !==listid)
      })

    
  } catch (error) {
      console.log(error.message);
  }

}

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-3'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileref} hidden accept='image/*'/>
        <img onClick={()=>fileref.current.click()} src={myFormData?.avatar || currentUser.avatar} alt="Profile" className='rounded-full w-24 h-24 object-cover cursor-pointer self-center mt-2' />
        <p className='text-sm self-center'>
          {fileUploadError 
          ? 
          (<span className='text-red-700'>Image upload Error</span>)
          :
          progress > 0 && progress < 100 
            ? (<span className='text-slate-700'>Image uploading {progress}%</span>)
          :
          progress==100 ? (<span className='text-green-700'>Image Uploaded Successfully!</span>) : ''
          
          }
        </p>

        <input type="text" name="username" defaultValue={currentUser.username} id="username" placeholder='username' className='border p-3 rounded-lg' onChange={handleChange}/>
        <input type="email" name="email" defaultValue={currentUser.email} id="email" placeholder='email' className='border p-3 rounded-lg' onChange={handleChange}/>
        <input type="password" name="password" id="password" placeholder='password' className='border p-3 rounded-lg' onChange={handleChange}/>
        <button disabled={loading} className='uppercase bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80'>{loading?'Loading..':'update'}</button>
        <Link className="bg-green-700 text-white p-3 rounded-lg text-center uppercase hover:opacity-95 disabled:opacity-80" to={"/create-listing"}>
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete account</span>
        <span onClick={handleLogout} className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5 self-center text-center'>{error ? currentUser?.message : currentUser?.message }</p>
      <p className='text-green-700 mt-5 self-center text-center'>{updateSuccess ? 'User updated Successfully' : '' }</p>

      <button onClick={handleShowListing} className='text-green-700 w-full'>Show Listing</button>
      <p className='text-red-700 text-center mt-5'>
        {showListingError? showListingError:''}
      </p>

      {
        userListins && userListins.length > 0 
        ? <h1 className='text-2xl font-semibold text-center my-7'>Your Listings</h1>
        :null
      }

      {
        userListins && userListins.length > 0 
        ?
        (
          
          userListins.map((list)=>{
            return <div key={list._id} className='border border-gray-300 p-3 rounnded-lg flex justify-between items-center my-2 gap-4 rounded-lg'>
                <Link to={`/listing/${list._id}`}>
                  <img src={list.imageUrls[0]} alt="listing" className='w-16 h-16 object-contain'/>
                </Link>
                <Link className='text-slate-700 font-semibold flex-1 hover:underline truncate' to={`/listing/${list._id}`}>
                <p >{list.name}</p>
                </Link>
                <div className='flex flex-col'>
                  <button onClick={()=>handleDeleteListing(list._id)}className='text-red-700 hover:underline uppercase cursor-pointer'>Delete</button>
                  <Link to={`/update-listing/${list._id}`}>
                    <button className='text-green-700 hover:underline uppercase cursor-pointer'>Edit</button>
                  </Link>
                </div>

            </div>

          })
        )
        :null
      }


    </div>
  )
}
