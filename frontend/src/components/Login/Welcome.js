import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { DialogContent, Button } from '@material-ui/core';

export default function Welcome ({ onClose, id }) {
  console.log(id);

  const firstSet = () => {
    onClose();
  }

  return (
    <DialogContent>
    <BrowserRouter forceRefresh={true} >
      <Link to={`/sets/${id}`}><Button onClick={firstSet}>Take me to my first set!</Button></Link>
    </BrowserRouter>
    </DialogContent>
  )
}