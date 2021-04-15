import React from 'react';
import { FormControl, FormControlLabel, RadioGroup, Radio} from '@material-ui/core';

export default function TracksList({ props }) {
  console.log(props)
  const { trackNodes, nodeKeys, tracks, nowPlaying, setNowPlaying } = props;
  
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

  return (

    <FormControl>
      <RadioGroup row aria-label="sources" name="source" value={nowPlaying}>
        {Object.keys(tracks).map((key) =>
          (<FormControlLabel key={key} onClick={() => switchTrack(key)} value={key} control={<Radio />} label={tracks[key].title} />)
        )}
      </RadioGroup>
    </FormControl>
  )
}
