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

  const login = async (event, p) => {
    console.log(p);

    event.preventDefault();
    
    try {
      const data = await generalFetch(p, 'POST', userPass);
      console.log({data});
      if (data.message) {setMessage(data.message); throw new Error(data.message)}
      if (data.token && data.username && data.usertype) {
        localStorage.setItem('token', data.token);
      }
      setMessage('')
      throw new Error("sux");
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
        <FormControl onSubmit={login}>
          <FormGroup row onChange={handleChange}>
            <TextField label="Username" name="username"></TextField>
            <TextField label="Password" name="password"></TextField>
          </FormGroup>
          {message}
          <Button type="submit" variant="contained" onClick={(event) => login(event, "login")}>Login</Button>
          <Button type="submit" variant="contained" onClick={(event) => login(event, "users")}>Register</Button>
        </FormControl>
      </DialogContent>
    </Dialog>
  )
}