import React, { useState, useEffect, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Slider, Switch, FormControl, FormControlLabel } from '@material-ui/core';
import rangesToGradient from '../../utilities/rangesToGradient';
import GlobalContext from '../../context/GlobalContext';

export default function ProgressBar() {

  const resolution = 1000;

  const context = useContext(GlobalContext);
  const  { loops } = context.setData;
  const [actualLoop, setActualLoop] = useState([10, 200])

  const [snap, setSnap] = useState(false);
  const [looping, setLooping] = useState(false);
  const [customLoop, setCustomLoop] = useState([130, 250]);

  const loopsArray = Object.values(Object.values(loops))
    .sort((a, b) => a.start - b.start)
    .map((loop) => ({ range: [loop.start, loop.end], description: loop.description }));
  const { trackNodes } = context;
  
  const marks = loopsArray.map((loop) => ({ value: loop.range[0], label: loop.description }))
  
  const allTracks = Object.values(trackNodes);

  const primaryColor = "rgb(62, 80, 179)";
  const secondaryColor = "rgb(239, 2, 88)";

  const grad = rangesToGradient(loopsArray, primaryColor, secondaryColor)

  const ProgressBar = withStyles({
    rail: { top: 13, height: 4, opacity: 1, backgroundImage: grad },
    track: { top: 2, height: 12, opacity: .5 },
    thumb: { display: "none" },
    mark: { height: 12, top: 2, width: 5 },
    markActive: { backgroundColor: secondaryColor },
    markLabel: { transform: "translateX(0%)" },
  })(Slider);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    allTracks[0].addEventListener('timeupdate', ({ target }) => {
      setProgress((target.currentTime / target.duration) * resolution);
    });
  }, []);

  useEffect(() => {
    
    if (!looping) return;
    if (progress >= actualLoop[1]) {
      allTracks.forEach((track) => track.currentTime = actualLoop[0] / resolution * track.duration)
    }

  }, [progress, actualLoop, looping, allTracks])

  const seek = (value) => {
    const loopsAhead = loopsArray.filter((loop) => loop.range[1] > value);
    const nextLoop = loopsAhead[0] ? loopsAhead[0].range : [0, 1000];
    if (!loopsAhead[0]) { setLooping(false) };
    setActualLoop(nextLoop);
    if (!allTracks[0]) return;
    let seekSeconds = (value / resolution) * allTracks[0].duration;
    allTracks.forEach((trackNode) => trackNode.currentTime = seekSeconds || 0);
  }

  function handleCustomLoop (value) {
    setCustomLoop(value);
    setActualLoop(value);
    setLooping(true);
  }

  function isItActual() {
    if (actualLoop[0] === customLoop[0] && actualLoop[1] === customLoop[1]) return 'secondary';
    return 'primary';
  }

  return (
    <>
      <FormControl>
        <FormControlLabel key={`loop`} control={<Switch checked={looping} onClick={() => setLooping(o => !o)} />} label="Loops" labelPlacement="end" />
        <FormControlLabel key={`snap`} control={<Switch checked={snap} onClick={() => setSnap(o => !o)} />} label="Snap" labelPlacement="end" />
      </FormControl>
      <ProgressBar
        step={snap ? null : 1} 
        marks={marks} 
        max={resolution} 
        value={progress} 
        valueLabelDisplay="auto" 
        onChange={(e, value) => seek(value)} />
      <Slider 
        max={resolution}
        value={customLoop}
        color={isItActual()}
        onChange={(e, value) => handleCustomLoop(value)}/>
        

    </>
  )
}


