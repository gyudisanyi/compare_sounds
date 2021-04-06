import React from 'react';
import { DialogTitle, Dialog, Card, CardContent } from '@material-ui/core';

export default function About({ onClose, open }) {

  const handleClose = () => {
    onClose();
  }
  
  return (
    <Dialog onClose={handleClose} open={open}>
      <Card>
        <CardContent>
          <DialogTitle>About CompareSounds</DialogTitle>
          I did that
      </CardContent>
      </Card>
    </Dialog>
  )
}