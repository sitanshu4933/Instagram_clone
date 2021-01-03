import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom'
import Alerts from './Alerts'


const Signup = () => {
  const history = useHistory()
  const [name, SetName] = useState("")
  const [password, SetPassword] = useState("")
  const [email, SetEmail] = useState("")
  const [image, setImage] = useState()
  const [url, setUrl] = useState(undefined)
  const [alert, SetAlert] = useState({ isopen: false, type: '', message: '' })
  useEffect(() => {
    if (url) {
      uploadFields()
    }
  }, [url])
  const uploadPic = () => {
    const formData = new FormData()
    formData.append("file", image)
    formData.append("upload_preset", "insta-clone")
    formData.append("cloud_name", "sitanshu")
    console.log(image)
    fetch("https://api.cloudinary.com/v1_1/sitanshu/image/upload", {
      method: 'post',
      body: formData
    }).then(res => res.json())
      .then(data => {
        console.log(data.url)
        setUrl(data.url)
      }).catch(err => {
        console.log(err)
      })
  }
  const uploadFields = () => {
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      return SetAlert({ isopen: true, type: "error", message: "Invalid email" })

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
          password,
          pic: url
        })
      }).then(res => res.json())
        .then(data => {
          console.log(data)
          if (data.error) {
            return SetAlert({ isopen: true, type: "error", message: data.error })
          }
          else {
            SetAlert({ isopen: true, type: "success", message: data.message })
            setTimeout(() => {
              history.push('/login')
          }, 4000);
          }
        }).catch(err => {
          console.log(err)
        })
    }
  }
  const PostData = () => {
    if (image) {
      uploadPic()
    } else {
      uploadFields()
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
          <div className="file-field input-field">
            <div className="btn">
              <span>Upload Pic</span>
              <input type="file" onChange={(event) => { setImage(event.target.files[0]) }} />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" value={image} />
            </div>
          </div>
          <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" type="submit" name="action" onClick={() => PostData()}>Signup</button>
          <Link to="/login"> <h6>Already have an account?click to sign in</h6></Link>
        </div>
      </div>
      <Alerts alert={alert} Setalert={SetAlert} />
    </>

  );
}

export default Signup;
