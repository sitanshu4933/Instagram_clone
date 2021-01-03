import React, { useContext, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom'
import Alerts from './Alerts'

const NewPassword = () => {
    const history = useHistory()
    const [password, SetPassword] = useState("")
    const { token } = useParams()
    const [alert, SetAlert] = useState({ isopen: false, type: '', message: '' })

    const PostData = () => {
        fetch("/new-password", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                newPassword: password,
                token
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    return SetAlert({ isopen: true, type: "error", message: data.error })

                }
                else {
                    SetAlert({ isopen: true, type: "success", message: "password reset successfull" })
                    setTimeout(() => {
                        history.push('/login')
                    }, 4000);
                }
            }).catch(err => {
                console.log(err)
            })
    }
    return (
        <>
            <div className="mycard ">
                <div className="card auth-card input-field">
                    <h2 className="brand-logo">Instagram</h2>
                    <input type="password" placeholder="Enter a new Password" value={password} onChange={(event) => SetPassword(event.target.value)} ></input>
                    <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" type="submit" name="action" onClick={() => PostData()}>confirm</button>
                </div>
            </div>
            <Alerts alert={alert} Setalert={SetAlert} />
        </>
    );
}

export default NewPassword;
