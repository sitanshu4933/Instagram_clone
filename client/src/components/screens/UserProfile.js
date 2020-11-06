import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
// import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'

const UserProfile = () => {
  const [UserProfile,setProfile] = useState(null)
  // const {state,dispatch}=useContext(UserContext)
  const {userid}=useParams()
  console.log(userid)
  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
      .then(result => {
        setProfile(result)
        console.log(result)
        console.log(UserProfile)
      })
  }, [])
  return (
    <>
      <div className="main_profile">
        <div className="profile">
          <div className="profile-pic">
            <img src="https://images.unsplash.com/photo-1552171058-9b482e483bf5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80" alt="profile_pic" />
          </div>
          <div>
            {/* <h4>{UserProfile.user.name}</h4> */}
            {/* <h4>{UserProfile.user.email}</h4> */}
            <div className="profile-status">
              {/* <h5>{UserProfile.posts.length} posts</h5> */}
              <h5>40 followers</h5>
              <h5>40 followings</h5>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="gallery">
        {
          mypic.map(item => 
            <img key={item._id} src={item.photo} alt={item.title} />
          )
        }

      </div> */}
    </>
  );
}

export default UserProfile;
