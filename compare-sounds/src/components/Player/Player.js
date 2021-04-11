import React, { useState, useEffect, useContext, useRef } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Grid, Switch, Button, Slider, Card, CardMedia, CardContent, } from '@material-ui/core';
import { FormControl, FormControlLabel, RadioGroup, Radio, } from '@material-ui/core';
import GlobalContext from '../../context/GlobalContext';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    minHeight: 120,
    justifyContent: 'space-between'
  },
  description: {
    display: 'flex',
    flexDirection: 'column',
    width: '60%',
  },
  media: {
    width: '40%',
    backgroundPositionY: 'top',
    backgroundPositionX: 'right',
  }
})


export default function Player() {

  const context = useContext(GlobalContext);

  const classes = useStyles();

  const resolution = 1000;

  const [progress, setProgress] = useState(0);

  const [nowPlaying, setNowPlaying] = useState(Object.keys(context.collection.tracks)[0]);
  const [nodeKeys, setNodeKeys] = useState(Object.keys(context.collection.tracks));
  const [snap, setSnap] = useState(false);
  const [paused, setPaused] = useState(true);
  const [looping, setLooping] = useState(false);
  const [actualLoop, setActualLoop] = useState([10, 200])
  const [loops, setLoops] = useState([{ range: [846, 890.35], description: "Default loop" }]);
  const [marks, setMarks] = useState([{}]);
  const [grad, setGrad] = useState('');

  const pBar = useRef(null);

  const ProgressBar = withStyles({
    rail: { top: 13, height: 4, opacity: 1, backgroundImage: grad },
    track: { top: 2, height: 12, opacity: .5, color: paused ? "rgb(62, 80, 179)" : "rgb(239, 2, 88)", },
    thumb: { display: "none" },
    mark: { height: 12, top: 2, width: 5 },
    markActive: { backgroundColor: "rgb(239, 2, 88)" },
    markLabel: { transform: "translateX(0%)" },
  })(Slider);

  useEffect(() => {
    setNodeKeys(Object.keys(context.collection.tracks));
    setNowPlaying(Object.keys(context.collection.tracks)[0]);
    setPaused(true);
    if (!context.trackNodes) { console.log(`No track nodes`); return }
    setNodeKeys(Object.keys(context.collection.tracks));
    const firstNodeId = Object.keys(context.collection.tracks)[0];

    context.trackNodes[firstNodeId].addEventListener('timeupdate', ({ target }) => {
      setProgress((target.currentTime / target.duration) * resolution);
    });
    context.trackNodes[firstNodeId].addEventListener('loadeddata', () => {
      console.log("Loaded");
      setPaused(true);
    })
    context.trackNodes[firstNodeId].addEventListener('ended', () => {
      console.log("Ended");
      setPaused(true);
      nodeKeys.forEach(key => {context.trackNodes[key].currentTime = 0; context.trackNodes[key].pause()});
      setProgress(0);
    })
  }, [context.trackNodes])

  useEffect(() => {
    setLoops(Object.entries(context.collection.loops).map((loop) => ({ range: [loop[1].start, loop[1].end], description: loop[1].description })));
  }, [context.collection.loops]);

  useEffect(() => {
    console.log({loops})
    const loopstarts = loops.map((loop) => ({ value: loop.range[0], label: loop.description }))
    setGrad(rangesToGradient(loops, "rgb(62, 80, 179)", "rgb(239, 2, 88)"))
    setMarks(loopstarts);
  }, [loops]);

  useEffect(() => {
    if (!looping || !loops[0]) return;
    const loopsAhead = loops.filter((loop) => loop.range[1] > progress);
    if (!loopsAhead[0]) { setActualLoop(loops[0].range); return };
    setActualLoop(loopsAhead[0].range);
  }, [looping, loops]);

  useEffect(() => {
    if (!looping) return;
    if (progress >= actualLoop[1]) {
      nodeKeys.forEach((key) => context.trackNodes[key].currentTime = actualLoop[0] / resolution * context.trackNodes[key].duration)
    }
  }, [progress, actualLoop, looping, context.trackNodes, nodeKeys]);

  function playPause() {
    if (!context.trackNodes || !Object.entries(context.trackNodes)[0][1].duration) { console.log("No track nodes"); setPaused(true); return }
    paused
      ? Object.entries(context.trackNodes).forEach((track) => track[1].play())
      : Object.entries(context.trackNodes).forEach((track) => track[1].pause())
    setPaused(prev => !prev);
  }

  function seek(event, newValue) {
    const loopsAhead = loops.filter((loop) => loop.range[1] > newValue);
    const nextLoop = loopsAhead[0] ? loopsAhead[0].range : [0, 1000];
    if (!loopsAhead[0]) { setLooping(false) };
    setActualLoop(nextLoop);
    if (!context.trackNodes[nodeKeys[0]]) return;
    let seekSeconds = (newValue / resolution) * (context.trackNodes[nodeKeys[0]].duration);
    nodeKeys.forEach((key) => context.trackNodes[key].currentTime = seekSeconds || 0);
  }

  function switchTrack(value) {
    if (!context.trackNodes) {console.log("NO TRCKNDS"); return}
    
    context.trackNodes[nowPlaying].muted = true;
    try {
      context.trackNodes[value].muted = true;
    } catch {
      let newIndex = (nodeKeys.indexOf(nowPlaying) + 1) % nowPlaying.length;
      value = nodeKeys[newIndex];
    }
    context.trackNodes[value].muted = false;
    setNowPlaying(value);
  }

  function rangesToGradient(loops, color1 = `black`, color2 = `yellow`) {
    const pt1 = `linear-gradient(90deg, ${color1} 0%, `;
    const pt2 = loops.map((loop) =>
      `${color1} ${loop.range[0] / 10}%, ${color2} ${loop.range[0] / 10}%, 
      ${color2} ${loop.range[1] / 10}%, ${color1} ${loop.range[1] / 10}%, `);
    const pt3 = `${color1} 100%)`;
    return (pt1 + pt2.join('') + pt3);
  }

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3} justify="center">
          <Grid container xs={3} justify="space-around">
            <Button onClick={playPause} variant="contained" color={paused ? "primary" : "secondary"}>
              ►
            </Button>
            <FormControl>
              <FormControlLabel key={`loop`} control={<Switch checked={looping} onClick={() => setLooping(o => !o)} />} label="Loops" labelPlacement="end" />
              <FormControlLabel key={`snap`} control={<Switch checked={snap} onClick={() => setSnap(o => !o)} />} label="Snap" labelPlacement="end" />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl>
              <RadioGroup row aria-label="sources" name="source" value={nowPlaying}>
                {Object.keys(context.collection.tracks).map((key) =>
                  (<FormControlLabel key={key} onClick={() => switchTrack(key)} value={key} control={<Radio />} label={context.collection.tracks[key].title} />)
                )}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={5}>
            { Object.keys(context.collection.tracks).length > 0 ?
            (<Card className={classes.root} raised>
              <CardContent className={classes.description}>{context.collection.tracks[nowPlaying] ? context.collection.tracks[nowPlaying].description : "No track"}</CardContent>
              {/* <CardMedia
                className={classes.media}
                image={`${context.URL+'audio_src/'+context.collection.set.id}/img/${context.collection.tracks[nowPlaying].img_url}`}
              /> */}
            </Card>)
            :
            ``
            }
          </Grid>
          <Grid item xs={12}>
            <ProgressBar ref={pBar} step={snap ? null : 1} marks={marks} max={resolution} value={progress} valueLabelDisplay="auto" onChange={seek} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}