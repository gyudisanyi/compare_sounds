import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, CardHeader, CardContent, Button } from '@material-ui/core';

import Login from '../../components/Login/Login';

export default function Home() {

  const path = useHistory();

  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if(localStorage.getItem('username')) {
      path.push(`/${localStorage.getItem('username')}`)
    }
  },[])

  const handleLoginOpen = () => {
    setLoginOpen(true);
  }
  const handleLoginClose = () => {
    setLoginOpen(false);
  }

  return (
    <Card raised elevation={24}>
      <CardHeader title="Welcome to Compare Sounds!" subheader="It'll help you cross-reference sounds and share it with others." />
      <CardContent>
        Please <Button variant="text" color="secondary" onClick={handleLoginOpen}>Login / register</Button> and start playing!<br/>
        Once you register, you'll be able to:
          <ul>
            <li>Upload up to 4 tracks for comparison</li>
            <li>Name and describe your sets and tracks, illustrate with photos</li>
            <li>Mark and save custom loops of interest</li>
            <li>Save and publish sets you've made.</li>
          </ul>
        <a href="player.JPG">This</a> is what the edit interface looks like.<br/>
        Go ahead and <Button variant="text" color="secondary" onClick={() => path.push('../sets')}>browse sets</Button> made by others!<br/>
        Take a look at <Button variant="text" color="secondary" onClick={()=> path.push('../sanyi')}>selected examples</Button> !
      </CardContent>
      <Login open={loginOpen} onClose={handleLoginClose} />
    </Card>
  )
}