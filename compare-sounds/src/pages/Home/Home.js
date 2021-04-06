import React, {useState, useEffect} from 'react';
import { Card, CardContent, Button } from '@material-ui/core';
import Login from '../../components/Login/Login';

export default function Home () {
  
  const [loginOpen, setLoginOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({username: '', usertype: ''})

  useEffect(()=>{
    setUserInfo({username: localStorage.getItem('token')});
  },[])

  const handleLoginOpen = () => {
    setLoginOpen(true);
  }

  const handleLoginClose = () => {
    setLoginOpen(false);
  }

  return (
    <div id="main">
      <Card>
        <CardContent>
          <Button variant="contained" color="primary" onClick={handleLoginOpen}>Login / register</Button>
          <Login open={loginOpen} onClose={handleLoginClose} />
          {userInfo.username}
        </CardContent>
      </Card>
    </div>
  )
}