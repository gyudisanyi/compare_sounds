import React, { useState, useEffect, useCallback } from 'react';
import Button from './components/Button/Button';
import TrackInfo from './components/TrackInfo/TrackInfo';
import './App.css';

const set = [
  ["./audio_src/5A.mp3", "Los Angeles original", "Excerpt from this song from Seven's travels by Atmosphere"],
  ["./audio_src/5B.mp3", "Los Angeles overdrive EQ", "Distorted as hell with EQ for comparison"],
  ["./audio_src/5A.mp3", "Los Angeles", "Excerpt from this song from Seven's travels by Atmosphere"],
  ["./audio_src/5B.mp3", "Los Angeles overdrive EQ", "Distorted as hell with EQ for comparison"],
]

function App() {

  const [trackNodes, setTrackNodes] = useState();
  const [nowPlaying, setNowPlaying] = useState(0);
  const [progressBarCtx, setProgressBarCtx] = useState();
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(true);
  const [loopBarCtx, setLoopBarCtx] = useState();
  const [looping, setLooping] = useState(false);
  const [loop, setLoop] = useState([0, 1000]);
  const [loopBarClicked, setLoopBarClicked] = useState(false);
  const [loopBarClickedValue, setLoopBarClickedValue] = useState();
  
  const loopBarRef = useCallback((setCanvas) => {
    if (!setCanvas) {console.log(`nocanvas`); return}
    const canvasCtx = setCanvas.getContext("2d");
    canvasCtx.fillStyle = '#333';
    canvasCtx.fillRect(0, 0, 300, 10);
    setLoopBarCtx(canvasCtx);
  }, []);

  const progressBarRef = useCallback((setCanvas) => {
    if (!setCanvas) {console.log(`nocanvas`); return}
    const canvasCtx = setCanvas.getContext("2d");
    canvasCtx.fillStyle = '#333';
    canvasCtx.fillRect(0, 0, 300, 10);
    setProgressBarCtx(canvasCtx);
  }, []);

  const trackNodesRef = useCallback((setNode) => {
    if (!setNode) { console.log(`ohno`); return }
    const track1 = setNode.children[0];
    track1.muted = false;
    track1.addEventListener('timeupdate', () => {
      setProgress(track1.currentTime / track1.duration * 100);
    })
    setTrackNodes(Array.from(setNode.children));
  }, []);
  
  useEffect(() => {
    if (!progressBarCtx) { console.log('whatprogresscanvas'); return }
    progressBarCtx.fillStyle = 'black';
    progressBarCtx.fillRect(0, 0, 300, 10);
    progressBarCtx.fillStyle = 'white';
    progressBarCtx.fillRect(progress*3, 0, 1, 10);

  }, [progress])
  
  useEffect(() => {
    if (!loopBarCtx) { console.log('whatcanvas'); return }
    loopBarCtx.fillStyle = 'black';
    loopBarCtx.fillRect(0, 0, 300, 10);
    loopBarCtx.fillStyle = looping ? 'yellow' : '#333';
    loopBarCtx.fillRect(loop[0] / 3.33, 0, (loop[1] - loop[0]) / 3.33, 10);
  }, [loop, looping])

  useEffect(() => {
    if (!looping) return;
    if (trackNodes[0].currentTime <= loop[0]/1000 * trackNodes[0].duration
      || trackNodes[0].currentTime >= loop[1]/1000 * trackNodes[0].duration)
      {
        trackNodes.forEach((t)=>t.currentTime = loop[0]/1000 * trackNodes[0].duration)
      }
  }, [progress, looping, loop, trackNodes])

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


  function seek(e) {
    let seekSeconds = (e.nativeEvent.offsetX / 300)*trackNodes[0].duration
    trackNodes[0].currentTime=seekSeconds;
  }

  function loopBarMouse(e) {
    setLoopBarClicked(true);
    setLoopBarClickedValue(e.nativeEvent.offsetX);
  }

  function loopBarMouseLeave(e) {
    if (!loopBarClicked) return;
    setLoopBarClicked(false);
    if (Math.abs(loopBarClickedValue - e.nativeEvent.offsetX) < 10) {
      setLooping(prev => !prev);
      return;
    };
    const newCoord = Math.max(Math.min((e.nativeEvent.offsetX * 10/3), 1000), 0);
    const newLoop = [loopBarClickedValue * 10/3, newCoord].sort((a, b) => {return a-b});
    setLoop(newLoop);
  }
  
  function switchTrack({target}) {
    console.log(target.id);
    trackNodes[nowPlaying].muted = true;
    switch (target.id) {
      case 'switch': trackNodes[(nowPlaying + 1) % trackNodes.length].muted = false;
        setNowPlaying(prev => (prev + 1) % trackNodes.length);
        break;
      default: 
        trackNodes[target.parentElement.id].muted = false;
        setNowPlaying(parseInt(target.parentElement.id))
    }
  }

  return (
    <div id="main" tabIndex="-1">
      <div id="dashboard">
        <div id="buttons">
          <Button id="play" buttonText={`►`} buttonClass={paused? "emptyButton" : ""} handleClick={playPause} />
          <Button id="loop" buttonText="Loop" buttonClass={!looping ? "emptyButton" : ""} handleClick={() => setLooping(prev => !prev)} />
          <Button id="switch" buttonText="Switch" handleClick={switchTrack} />
        </div>
        <canvas ref={progressBarRef}
        onMouseDown={seek}
        width={300} height={10} />
        <canvas ref={loopBarRef}
        onMouseDown={loopBarMouse}
        onMouseUp={loopBarMouseLeave}
        onMouseLeave={loopBarMouseLeave}        
        width={300} height={10} />
        {loopBarClicked ? `loopbar held` : `loopbar not held`}
        {` ${loop[0]} -- ${loop[1]}`}
      </div>
      <div id="tracks">
        <div id="tracksload" ref={trackNodesRef}>{set.map((t, i)=> (<audio src={t[0]} key={i} id={i} loop muted/>))}</div>
        <div onClick={switchTrack} id="tracklist">{set.map((t, i)=> (<TrackInfo track={t} key={i} id={i} active={nowPlaying === i}/>))}</div>
        <div id="trackdescr">{set[nowPlaying][2]}</div>
      </div>
    </div>
  );
}

export default App;
