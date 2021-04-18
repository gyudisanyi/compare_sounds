import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, CardHeader, CardContent, Button } from '@material-ui/core';

import Login from '../../components/Login/Login';

export default function Home() {

  const path = useHistory();
  const username = localStorage.getItem('username')
  if (username) { path.push('../' + username) }

  const [loginOpen, setLoginOpen] = useState(false);

  const handleLoginOpen = () => {
    setLoginOpen(true);
  }
  const handleLoginClose = () => {
    setLoginOpen(false);
    if (localStorage.getItem('username')) {
      path.push('../' + localStorage.getItem('username'));
    }
  }

  return (
    <Card>
      <CardHeader title="Welcome to Compare Sounds!" subheader="I'll help you cross-reference sounds and share it with others." />
      <CardContent>
        Please <Button variant="text" color="inherit" onClick={handleLoginOpen}>Login / register</Button> and start playing!<br/>
        Or just <Button variant="text" color="inherit" onClick={() => path.push('../sets')}>browse sets</Button> made by others.
      </CardContent>
      <Login open={loginOpen} onClose={handleLoginClose} />
    </Card>
  )
}