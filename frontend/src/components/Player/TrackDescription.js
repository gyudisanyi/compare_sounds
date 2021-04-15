import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardMedia } from '@material-ui/core';

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
  console.log(props)
  const { track, url, set} = props;
  const { description, img_url } = track;
  const classes = useStyles();

  return (
    <Card className={classes.root} raised>
      <CardContent className={classes.description}>{description}</CardContent>
      <CardMedia
      className={classes.media}
      image={`${url+'audio_src/'+set}/img/${img_url}`}
              />
    </Card>

  )
}
