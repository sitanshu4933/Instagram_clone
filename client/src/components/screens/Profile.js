import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import {UserContext} from '../../App'

const Profile = () => {
  const {state,dispatch}=useContext(UserContext)
  const [mypic, setMypic] = useState([])
  console.log(state)
  useEffect(() => {
    fetch("/mypost", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
      .then(result => {
        // console.log(result)
        setMypic(result.myposts)
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
            <h4>{state.name}</h4>
            <div className="profile-status">
              <h5>40 posts</h5>
              <h5>40 followers</h5>
              <h5>40 followings</h5>
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
    </>
  );
}

export default Profile;
