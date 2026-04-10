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
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        {/* Profile Header */}
        <div className='bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-8 relative overflow-hidden'>
          {/* Decorative elements */}
          <div className='absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 animate-pulse'></div>
          <div className='absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-indigo-200 to-blue-200 rounded-full opacity-30 animate-bounce'></div>
          
          <div className='relative z-10'>
            <h1 className='text-4xl font-bold text-center mb-8 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'>
              👤 My Profile
            </h1>
            
            {/* Profile Picture Section */}
            <div className='flex flex-col items-center mb-8'>
              <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileref} hidden accept='image/*'/>
              <div className='relative group'>
                <img 
                  onClick={()=>fileref.current.click()} 
                  src={myFormData?.avatar || currentUser.avatar} 
                  alt="Profile" 
                  className='rounded-full w-32 h-32 object-cover cursor-pointer border-4 border-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105' 
                />
                <div className='absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                  <span className='text-white font-semibold'>📷 Change</span>
                </div>
              </div>
              
              {/* Upload Progress */}
              <div className='mt-4 text-center'>
                {fileUploadError && (
                  <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-xl inline-flex items-center gap-2'>
                    <span>❌</span>
                    <span className='font-medium'>Image upload failed</span>
                  </div>
                )}
                {progress > 0 && progress < 100 && (
                  <div className='bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded-xl inline-flex items-center gap-2'>
                    <span>📤</span>
                    <span className='font-medium'>Uploading... {progress}%</span>
                    <div className='w-20 h-2 bg-blue-200 rounded-full overflow-hidden'>
                      <div className='h-full bg-blue-600 rounded-full transition-all duration-300' style={{width: `${progress}%`}}></div>
                    </div>
                  </div>
                )}
                {progress === 100 && (
                  <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-xl inline-flex items-center gap-2'>
                    <span>✅</span>
                    <span className='font-medium'>Image uploaded successfully!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Update Form */}
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='grid md:grid-cols-1 gap-6'>
                {/* Username */}
                <div className='group'>
                  <label className='block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide'>
                    Username
                  </label>
                  <input 
                    type="text" 
                    name="username" 
                    defaultValue={currentUser.username} 
                    id="username" 
                    placeholder='Enter your username' 
                    className='w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md' 
                    onChange={handleChange}
                  />
                </div>

                {/* Email */}
                <div className='group'>
                  <label className='block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide'>
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    defaultValue={currentUser.email} 
                    id="email" 
                    placeholder='Enter your email' 
                    className='w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md' 
                    onChange={handleChange}
                  />
                </div>

                {/* Password */}
                <div className='group'>
                  <label className='block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide'>
                    New Password
                  </label>
                  <input 
                    type="password" 
                    name="password" 
                    id="password" 
                    placeholder='Enter new password (optional)' 
                    className='w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md' 
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Update Button */}
              <button 
                disabled={loading} 
                className='w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 transform border-2 border-white/20 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
              >
                {loading ? (
                  <div className='flex items-center justify-center gap-2'>
                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    Updating...
                  </div>
                ) : (
                  '✨ Update Profile'
                )}
              </button>

              {/* Create Listing Button */}
              <Link 
                className="block w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-xl text-center font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 transform border-2 border-white/20 backdrop-blur-sm" 
                to={"/create-listing"}
              >
                🏠 Create New Listing
              </Link>
            </form>

            {/* Status Messages */}
            {error && (
              <div className='mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-center font-medium'>
                ❌ {error}
              </div>
            )}
            {updateSuccess && (
              <div className='mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl text-center font-medium'>
                ✅ Profile updated successfully!
              </div>
            )}
          </div>
        </div>

        {/* Account Actions */}
        <div className='bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 mb-8'>
          <h2 className='text-2xl font-bold text-slate-800 mb-6 text-center'>Account Settings</h2>
          <div className='flex flex-col sm:flex-row gap-4'>
            <button 
              onClick={handleDeleteUser} 
              className='flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform border-2 border-white/20 backdrop-blur-sm'
            >
              🗑️ Delete Account
            </button>
            <button 
              onClick={handleLogout} 
              className='flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform border-2 border-white/20 backdrop-blur-sm'
            >
              🚪 Sign Out
            </button>
          </div>
        </div>

        {/* Listings Section */}
        <div className='bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'>
              🏠 My Listings
            </h2>
            <button 
              onClick={handleShowListing} 
              className='bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 transform border-2 border-white/20 backdrop-blur-sm'
            >
              📋 Show My Listings
            </button>
          </div>

          {/* Error Message */}
          {showListingError && (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-center font-medium mb-6'>
              ❌ {showListingError}
            </div>
          )}

          {/* Listings Grid */}
          {userListins && userListins.length > 0 && (
            <div className='space-y-6'>
              {userListins.map((list, index) => (
                <div 
                  key={list._id} 
                  className='bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 overflow-hidden group'
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className='flex flex-col sm:flex-row'>
                    {/* Image */}
                    <div className='sm:w-48 h-48 sm:h-auto flex-shrink-0'>
                      <Link to={`/listing/${list._id}`}>
                        <img 
                          src={list.imageUrls[0]} 
                          alt="listing" 
                          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' 
                        />
                      </Link>
                    </div>

                    {/* Content */}
                    <div className='flex-1 p-6'>
                      <Link to={`/listing/${list._id}`}>
                        <h3 className='text-xl font-bold text-slate-800 mb-2 hover:text-blue-600 transition-colors line-clamp-2'>
                          {list.name}
                        </h3>
                      </Link>
                      
                      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4'>
                        <div className='flex gap-4'>
                          <button 
                            onClick={()=>handleDeleteListing(list._id)}
                            className='bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300'
                          >
                            🗑️ Delete
                          </button>
                          <Link to={`/update-listing/${list._id}`}>
                            <button className='bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300'>
                              ✏️ Edit
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {userListins && userListins.length === 0 && !showListingError && (
            <div className='text-center py-12'>
              <div className='w-24 h-24 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full flex items-center justify-center mb-6 shadow-lg mx-auto'>
                <span className='text-4xl'>🏠</span>
              </div>
              <h3 className='text-2xl font-bold text-slate-800 mb-2'>No Listings Yet</h3>
              <p className='text-slate-600 text-lg mb-6'>
                You haven't created any listings yet. Start by creating your first property listing!
              </p>
              <Link 
                to="/create-listing"
                className='inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 transform border-2 border-white/20 backdrop-blur-sm'
              >
                ➕ Create Your First Listing
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
