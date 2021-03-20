import React, { useState, useEffect, useCallback } from 'react';
import Button from './components/Button/Button';
import { Line } from 'rc-progress';
import 'rc-slider/assets/index.css';
import TrackInfo from './components/TrackInfo/TrackInfo';
import './App.css';

const set = [
  ["./audio_src/5A.mp3", "Mix 1", "Atmosphere yi"],
  ["./audio_src/5B.mp3", "Mix 2", "Slug and Ant ho"],
  ["./audio_src/3.mp3", "AAA1", "Atmosphere yi"],
  ["./audio_src/4.mp3", "AAA2", "Slug and Ant ho"],
]

function App() {

  const [trackNodes, setTrackNodes] = useState();
  const [nowPlaying, setNowPlaying] = useState(0);
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
    canvasCtx.fillStyle = 'white';
    canvasCtx.fillRect(0, 0, 300, 10);
    setLoopBarCtx(canvasCtx);
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
    if (!loopBarCtx) { console.log('whatcanvas'); return }
    
    loopBarCtx.fillStyle = 'black';
    loopBarCtx.fillRect(0, 0, 300, 10);
    loopBarCtx.fillStyle = 'yellow';
    loopBarCtx.fillRect(loop[0] / 3.33, 0, (loop[1] - loop[0]) / 3.33, 10);
  }, [loop])

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
    switch (e.nativeEvent.type) {
      case `mousedown`:
        setLoopBarClicked(prev => !prev);
        setLoopBarClickedValue(e.nativeEvent.offsetX);
        break;
      case `mouseup` || `mouseout`:
          setLoopBarClicked(false);
          setLoop([loopBarClickedValue*3.33, e.nativeEvent.offsetX*3.33]);
          break;
      default: break;
    }
  }
  
  function switchTrack(i) {
    trackNodes[nowPlaying].muted = true;
    switch (i.target.id) {
      case 'switch': trackNodes[(nowPlaying + 1) % trackNodes.length].muted = false;
        setNowPlaying(prev => (prev + 1) % trackNodes.length);
        break;
      default: trackNodes[i.target.id].muted = false;
        setNowPlaying(parseInt(i.target.id))
    }
  }

  return (
    <div id="main" tabIndex="-1">
      <div id="dashboard">
        <div id="buttons">
          <Button id="play" buttonText={!paused ? `▌▌` : `►`} handleClick={playPause} />
          <Button id="loop" buttonText="Loop" buttonClass={looping ? "emptyButton" : ""} handleClick={() => setLooping(prev => !prev)} />
          <Button id="switch" buttonText="Switch" handleClick={switchTrack} />
        </div>
        <Line strokeLinecap="square" percent={progress} strokeWidth="5" strokeColor="#ffffff" onClick={seek} />
        <canvas ref={loopBarRef}
        onMouseDown={loopBarMouse}
        onMouseUp={loopBarMouse}
        onMouseLeave={loopBarMouse}        
        width={300} height={10} />
      </div>
      <div>
        <div ref={trackNodesRef}>{set.map((t, i)=> (<audio src={t[0]} key={i} id={i} loop muted/>))}</div>
        <div onClick={switchTrack}>{set.map((t, i)=> (<TrackInfo track={t} key={i} id={i} active={nowPlaying === i}/>))}</div>
      </div>
    </div>
  );
}

export default App;
