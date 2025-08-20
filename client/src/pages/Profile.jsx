import { useSelector } from 'react-redux';
export default function Profile() {
  const {currentUser} = useSelector(state=>state.user)
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-3'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <img src={currentUser.avatar} alt="Profile" className='rounded-full w-24 h-24 object-cover cursor-pointer self-center mt-2' />
        <input type="text" name="username" id="username" placeholder='username' className='border p-3 rounded-lg'/>
        <input type="email" name="email" id="email" placeholder='email' className='border p-3 rounded-lg'/>
        <input type="password" name="password" id="password" placeholder='password' className='border p-3 rounded-lg'/>
        <button className='uppercase bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80'>UPdate</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
