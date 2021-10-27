import { Link } from "react-router-dom";
import { useContext } from "react"
import { myContext } from "../pages/Context";
import axios from "axios";

export default function Navbar() {
    const ctx = useContext(myContext)
    console.log(ctx);
    
    const logout = async () => {
        const resp = await axios.get("http://localhost:4000/logout", { withCredentials : true});
        console.log(resp.statusText);

        // Redirecting to homepage on logging out
        if(resp.statusText === "OK") window.location.href ="/";


    }
    return (
        <div className='NavContainer'>
            {ctx ? <div>
            <Link onClick={logout} to="/logout">Log Out</Link>
            <Link to="/profile">Profile</Link>
            {ctx.isAdmin && <Link to="/admin">Admin</Link>}
            </div>
             : <div>

                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
             </div>
            }
            <Link to="/">Home</Link>
        </div>
    )
}
