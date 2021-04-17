import React, { useState, useEffect, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { 
  Slider,
  Switch,
  Box, 
  FormControl, 
  FormControlLabel, 
  FormGroup, 
  TextField, 
  Button } from '@material-ui/core';

import generalFetch from '../../utilities/generalFetch';

import ManageLoops from '../ManageLoops/ManageLoops';

import rangesToGradient from '../../utilities/rangesToGradient';
import GlobalContext from '../../context/GlobalContext';

export default function ProgressBar({props}) {

  const {progress, resolution} = props
  const context = useContext(GlobalContext);
  const  { loops, set } = context.setData;
  const { duration, username } = set;
  const own = (username === localStorage.getItem('username'))
  const [actualLoop, setActualLoop] = useState([10, 200])

  const [snap, setSnap] = useState(false);
  const [looping, setLooping] = useState(false);
  const [customLoop, setCustomLoop] = useState([130, 250]);
  const [customLoopName, setCustomLoopName] = useState('Loop');
  const [loopsOpen, setLoopsOpen] = useState(false);

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

  const handleLoopsOpen = () => {
    setLoopsOpen(true);
  }

  const handleLoopsClose = () => {
    setLoopsOpen(false);
  }

  useEffect(() => {
    if (progress >= resolution) {
      allTracks.forEach((track) => track.currentTime = 0)
    }
    if (!looping) return;
    if (progress >= actualLoop[1]) {
      allTracks.forEach((track) => track.currentTime = actualLoop[0] / resolution * track.duration)
    }

  }, [progress, resolution, actualLoop, looping, allTracks])

  const seek = (value) => {
    const loopsAhead = loopsArray.filter((loop) => loop.range[1] > value);
    const nextLoop = loopsAhead[0] ? loopsAhead[0].range : [0, 1000];
    if (!loopsAhead[0]) { setLooping(false) };
    setActualLoop(nextLoop);
    if (!allTracks[0]) return;
    let seekSeconds = (value / resolution) * duration;
    allTracks.forEach((trackNode) => trackNode.currentTime = seekSeconds || 0);
  }

  function handleCustomLoop (value) {
    setCustomLoop(value);
    setActualLoop(value);
    setLooping(true);
  }

  function handleCustomLoopInput ({target}) {
    console.log({target});
    const newLoop=[...customLoop];
    newLoop[target.id]=[target.value];
    setCustomLoop(newLoop);
    setActualLoop(newLoop);
    setLooping(true);
  }

  const buttontext = () => {
    if (!own) return `You can save loops for your own sets.`
    try {
      if (Object.keys(loops).length > 4) return `Max 5 loops`
    } catch {
      console.log("Ach so")
    }
    return `Save loop`
  }

  async function saveCustomLoop (event) {
    const loopData = {
      description: customLoopName || "Loop",
      start: customLoop[0],
      end: customLoop[1],
    }
    const res = await generalFetch('loops/'+set.id, "POST", loopData);
    console.log(res);
    window.location.reload();
  }

  function enterLoopName (event) {
    setCustomLoopName(event.target.value);
  }

  function isItActual() {
    if (actualLoop[0] === customLoop[0] && actualLoop[1] === customLoop[1]) return 'secondary';
    return 'primary';
  }

  return (
    <>
      <FormControl>
        <FormControlLabel key={`loop`} control={<Switch checked={looping} onClick={() => setLooping(o => !o)} />} label="Loops" labelPlacement="end" />
      { marks[0] ?
        <FormControlLabel key={`snap`} control={<Switch checked={snap} onClick={() => setSnap(o => !o)} />} label="Snap" labelPlacement="end" />
      : ``
      }
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
        onChange={(e, value) => handleCustomLoop(value)} />
      <FormGroup row label="custom loop" onChange={handleCustomLoopInput}>
        <TextField variant="outlined" label="name" onChange={enterLoopName} />
        <Box width={80}>
          <TextField variant="outlined" label="start" type="number" id="0" value={customLoop[0]} />
        </Box>
        <Box width={80}>
          <TextField variant="outlined" label="end" type="number" id="1" value={customLoop[1]} />
        </Box>
      </FormGroup>
        <Button type="submit" disabled={buttontext() !== `Save loop`} onClick={saveCustomLoop}>{buttontext()}</Button>
        { own ?
          <Button onClick={handleLoopsOpen}>Manage saved loops</Button>
          : ``
        }
      <ManageLoops open={loopsOpen} onClose={handleLoopsClose} />

    </>
  )
}


