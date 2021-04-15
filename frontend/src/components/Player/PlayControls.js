import React, { useState } from 'react';
import { Button, Box, Slider } from '@material-ui/core';
import { VolumeUp, VolumeOff } from '@material-ui/icons';

export default function PlayControls({props}) {
  const { trackNodes, nodeKeys, nowPlaying, bigScr } = props;

  console.log(trackNodes)

  const [paused, setPaused] = useState(true);
  const [volume, setVolume] = useState(50);
  const [muted, setMuted] = useState(false)

  const playPause = () => {
    paused
      ? nodeKeys.forEach((key) => trackNodes[key].play())
      : nodeKeys.forEach((key) => trackNodes[key].pause())
    setPaused(prev => !prev);
  }

  const mute = () => {
    setMuted(p => !p)
    trackNodes[nowPlaying].muted = !trackNodes[nowPlaying].muted;
  }

  const adjustVolume = (value) => {
    setVolume(value);
    nodeKeys.forEach((key) => trackNodes[key].volume = value / 100)
  }


  return (
    <Box display="flex" alignItems={bigScr ? "column" : "row"} justify="space-around">
      <Box display="flex"
        flexDirection={bigScr ? "column" : "row"}
        justifyContent={bigScr ? "center" : "stretch"}
        minWidth={!bigScr?"7em":""}
        minHeight={bigScr?"7em":""}
        alignItems="center">
        { muted 
        ? <VolumeOff onClick={mute} />
        : <VolumeUp onClick={mute} />
        }
        <Slider orientation={bigScr ? "vertical" : "horizontal"} value={volume} onChange={(e, value) => adjustVolume(value)} />
      </Box>
      <Button onClick={playPause} variant="contained" color={paused ? "primary" : "secondary"}>
        ►
      </Button>
    </Box>

  )
}
