import React, { useState } from 'react';

import {
  Button, IconButton,
  Dialog, DialogTitle, DialogContent,
  TextField, FormGroup, FormControl,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

import generalFetch from '../../utilities/generalFetch';

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

export default function Login({ onClose, open }) {

  const classes = useStyles();

  const [userPass, setUserPass] = useState({username: "", password: ""});
  const [message, setMessage] = useState();

  const handleClose = () => {
    onClose();
  }

  const handleChange = ({ target }) => {
    setUserPass({...userPass, [target.name]: target.value});
  }

  const keyed = async (e) => {
    if (e.key === "Enter") login();
  }

  const login = async () => {
        
    try {
      const data = await generalFetch('login', 'POST', userPass);
      if (data.message) {setMessage(data.message); throw new Error(data.message)}
      if (data.token && data.username && data.usertype && data.userid) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('usertype', data.usertype);
        localStorage.setItem('userid', data.userid);
      }
      setMessage('');
      onClose();
    } catch(err) {
      console.log(err);
    }

  }
  const register = async () => {
    
    try {
      const data = await generalFetch('users', 'POST', userPass);
      setMessage(data.message);
    } catch(err) {
      console.log(err);
    }

  }

  return (
    <Dialog maxWidth="sm" onClose={handleClose} open={open} scroll="body">

      <DialogTitle>
        Login or register
        <IconButton className={classes.closeButton} aria-label="close" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FormControl onSubmit={login} onKeyPress={(e) => keyed(e)}>
          <FormGroup row onChange={handleChange}>
            <TextField 
              label="Username" 
              name="username" 
              InputProps={{ inputProps: {maxlength: 50}}} />
            <TextField 
              label="Password" 
              type="password" 
              name="password" />
          </FormGroup>
          {message}
          <Button type="submit" variant="contained" color="primary" onClick={() => login()}>Login</Button>
          <Button type="submit" variant="contained" onClick={() => register()}>Register</Button>
          Your username will link to your page.<br/>
          Your password is stored securely. No third parties.<br/>
          <span>If you forgot it, <a href="mailto: soundscompare@gmail.com">drop me a line</a> to get another one.</span>
        </FormControl>
      </DialogContent>
    </Dialog>
  )
}