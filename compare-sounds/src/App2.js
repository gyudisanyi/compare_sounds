import React, { useState, useEffect, useCallback } from 'react';
import Button from './components/Button/Button';
import { Line } from 'rc-progress';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
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
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(true);
  const [looping, setLooping] = useState(false);
  const [loop, setLoop] = useState([0, 1000])

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
  
  function switchTrack(i) {
    console.log(i);
    trackNodes[nowPlaying].muted = true;
    trackNodes[(nowPlaying + 1) % trackNodes.length].muted = false;
    setNowPlaying(prev => (prev + 1) % trackNodes.length);
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
        <Range
          min={0}
          max={1000}
          defaultValue={[0, 1000]}
          onChange={(e)=>setLoop(e)}
          />
      </div>
      <div id="tracks">
        <div id="tracksload" ref={trackNodesRef}>{set.map((t, i)=> (<audio src={t[0]} key={i} id={i} loop muted/>))}</div>
        <div id="tracklist">{set.map((t, i)=> (<TrackInfo handleClick={switchTrack} track={t} key={i} id={i} active={nowPlaying === i}/>))}</div>
        <div id="trackdescr">{set[nowPlaying][2]}</div>
      </div>
    </div>
  );
}

export default App;
