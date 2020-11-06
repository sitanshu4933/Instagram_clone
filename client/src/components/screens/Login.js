import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom'
import Alerts from './Alerts'
import {UserContext } from '../../App'

const Login = () => {
    const{state,dispatch}= useContext(UserContext)
    const history = useHistory()
    const [password, SetPassword] = useState("")
    const [email, SetEmail] = useState("")
    const PostData = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            return <Alerts type="error" message="invalid email" />
        }
        else {
            fetch("/signin", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }).then(res => res.json())
                .then(data => {
                    console.log(data)
                    if (data.error) {
                        return <Alerts type="error" message={data.error} />
                    }
                    else {
                        localStorage.setItem("jwt",data.token)
                        localStorage.setItem("user",JSON.stringify(data.user))
                        dispatch({type:"USER", payload:data.user})
                        history.push('/')
                        // <Alerts type="sucess" message="Logged in successfuly" />
                    }
                }).catch(err => {
                    console.log(err)
                })
        }
    }
    return (
        <>
            <div className="mycard ">
                <div className="card auth-card input-field">
                    <h2 className="brand-logo">Instagram</h2>
                    <input type="text" placeholder="Email" value={email} onChange={(event) => SetEmail(event.target.value)} ></input>
                    <input type="password" placeholder="Password" value={password} onChange={(event) => SetPassword(event.target.value)} ></input>
                    <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" type="submit" name="action" onClick={() => PostData()}>Login</button>
                    <Link to="/signup"> <h6>New User?click to signup</h6></Link>
                </div>
            </div>
        </>
    );
}

export default Login;
