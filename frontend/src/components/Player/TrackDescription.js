import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardMedia } from '@material-ui/core';
import UploadImage from '../UploadImage/UploadImage';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    minHeight: 120,
    justifyContent: 'space-between'
  },
  description: {
    display: 'flex',
    flexDirection: 'column',
    width: '60%',
  },
  media: {
    width: '40%',
    backgroundPositionY: 'top',
    backgroundPositionX: 'right',
  }
})

export default function TrackDescription({props}) {

  const { track, url, set} = props;
  const { description, img_url } = track;
  const classes = useStyles();
  const [ imgUploadOpen, setImgUploadOpen ] = useState(false);

  const handleImgOpen = () => {
    setImgUploadOpen(true);
  }

  const handleImgClose = () => {
    setImgUploadOpen(false);
  }

  return (

    <Card className={classes.root} raised>
      <CardContent className={classes.description}>{description}</CardContent>
      <CardMedia
        style={{ backgroundColor: "gray" }}
        onClick={handleImgOpen}
        className={classes.media}
        image={`${url + 'audio_src/' + set}/img/${img_url}`
        }
      />
      <UploadImage open={imgUploadOpen} onClose={handleImgClose} setId={set} trackId={track.id} />
    </Card>

  )
}
