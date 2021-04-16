import React from 'react';
import {GridListTileBar, } from '@material-ui/core';

export default function SetListItem({set}) {
  const {id, title, description, img_url} = set;
  const url = process.env.REACT_APP_API_URL;
  console.log({set})

  return (
    <>
      <img src={`${url + 'audio_src/' + id}/img/${img_url}`} alt="title" width="100%"/>
      <GridListTileBar
        title={title}
        subtitle={description}
        />
    </>
  )
}