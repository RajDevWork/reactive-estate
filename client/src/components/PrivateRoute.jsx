import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
    const currentuser = useSelector(state=>state.user);
    console.log("currentuser = ",currentuser)
  return currentuser.currentUser ? <Outlet /> : <Navigate to="/sign-in" />
}
