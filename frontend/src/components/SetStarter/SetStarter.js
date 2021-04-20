import React from 'react';
import {Card, CardHeader, CardContent} from '@material-ui/core';

import 'react-dropzone-uploader/dist/styles.css';
import '../../dropzone.css';
import Dropzone from 'react-dropzone-uploader';

const requestHeaders = {
  Accept: 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
}

export default function SetStarter({setId, own}) {

  const username = localStorage.getItem('username');
  console.log({own})
  
  const getUploadParams = ({ file, meta }) => {
    const url = process.env.REACT_APP_API_URL+'sounds/'+setId;
    const body = new FormData()
    body.append('Files', file);
    body.append('durations', meta.duration);
    return { url, method: "POST", headers: requestHeaders, body, meta: { fileUrl: `${url}/${encodeURIComponent(meta.name)}` } }
  }

  const handleChangeStatus = ({ meta }, status) => {
    console.log(status, meta)
  }

  const handleSubmit = (files, allFiles) => {
    console.log(files.map(f => f.meta))
    allFiles.forEach(f => f.remove())
    window.location.reload();    
  }

  return (
    <Card>
      { username ?
      <>
      <CardHeader title={`Hey ${username}!`} subheader={ own ? "Welcome to this brand new set! Start by dropping up to 4 audio files in here!" : "What are you doing in someone else's empty set?" } />
      <CardContent>
      { own ?
      <Dropzone
            getUploadParams={getUploadParams}
            maxFiles={4}
            multiple={true}
            inputWithFilesContent={(files, extra) => (extra.reject ? 'Audio files only' :`${4 - files.length} more`)}
            onChangeStatus={handleChangeStatus}
            onSubmit={handleSubmit}
            accept="audio/*"
            styles={{
              dropzone: { width: 350, height: 200 },
              dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' },
              inputLabel: (files, extra) => (extra.reject ? { color: 'red' } : {}),
            }}
          />
        : ``
      }
      { own ?
      <>
      <p><strong>TIP: </strong>Upload (or record with your Android device) sounds worth comparing.
      <br/>Such as:
        <ul>
          <li>different mixes of the same song, </li>
          <li>demonstrations of blatant plagiarism,</li>
          <li> audio quality drop due to compression, </li>
        </ul>
        or whatever looks fun.
      </p>
      <p>Use snippets of similar duration: your collection's play length will default to the shortest track's. You can export tracks from a DAW like <a href="https://www.audacityteam.org/">Audacity (free)</a>.</p>
      <p>You can edit titles, descriptions, save interesting loops and add images after that. </p>
      <p>You can publish this collection and share its URL, or a link to <a href={`/${username}`}>all of your sets</a>.</p>
      </>
      : ``}
      </CardContent>
      </>
      : 
      <>
      <CardHeader title={`Hey stranger!`} subheader="You might want to log in or register." />
      <CardContent>
      </CardContent>
      </> }
    </Card>
  )
}