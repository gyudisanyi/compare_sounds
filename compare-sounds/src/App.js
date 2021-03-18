import React, { useState, useEffect, useRef } from 'react';
import Button from './components/Button/Button';
import ProgressBar from './components/ProgressBar/ProgressBar';
import TrackSet from './components/TrackSet/TrackSet';
import './App.css';

const set = [
  ["./audio_src/1.wav", "Mix 1"],
  ["./audio_src/2.wav", "Mix 2"],
  ["./audio_src/3.mp3", "Adam and the Ants 1"],
  ["./audio_src/4.mp3", "Adam and the Ants 2"],
]


function App() {

const [trackNodes, setTrackNodes] = useState([]);
  
const tracksRef = useRef(null);

useEffect(() => {
  
  setTrackNodes(Array.from(tracksRef.current.children));
  console.log(trackNodes);
  trackNodes.forEach((children, idx) => {
    console.log(children, idx);
    })
  //setTrackNodes(document.querySelectorAll('audio'));
  }, [])

  const playPause = (e) => {
    console.log(e.target);
    console.log(trackNodes[0]);
    trackNodes[0].play();
  }

  return (
    <div id="main" tabIndex="-1">
      <div id="dashboard">
        <div id="buttons">
          <Button id = "play" buttonText="Play/Pause" handleClick = {playPause} />
          <Button id = "loop" buttonText="Loop part" handleClick = {playPause} />
          <Button id = "switch" buttonText="Switch input" handleClick = {playPause} />
        </div>
        <ProgressBar />
      </div>
      <div>
        <TrackSet tracksRef={tracksRef} set={set}/>
      </div>
    </div>
  );
}

export default App;
