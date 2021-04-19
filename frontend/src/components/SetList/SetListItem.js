import React, {useState} from 'react';
import { Button, Card, CardActionArea, CardContent, CardMedia, CardHeader } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import UploadImage from '../UploadImage/UploadImage';
import { useHistory } from 'react-router';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  media: {
    width: '100%',
    minHeight: 120,
    backgroundPositionY: 'top',
    backgroundPositionX: 'right',
  }
})

export default function SetListItem({set, own}) {

  const {id, title, description, img_url} = set;
  
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

  return (
    <Card className={classes.root} raised>
      <CardActionArea onClick={() => path.push('/sets/' + id)}>
        <CardHeader title={title} subheader={description}/>
        <CardContent>
          <CardMedia
            style={{ backgroundColor: "gray" }}
            className={classes.media}
            image={`${url + 'audio_src/' + id}/img/${img_url}`}
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
    </Card>
  )
}