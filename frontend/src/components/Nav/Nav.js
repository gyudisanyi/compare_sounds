import React, { useState } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { Button, ButtonGroup } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Login from '../Login/Login';
import About from '../About/About';

export default function Nav() {

  const theme = useTheme();
  const bigScr = useMediaQuery(theme.breakpoints.up('sm'));

  const [aboutOpen, setAboutOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
    
  const handleAboutOpen = () => {
    setAboutOpen(true);
  }
  const handleAboutClose = () => {
    setAboutOpen(false);
  }
  const handleLoginOpen = () => {
    setLoginOpen(true);
  }
  const handleLoginClose = () => {
    setLoginOpen(false);
    if (localStorage.getItem('username')) {
    window.location.reload();
    }
  }

  const emptyLocalStorage = () => {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <div id = "nav">
      <BrowserRouter forceRefresh={true} >
        <ButtonGroup style={{alignItems: "flex-end"}}>
          <Link to="/"><Button variant="text" color="inherit">Home</Button></Link>
          { localStorage.getItem('username') ?
          <Link to={`/${localStorage.getItem('username')}`}><Button variant="text" color="inherit">Your sets</Button></Link>
          : ``
          }
          <Link to="/sets"><Button variant="text" color="inherit">Browse {bigScr ? `collections` : ``}</Button></Link>
        </ButtonGroup>
      </BrowserRouter>
      
      <ButtonGroup style={{alignItems: "flex-end"}}>
      <Button variant="text" color="inherit" onClick={handleAboutOpen}>About</Button>
        {localStorage.getItem('username')
          ? <Button variant="text" color="inherit" onClick={emptyLocalStorage}>Logout {bigScr ? localStorage.getItem('username') : ``}</Button>
          : <Button variant="text" color="inherit" onClick={handleLoginOpen}>Login / register</Button>}
      </ButtonGroup>

      <Login open={loginOpen} onClose={handleLoginClose} />
      <About open={aboutOpen} onClose={handleAboutClose} />

      </div>


  
  )

}