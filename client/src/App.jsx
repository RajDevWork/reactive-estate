import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/home'
import About from './pages/about'
import Profile from './pages/Profile'
import Signin from './pages/signin'
import SignUp from './pages/SignUp'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './pages/CreateListing'
export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
            <Route path="/create-listing" element={<CreateListing />} />
        </Route>
        <Route path='/sign-in' element={<Signin />} />
        <Route path='/sign-up' element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  )
}
