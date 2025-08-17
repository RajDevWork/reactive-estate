import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/home'
import About from './pages/about'
import Profile from './pages/profile'
import Signin from './pages/signin'
import SignUp from './pages/SignUp'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/sign-in' element={<Signin />} />
        <Route path='/sign-up' element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  )
}
