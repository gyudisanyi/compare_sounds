import React, {useState} from 'react';
import { Card, CardActionArea, Button, CardHeader} from '@material-ui/core';
import UploadImage from '../UploadImage/UploadImage';
import { useHistory } from 'react-router';

export default function SetListItem({set, own}) {

  const {id, title, description, img_url} = set;
  
  const url = process.env.REACT_APP_API_URL;
  const path = useHistory();
  
  const [ imgUploadOpen, setImgUploadOpen ] = useState(false);

  const handleImgOpen = () => {
    setImgUploadOpen(true);
  }

  const handleImgClose = () => {
    setImgUploadOpen(false);
  }

  return (
    <Card>
      <CardActionArea onClick={() => path.push('/sets/' + id)}>
        <CardHeader title={title} subheader={description}/>
          <img src={`${url + 'audio_src/' + id}/img/${img_url}`}
         alt={title} />
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