import React, { useState, useEffect, useCallback } from 'react';
import Button from './components/Button/Button';
import { Line } from 'rc-progress';
import 'rc-slider/assets/index.css';
import defaultCollection from './defaultCollection';
import TrackInfo from './components/TrackInfo/TrackInfo';
import './App.css';

function App() {
  const [collection, setCollection] = useState(defaultCollection());
  const [trackNodes, setTrackNodes] = useState();
  const [nowPlaying, setNowPlaying] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(true);
  const [loopBarCtx, setLoopBarCtx] = useState();
  const [looping, setLooping] = useState(false);
  const [loop, setLoop] = useState([0, 1000]);
  const [loopBarClicked, setLoopBarClicked] = useState(false);
  const [loopBarClickedValue, setLoopBarClickedValue] = useState();

  useEffect(() => {
    async function fetchData() {
    const httpResponse = await fetch(`${process.env.REACT_APP_API_URL}sets/3`);
    const response = await httpResponse.json();
    console.log(response);
    setCollection(response);
    if (!response.loops[0]) {setLoop([0, 1000]); return};
    setLoop([response.loops[0].loopstart || 0, response.loops[0].loopend || 1000])
    }
    fetchData()
  }, []);

  
  const loopBarRef = useCallback((setCanvas) => {
    if (!setCanvas) {console.log(`nocanvas`); return}
    const canvasCtx = setCanvas.getContext("2d");
    canvasCtx.fillStyle = '#333';
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
        <Line strokeLinecap="square" percent={progress} strokeWidth="5" strokeColor="#ffffff" onClick={seek} />
        <canvas ref={loopBarRef}
        onMouseDown={loopBarMouse}
        onMouseUp={loopBarMouseLeave}
        onMouseLeave={loopBarMouseLeave}        
        width={300} height={10} />
        {loopBarClicked ? `loopbar held` : `loopbar not held`}
        {` ${loop[0]} -- ${loop[1]}`}
      </div>
      {collection.name}
      <div id="tracks">
        <div id="tracksload" ref={trackNodesRef}>{collection.tracks.map((t, i)=> (<audio src={`${process.env.REACT_APP_API_URL}audio_src/${t.url}`} key={i} id={i} loop muted/>))}</div>
        <div onClick={switchTrack} id="tracklist">{collection.tracks.map((t, i)=> (<TrackInfo track={t} key={i} id={i} active={nowPlaying === i}/>))}</div>
        <div id="trackdescr">{collection.tracks[nowPlaying].description}</div>
      </div>
    </div>
  );
}

export default App;
