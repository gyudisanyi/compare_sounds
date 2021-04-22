import React from 'react';
import {Grid, Button, Snackbar, IconButton} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SetListItem from './SetListItem';

export default function SetList({sets, own}) {

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const share = (id) => {
    handleClick();
    navigator.clipboard.writeText(window.location.hostname + `/sets/${id}`);
  }


  return (
    <Grid container spacing = {3}>
        {sets.map((set) => (
            <Grid item xs = {12} md = {3}>
              { own ?
              <>
                <Button 
                  // onClick={(e) => publish(set.id)}
                  variant={set.published ? "contained" : "text"} 
                  color={set.published ? "secondary" : "default"}>
                    {set.published ? "Published" : "Not published"}
                </Button>
              </>
              : ''
              }
              <SetListItem set={set} own={own}/>
              <Button 
                onClick={(e) => share(set.id)}
                variant="contained"
                color="primary">
                  Share
              </Button>
            </Grid>          
        ))}
        <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={open}
        autoHideDuration={1000}
        onClose={handleClose}
        message="Link copied to clipboard!"
      />
    </Grid>


  )
}
