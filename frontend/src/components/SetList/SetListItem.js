import React, { useState } from 'react';
import { Button, Card, CardActionArea, CardContent, CardMedia, CardHeader, Snackbar,  } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import UploadImage from '../UploadImage/UploadImage';
import { useHistory } from 'react-router';

import generalFetch from '../../utilities/generalFetch';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  media: {
    width: '100%',
    minHeight: 120,
    backgroundSize: "contain",
  }
})

export default function SetListItem({set, own}) {

  const {id, title, description, img_url, published} = set;
  
  const url = process.env.REACT_APP_API_URL;
  const path = useHistory();
  
  const classes = useStyles();

  const [ imgUploadOpen, setImgUploadOpen ] = useState(false);

  const handleImgOpen = () => {
    setImgUploadOpen(true);
  }

  const handleImgClose = () => {
    setImgUploadOpen(false);
  }
  
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

  const publish = async (id) => {
    await generalFetch('publish/'+set.id, 'PATCH');
    handleClick();
    navigator.clipboard.writeText(window.location.hostname + `/sets/${id}`);
    window.location.reload();
  }

  const byWho = () => {
    if (set.username === localStorage.getItem('username')) return (<>Your set</>);
    return (
      <>By <a href={`/${set.username}`}>{set.username}</a></>
    )
  }
  
  return (
    <>
    <Card className={classes.root} raised width={1} >
      <CardActionArea onClick={() => path.push('/sets/' + id)}>
        <CardHeader title={title ? title : "Untitled set"} subheader={byWho()}/>
        <CardContent>{description}<p/>
          <CardMedia
            style={{ backgroundColor: img_url ? "white" : "gray" }}
            className={classes.media}
            image={img_url ? `${url + 'audio_src/' + id}/img/${img_url}` : ``}
          />
        </CardContent>
      </CardActionArea>
        { own ?
          <>
          <Button onClick={handleImgOpen} aria-label={`change pic`} color="secondary">
            Change photo
          </Button>
          <UploadImage open={imgUploadOpen} onClose={handleImgClose} setId={id} trackId={0} />
          </>
        : ``}
        { !own || (own && published) ?
        <Button 
          onClick={(e) => share(set.id)}
          variant="contained"
          color="primary">
          Share
        </Button>
        : <Button 
          onClick={(e) => publish(set.id)}
          variant="contained"
          color="primary">
          Publish & share
        </Button>
        }
    </Card>
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
    </>
  )
}