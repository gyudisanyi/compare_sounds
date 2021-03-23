import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Button, ButtonGroup, Select, MenuItem, Slider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { defaultCollection, defaultSets } from './defaults';
import TrackInfo from './components/TrackInfo/TrackInfo';
import './App.css';

const ProgressBar = withStyles({
  rail: {height: 12,},
  track: {height: 12,},
  thumb: {display: "none",}
})(Slider);

function App() {

  const [URL, setURL] = useState('./');
  const resolution = 1000;
  const [collection, setCollection] = useState(defaultCollection());
  const [trackNodes, setTrackNodes] = useState();
  const [nowPlaying, setNowPlaying] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(true);
  const [looping, setLooping] = useState(false);
  const [loops, setLoops] = useState([{range: [846, 890.35], description: "Default loop"}]);
  const [originalLoops, setOriginalLoops] = useState()
  const [actualLoop, setActualLoop] = useState(loops.length-1);
  

  useEffect(() => {

    async function fetchData() {
      try {
        const httpResponse = await fetch(`${process.env.REACT_APP_API_URL}sets/1`);
        const response = await httpResponse.json();
        setURL(process.env.REACT_APP_API_URL);
        setCollection(response);
        if (!response.loops[0]) {setLoops([{range: [0, resolution], description: "Loop"}]); return};
        const newLoops = Object.values(response.loops).map((loop) => ({range: [loop.loopstart, loop.loopend], description: loop.description}))
        setLoops(newLoops);
        setOriginalLoops(newLoops);
      } catch {

      }
    }
    fetchData()

  }, []);

  const trackNodesRef = useCallback((setNode) => {
    if (!setNode) { console.log(`noNodes`); return }
    if (!setNode.children) { console.log(`noNodesChildren`); return }
    const track1 = setNode.children[0];
    track1.muted = false;
    setTrackNodes(Array.from(setNode.children));
  }, []);
  
  useEffect(() => {
    if(!trackNodes) {console.log(`No track nodes`); return}
    console.log("Track nodes loaded", trackNodes[0].duration);
    trackNodes[0].addEventListener('timeupdate', ({target}) => {
      setProgress((target.currentTime / target.duration)*resolution);
    })
  }, [trackNodes])

  useEffect(() => {
    if (!looping) return;
    console.log(loops[actualLoop].range || loops, actualLoop)
    if (progress <= loops[actualLoop].range[0] || progress >= loops[actualLoop].range[1])
      { trackNodes.forEach((t)=>t.currentTime = loops[actualLoop].range[0]/resolution*trackNodes[0].duration)
      }
  }, [progress, looping, loops, trackNodes, actualLoop])

  function playPause() {
    paused ?
      trackNodes.forEach((t) => {
        t.play();
      })
      :
      trackNodes.forEach((t) => {
        t.pause();
      });
    setPaused(prev => !prev);
  }

  function changeLoop({id, value}) {
    const newLoops = [...loops];
    newLoops[id].range = value;
    setLoops(newLoops)
    setActualLoop(id);
  }

  function prevLoop() {
    if (actualLoop===0) {setActualLoop(loops.length-1); return}
    setActualLoop(prev => (prev-1)%loops.length)
  }

  function nextLoop() {
    
    setActualLoop(prev => (prev+1)%loops.length)
  }

  function resetLoop(id) {
    const newLoops = [...loops];
    newLoops[id].range = originalLoops[id].range;
    setActualLoop(originalLoops[id]);
  }

  function seek(event, newValue) {
    let seekSeconds = (newValue/resolution) * (trackNodes[0].duration)
    trackNodes[0].currentTime = seekSeconds;
  }

  function switchTrack({target}) {
    console.log(target.parentElement.id);
    trackNodes[nowPlaying].muted = true;
    switch (target.parentElement.id) {
      case 'switch': trackNodes[(nowPlaying + 1) % trackNodes.length].muted = false;
        setNowPlaying(prev => parseInt((prev + 1) % trackNodes.length));
        break;
      default: 
        trackNodes[target.parentElement.id].muted = false;
        setNowPlaying(parseInt(target.parentElement.id))
    }
  }
  return (
    <div id="main" tabIndex="-1">
      <div id="dashboard">
      <Grid container spacing={3} justify="left">
        <Grid item>
          <Button 
          variant="contained"
          color={paused?"primary":"secondary"}
          onClick={playPause}
          >
          ►
         </Button>
        </Grid>
        <Grid item>
          <ButtonGroup>
            <Button onClick={prevLoop}>{`<`}</Button>
            <Button 
              variant="contained" color={!looping?"primary":"secondary"}
              onClick={() => setLooping(prev => !prev)}>
              Loop
            </Button>
            <Button onClick={nextLoop}>{`>`}</Button>
          </ButtonGroup>
        </Grid>
        <Grid item>
          <Button id="switch" variant="contained" color="primary" onClick={switchTrack}>
          Switch
         </Button>
        </Grid>        
      </Grid>
      <Button variant="text" color="primary">{collection.set.title}</Button>
        <ProgressBar
          max={resolution}
          value={progress}
          onChange={seek}
        />
        {loops.map((loop, id) => (
          <div>
            <Button variant="text" color={id===parseInt(actualLoop)?"secondary":"primary"} onClick={()=>setActualLoop(id)}>{loop.description}</Button>
            <Slider
              color={id===parseInt(actualLoop) ? "secondary" : "primary"}
              max={resolution}
              value={loop.range} 
              onChange={(event, newValue) => {
              event.target.id = id;
              event.target.value = newValue;
              changeLoop(event.target)}
            } />
          </div>
          ))
        }
      </div>
      <div id="tracks">
        <div id="tracksload" ref={trackNodesRef}>{collection.tracks.map((t, i)=> (<audio src={`${URL}audio_src/${t.url}`} key={i} id={i} loop muted/>))}</div>
        <div onClick={switchTrack} id="tracklist">{collection.tracks.map((t, i)=> (<TrackInfo track={t} key={i} id={i} active={nowPlaying === i}/>))}</div>
        <div id="trackdescr">{collection.tracks[nowPlaying].description}</div>
      </div>
    </div>
  );
}

export default App;
