import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardMedia } from '@material-ui/core';
import UploadImage from '../UploadImage/UploadImage';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    minHeight: 150,
    justifyContent: 'space-between',
  },
  description: {
    display: 'flex',
    flexDirection: 'column',
  },
  media: {
    width: '150px',
    transition: '.5s',
    backgroundSize: 'cover',
    backgroundPositionY: 'center',
    backgroundPositionX: 'center',
    '&:hover': { cursor: 'pointer', opacity: .5 }
  }
})

export default function TrackDescription({track, url, setId, own}) {

  const { description, img_url } = track;
  const classes = useStyles();
  const [ imgUploadOpen, setImgUploadOpen ] = useState(false);

  const handleImgOpen = () => {
    if (!own) return;
    setImgUploadOpen(true);
  }

  const handleImgClose = () => {
    setImgUploadOpen(false);
  }

  return (

    <Card className={classes.root} raised>
      <CardContent className={classes.description}>{description}</CardContent>
      <CardMedia
        style={{ backgroundColor: img_url ? 'black' : 'gray' }}
        onClick={handleImgOpen}
        className={classes.media}
        image={img_url ? `${url + 'audio_src/' + setId}/img/${img_url}` : ''}
      />
      <UploadImage open={imgUploadOpen} onClose={handleImgClose} setId={setId} trackId={track.id} />
    </Card>

  )
}
