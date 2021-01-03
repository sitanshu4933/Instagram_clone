import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom'
import Alerts from './Alerts'

const Reset = () => {
    const history = useHistory()
    const [email, SetEmail] = useState("")
    const [alert, SetAlert] = useState({ isopen: false, type: '', message: '' })

    const PostData = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            return SetAlert({ isopen: true, type: "error", message: "Invalid email" })

        }
        else {
            fetch("/reset-password", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    email
                })
            }).then(res => res.json())
                .then(data => {
                    console.log(data)
                    if (data.error) {
                        return SetAlert({ isopen: true, type: "error", message: data.error })
                    }
                    else {
                        SetAlert({ isopen: true, type: "success", message: data.message })
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
                    <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" type="submit" name="action" onClick={() => PostData()}>Reset password</button>
                </div>
            </div>
            <Alerts alert={alert} Setalert={SetAlert} />
        </>
    );
}

export default Reset;
