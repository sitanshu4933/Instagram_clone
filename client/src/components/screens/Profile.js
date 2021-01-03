import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import { UserContext } from '../../App'
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alerts from './Alerts'


const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));
const Profile = () => {
  const history = useHistory()
  const { state, dispatch } = useContext(UserContext)
  const [mypic, setMypic] = useState([])
  const [image, setImage] = useState()
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [alert, SetAlert] = useState({ isopen: false, type: '', message: '' })
  useEffect(() => {
    fetch("/mypost", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
      .then(result => {
        console.log(result)
        setMypic(result.myposts)
      })
  }, [])
  const updatePhoto = () => {
    if (!image) {
      return SetAlert({ isopen: true, type: "error", message: "Please select an image" })
    } else {
      setOpen(!open)
      const formData = new FormData()
      formData.append("file", image)
      formData.append("upload_preset", "insta-clone")
      formData.append("cloud_name", "sitanshu")
      fetch("https://api.cloudinary.com/v1_1/sitanshu/image/upload", {
        method: 'post',
        body: formData
      }).then(res => res.json())
        .then(data => {
          console.log(data.url)
          fetch(`/updatepic`, {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
              pic: data.url
            })
          }).then(res => res.json())
            .then(result => {
              console.log(result)
              localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }))
              dispatch({ type: "UPDATEPIC", payload: result.pic })
              setOpen(!open)
              return SetAlert({ isopen: true, type: "success", message: "Profile pic updated successfully" })
            }).catch(err => {
              console.log(err)
            })
        }).catch(err => {
          console.log(err)
        })
    }

  }
  return (
    <>
      <div className="main_profile">
        <div className="profile">
          <div className="profile-pic">
            <img src={state ? state.pic : ""} />
            <div className="file-field input-field">
              <div className="btn">
                <span>Upload Pic</span>
                <input type="file" onChange={(event) => { setImage(event.target.files[0]) }} />
              </div>
              <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
              </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" type="submit" name="action" onClick={() => updatePhoto()}>Update</button>
          </div>
          <div>
            <h4>{state ? state.name : ""}</h4>
            <h4>{state ? state.email : ""}</h4>
            <div className="profile-status">
              <h5>{mypic.length} posts</h5>
              <h5>{state ? state.followers ? state.followers.length : '0' : ''} followers</h5>
              <h5>{state ? state.following ? state.following.length : '0' : ''} followings</h5>
            </div>
          </div>
        </div>
      </div>
      <div className="gallery">
        {
          mypic.map(item =>
            <img key={item._id} src={item.photo} alt={item.title} />
          )
        }

      </div>
      <Alerts alert={alert} Setalert={SetAlert} />
      <Backdrop className={classes.backdrop} open={open} >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default Profile;
