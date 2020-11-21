import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'


const Navbar = () => {
    const { state, dispatch } = useContext(UserContext)
    const history=useHistory()
    const renderlist = () => {
        if (state) {
            return [
                <li><Link to="/profile">Profile</Link></li>,
                <li><Link to="/creatpost">Create Post</Link></li>,
                <li>
                    <button className="btn waves-effect waves-light #f44336 red" type="submit" name="action" onClick={() =>{
                        localStorage.clear()
                        dispatch({type:null})
                        history.push('/login')
                        }}>LogOut</button>
                    
                </li>
            ]
        } else {
            return [
                <li><Link to="/login">Login</Link></li>,
                <li><Link to="/signup">Signup</Link></li>,

            ]
        }
    }
    return (
        <>
            <nav>
                <div className="nav-wrapper">
                    <Link to={state ? "/" : "/login"} className="brand-logo">Instagram</Link>
                    <ul id="nav-mobile" className="right ">
                        {renderlist()}
                    </ul>
                </div>
            </nav>
        </>
    )
}
export default Navbar