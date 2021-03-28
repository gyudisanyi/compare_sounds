import React, { useState, useEffect, useContext, useRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Switch, Button, Slider, Card, CardContent, } from '@material-ui/core';
import { FormControl, FormControlLabel, RadioGroup, Radio, } from '@material-ui/core';
import GlobalContext from '../../context/GlobalContext';

export default function Player() {

  const context = useContext(GlobalContext);

  const resolution = 1000;
  
  const [progress, setProgress] = useState(0);

  const [nowPlaying, setNowPlaying] = useState(0);
  const [snap, setSnap] = useState(false);
  const [paused, setPaused] = useState(true);
  const [looping, setLooping] = useState(false);
  const [actualLoop, setActualLoop] = useState([10,200])
  const [loops, setLoops] = useState([{range: [846, 890.35], description: "Default loop"}]);
  const [marks, setMarks] = useState([{}]);
  const [grad, setGrad] = useState('');

  const pBar = useRef(null);

  const ProgressBar = withStyles({
    rail: {top: 13, height: 4, opacity: 1, backgroundImage: grad},
    track: {top: 2, height: 12, opacity: .5, color: paused ? "rgb(62, 80, 179)" : "rgb(239, 2, 88)",},
    thumb: {display: "none"},
    mark: {height: 12, top: 2, width: 5},
    markActive: {backgroundColor: "rgb(239, 2, 88)"},
    markLabel: {transform: "translateX(0%)"},
  })(Slider);

  useEffect(() => {
    setNowPlaying(0);
    if (!context.trackNodes) { console.log(`No track nodes`); return }
    console.log("Track nodes loaded");
    context.trackNodes[0].addEventListener('timeupdate', ({ target }) => {
      setProgress((target.currentTime / target.duration)  * resolution);
    });
    context.trackNodes[0].addEventListener('loadeddata', () => {
      console.log("Loaded");
      setPaused(true);
    })
    context.trackNodes[0].addEventListener('ended', () => {
      console.log("Ended");
      setPaused(true);
      context.trackNodes.forEach(t=>t.currentTime=0);
      setProgress(0);
    })
  }, [context.trackNodes])

  useEffect(() => {
    setLoops(context.collection.loops.map((loop)=>({ range: [loop.start, loop.end], description: loop.description })));
  }, [context.collection.loops]);

  useEffect(() => {
    const loopstarts = loops.map((loop)=>({value: loop.range[0], label: loop.description}))
    setGrad(rangesToGradient(loops, "rgb(62, 80, 179)", "rgb(239, 2, 88)"))
    setMarks(loopstarts);
  }, [loops]);

  useEffect(() => {
    if (!looping || !loops[0] ) return;
    const loopsAhead = loops.filter((loop) => loop.range[1] > progress);
    if (!loopsAhead[0]) {setActualLoop(loops[0].range); return};
    setActualLoop(loopsAhead[0].range);
  },[looping, loops])

  useEffect(() => {
    if (!looping) return;
    if (progress >= actualLoop[1]) {
      context.trackNodes.forEach((t) => t.currentTime = actualLoop[0] / resolution * context.trackNodes[0].duration)
    }
  }, [progress, actualLoop, looping, context.trackNodes])

  function playPause() {
    paused
    ? context.trackNodes.forEach((track) => track.play())
    : context.trackNodes.forEach((track) => track.pause());
    setPaused(prev => !prev)
  }
  
  function seek(event, newValue) {
    const loopsAhead = loops.filter((loop) => loop.range[1] > newValue);
    let nextLoop;
    nextLoop = loopsAhead[0] ? loopsAhead[0].range : [0,1000];
    if (!loopsAhead[0]) {setLooping(false)};
    setActualLoop(nextLoop);
    if (!context.trackNodes[0]) return;
    let seekSeconds = (newValue / resolution) * (context.trackNodes[0].duration);
    context.trackNodes.forEach((track)=> track.currentTime = seekSeconds || 0);
  }
  
  function switchTrack(value) {
    context.trackNodes[nowPlaying].muted = true;
    try {
      context.trackNodes[value].muted = false;
    } catch {
      value = (nowPlaying+1) % context.trackNodes.length;
    }
    context.trackNodes[value].muted = false;
    setNowPlaying(value);
  }
  
  function rangesToGradient(loops, color1=`black`, color2=`yellow`) {
    const pt1 = `linear-gradient(90deg, ${color1} 0%, `;
    const pt2 = loops.map((loop) => 
      `${color1} ${loop.range[0]/10}%, ${color2} ${loop.range[0]/10}%, 
      ${color2} ${loop.range[1]/10}%, ${color1} ${loop.range[1]/10}%, `);
    const pt3 = `${color1} 100%)`;
  return (pt1 + pt2.join('') + pt3);
  }

  return (
    <Card>
    <CardContent>
      <Grid container spacing={3} justify="center">
        <Grid item xs={3}>
          <Button onClick={playPause} variant="contained" color={paused ? "primary" : "secondary"}>
            ►
          </Button>
          <FormControl>
            <FormControlLabel key={`loop`} control={<Switch checked={looping} onClick={() =>setLooping(o => !o)}/>} label="Loops" labelPlacement="end" />
            <FormControlLabel key={`snap`} control={<Switch checked={snap} onClick={() => setSnap(o => !o)}/>} label="Snap" labelPlacement="end" />
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl>
            <RadioGroup row aria-label="sources" name="source" value={nowPlaying}>
              {context.collection.tracks.map((track, i) =>              
              (<FormControlLabel key={i} onClick={()=>switchTrack(i)} value={i} control={<Radio />} label={track.title} />)
              )}
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={5}>
          <Card raised>
            <CardContent>{context.collection.tracks[nowPlaying] ? context.collection.tracks[nowPlaying].description : "No track"}</CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <ProgressBar ref={pBar} step={snap?null:1} marks={marks} max={resolution} value={progress} valueLabelDisplay="auto" onChange={seek} />
        </Grid>
      </Grid>
      </CardContent>
    </Card>
  )
}