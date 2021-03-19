import React, { useState, useEffect, useCallback, useRef } from 'react';
import Button from './components/Button/Button';
import { Line } from 'rc-progress';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import TrackSet from './components/TrackSet/TrackSet';
import './App.css';

const set = [
  ["./audio_src/5A.mp3", "Mix 1"],
  ["./audio_src/5B.mp3", "Mix 2"],
]

const context = new AudioContext();

function App() {

  const [trackNodes, setTrackNodes] = useState();
  const [nowPlaying, setNowPlaying] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(true);
  const [looping, setLooping] = useState(false);
  const [loop, setLoop] = useState([0, 1000])

  const trackNodesRef = useCallback((setNode) => {
    if (!setNode) { console.log(`ohno`); return }
    console.log('ohhhhhhhhh')
    setTrackNodes(Array.from(setNode.children));
  }, []);


  useEffect(() => {
    if (!trackNodes) return;
    console.log("FFXXX")
    // const buffers = trackNodes.map((t) => context.createBufferSource(t));
    // console.log(buffers)
    trackNodes[0].addEventListener('timeupdate', () => {
      if (trackNodes[0].currentTime <= loop[0]/1000 * trackNodes[0].duration || trackNodes[0].currentTime >= loop[1]/1000 * trackNodes[0].duration) {trackNodes.forEach((t)=>t.currentTime = loop[0]/1000 * trackNodes[0].duration)}
      setProgress(trackNodes[0].currentTime / trackNodes[0].duration * 100);
    })

  }, [trackNodes, loop])

  useEffect(() => {
    console.log("loop y es tu")
  }, [loop])

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
    console.log("seekeer")
    console.log(e.nativeEvent.offsetX);
    console.log({ e });
    let seekSeconds = (e.nativeEvent.offsetX / 300)*trackNodes[0].duration
    console.log(seekSeconds);
    trackNodes[0].currentTime=seekSeconds;

  }
  
  function switchTrack() {
    setNowPlaying(prev => (prev + 1) % trackNodes.length);
    trackNodes.forEach((t) => {
      t.muted = true;
    });
    trackNodes[nowPlaying].muted = false;
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
        <Range
          min={0}
          max={1000}
          defaultValue={[0, 1000]}
          onChange={(e)=>setLoop(e)}
          />
      </div>
      <div>
        <TrackSet tracksRef={trackNodesRef} set={set} nowPlaying={nowPlaying} />
      </div>
    </div>
  );
}

export default App;
