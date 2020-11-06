import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom'
import Alerts from './Alerts'
// import Alert from '@material-ui/lab/Alert';


const Signup = () => {
  const history = useHistory()
  const [name, SetName] = useState("")
  const [password, SetPassword] = useState("")
  const [email, SetEmail] = useState("")
  const PostData = () => {
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      return <Alerts type="error" message="invalid email" />
    }
    else {
      fetch("/signup", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
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
            history.push('/login')
            // <Alerts type="sucess" message={data.message} />
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
          <input type="text" placeholder="Name" value={name} onChange={(event) => SetName(event.target.value)} ></input>
          <input type="text" placeholder="Email" value={email} onChange={(event) => SetEmail(event.target.value)} ></input>
          <input type="password" placeholder="Password" value={password} onChange={(event) => SetPassword(event.target.value)} ></input>
          <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" type="submit" name="action" onClick={() => PostData()}>Signup</button>
          <Link to="/login"> <h6>Already have an account?click to sign in</h6></Link>
        </div>
      </div>
    </>

  );
}

export default Signup;
