import React, { useState } from 'react';
import { Button, FormControl, FormControlLabel, RadioGroup, Radio} from '@material-ui/core';
import UploadTracks from '../UploadTracks/UploadTracks';

export default function TracksList({ props }) {
  
  const { trackNodes, nodeKeys, tracks, nowPlaying, setNowPlaying, userId } = props;
  
  const [ uploadOpen, setUploadOpen ] = useState(false);

  function switchTrack(value) {
    trackNodes[nowPlaying].muted = true;
    try {
      trackNodes[value].muted = true;
    } catch {
      let newIndex = (nodeKeys.indexOf(nowPlaying) + 1) % nowPlaying.length;
      value = nodeKeys[newIndex];
    }
    trackNodes[value].muted = false;
    setNowPlaying(value);
  }

  const handleUploadOpen = () => {
    setUploadOpen(true);
  }

  const handleUploadClose = () => {
    setUploadOpen(false);
  }

  return (
    <>
    <FormControl>
      <RadioGroup row aria-label="sources" name="source" value={nowPlaying}>
        {Object.keys(tracks).map((key) =>
          (<FormControlLabel key={key} onClick={() => switchTrack(key)} value={key} control={<Radio />} label={tracks[key].title} />)
        )}
      </RadioGroup>
    </FormControl>
    { parseInt(localStorage.getItem('userid')) === userId 
      ? <>
        <Button onClick={handleUploadOpen}>Add tracks (up to {4 - Object.keys(tracks).length} more)</Button>
        <UploadTracks open={uploadOpen} onClose={handleUploadClose} maxFiles={4 - Object.keys(tracks).length}/>
        </>
      : ``}
    </>
  )
}
