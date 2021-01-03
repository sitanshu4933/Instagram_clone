import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import { UserContext } from '../../App'
import { useParams, useHistory } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress';
import NotFound from './NotFound'

const UserProfile = () => {
  const history = useHistory()
  const [Profile, setProfile] = useState()
  const { state, dispatch } = useContext(UserContext)
  const [showFollow, setShowFollow] = useState(true)
  const { userid } = useParams()
  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
    }).then(res => res.json())
      .then(result => {
        if (result.error) {
          history.push('/NotFound')
        } else {
          setProfile(result)
        }
      })
  }, [userid])


  const followUser = () => {
    fetch('/follow', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        followId: userid
      })
    }).then(res => res.json())
      .then(result => {
        console.log(result)
        dispatch({ type: "UPDATE", payload: { following: result.following, followers: result.followers } })
        localStorage.setItem("user", JSON.stringify(result))
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, result._id]
            }
          }
        })
      })
    setShowFollow(false)
  }
  const unfollowUser = () => {
    fetch('/unfollow', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        unfollowId: userid
      })
    }).then(res => res.json())
      .then(result => {
        console.log(result)
        dispatch({ type: "UPDATE", payload: { following: result.following, followers: result.followers } })
        localStorage.setItem("User", JSON.stringify(result))
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: prevState.user.followers.filter(item => item != result._id)
            }
          }
        })
        console.log(UserProfile)
      })
    setShowFollow(true)
  }
  return (
    <>
      {Profile ? <><div className="main_profile">
        <div className="profile">
          <div className="profile-pic">
            <img src={Profile?.user.pic} alt="profile_pic" />
          </div>
          <div>
            <h4>{Profile?.user.name}</h4>
            <h4>{Profile?.user.email}</h4>
            <div className="profile-status">
              <h5>{Profile?.posts.length} posts</h5>
              <h5>{Profile?.user.followers.length} followers</h5>
              <h5>{Profile?.user.following.length} followings</h5>
            </div>
            {showFollow ? <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" type="submit" name="action" onClick={() => followUser()}>Follow</button> :
              <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" type="submit" name="action" onClick={() => unfollowUser()}>Unfollow</button>
            }
          </div>
        </div>
      </div>
        <div className="gallery">
          {
            Profile?.posts.map(item =>
              <img key={item._id} src={item.photo} alt={item.title} />
            )
          }
        </div></> : <CircularProgress />
      }
    </>
  )
}


export default UserProfile;
