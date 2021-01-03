import React, { createContext, useContext, useEffect, useReducer,useState } from 'react';
import './App.css';
import Navbar from './components/Navbar'
import { BrowserRouter, Route, useHistory, Switch, } from 'react-router-dom'
import Home from './components/screens/Home'
import Login from './components/screens/Login'
import Profile from './components/screens/Profile'
import Signup from './components/screens/Signup'
import CreatPost from './components/screens/CreatPost'
import UserProfile from './components/screens/UserProfile'
import { reducer, intialstate } from './components/reducers/userReducer'
import Reset from './components/screens/Reset'
import NewPassword from './components/screens/NewPassword'
import FollowingUserPosts from './components/screens/FollowingUserPosts'
import NotFound from './components/screens/NotFound'


export const UserContext = createContext()

const Routing = () => {
  const history=useHistory()
  const {state,dispatch}=useContext(UserContext)

  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
      // history.push('/')
    }else{
      if(!history.location.pathname.startsWith("/reset"))
      history.push('/login')
    }
  },[])
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route exact path="/creatpost">
        <CreatPost />
      </Route>
      <Route exact path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route exact path="/reset">
        <Reset />
      </Route>
      <Route exact path="/reset/:token">
        <NewPassword />
      </Route>
      <Route exact path="/myfollowingpost">
        <FollowingUserPosts />
      </Route>
      <Route >
        < NotFound/>
      </Route>
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, intialstate)
  return (
    <>
      <UserContext.Provider value={{state, dispatch}}>
        <BrowserRouter>
          <Navbar />
          <Routing />
        </BrowserRouter>
      </UserContext.Provider>
    </>
  );
}

export default App;
