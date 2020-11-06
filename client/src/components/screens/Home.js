import React, { useEffect, useState } from 'react';
import Card from './card'



const Home = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch('/allpost', {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result=>{
      setData(result.posts)
      // console.log(result)      
    })
  }, [data])
  return (
    <>
      <Card  post={data}/>
    </>
  );
}

export default Home;
