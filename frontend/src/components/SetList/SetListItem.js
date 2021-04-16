import React, {useState} from 'react';
import {GridListTileBar} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { InsertPhoto } from '@material-ui/icons/';
import UploadImage from '../UploadImage/UploadImage';

export default function SetListItem({set}) {
  const {id, title, description, img_url} = set;
  const url = process.env.REACT_APP_API_URL;
  
  const [ imgUploadOpen, setImgUploadOpen ] = useState(false);

  const handleImgOpen = () => {
    setImgUploadOpen(true);
  }

  const handleImgClose = () => {
    setImgUploadOpen(false);
  }

  return (
    <>
      <img src={`${url + 'audio_src/' + id}/img/${img_url}`} alt="title" width="100%"/>
      <GridListTileBar
        title={title}
        subtitle={description}
        actionIcon={
          <IconButton onClick={handleImgOpen} aria-label={`change pic`} color="secondary">
            <InsertPhoto/>
          </IconButton>
        }
      />
      <UploadImage open={imgUploadOpen} onClose={handleImgClose} setId={id} trackId={0} />
    </>
  )
}