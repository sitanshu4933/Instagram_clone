import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'

const UserProfile = () => {
  const [Profile, setProfile] = useState(null)
  const { state, dispatch } = useContext(UserContext)
  const [showFollow, setShowFollow] = useState(true)
  const { userid } = useParams()
  console.log(userid)
  // const abortController = new AbortController()
  let ismounted = false
  useEffect(() => {
    ismounted = true
    fetch(`/user/${userid}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      // signal: abortController.signal
    }).then(res => res.json())
      .then(result => {
        console.log(result)
        if (ismounted) {
          setProfile((result) => {
            return { result }
          })
        }
        console.log(Profile)
      })
    // return function cancel() {
    //   abortController.abort()
    // }
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
        dispatch({ type: "UPDATE", payload: { following: result.followings, followers: result.followers } })
        localStorage.setItem("User", JSON.stringify(result))
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, result._id]
            }
          }
        })
        console.log(UserProfile)
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
        dispatch({ type: "UPDATE", payload: { following: result.followings, followers: result.followers } })
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
  }
  return (
    <div className="main_profile">
      <div className="profile">
        <div className="profile-pic">
          <img src="https://images.unsplash.com/photo-1552171058-9b482e483bf5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80" alt="profile_pic" />
        </div>
        <div>
          <h4>{Profile.user.name}</h4>
          {/* <h4>{UserProfile.user.email}</h4> */}
          <div className="profile-status">
            {/* <h5>{UserProfile.posts.length} posts</h5> */}
            <h5>40 followers</h5>
            <h5>40 followings</h5>
          </div>
          {showFollow ? <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" type="submit" name="action" onClick={() => followUser()}>Follow</button> :
            <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" type="submit" name="action" onClick={() => unfollowUser()}>Unfollow</button>
          }
        </div>
      </div>
    </div>
  )
}


export default UserProfile;
