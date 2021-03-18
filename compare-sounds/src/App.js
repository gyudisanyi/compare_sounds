import React, { useState, useEffect, useCallback, useRef } from 'react';
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


  const [trackNodes, setTrackNodes] = useState();
  const [nowPlaying, setNowPlaying] = useState(0);
  const [duration, setDuration] = useState(60);
  const [position, setPosition] = useState(0)
  const [paused, setPaused] = useState(true);
  const progressBarRef = useRef(null);

  const trackNodesRef = useCallback((setNode) => {
    if (!setNode) {console.log(`ohno`); return}
    console.log(`ohh`)
    setTrackNodes(Array.from(setNode.children));
  }, []);
  
  useEffect(() => {
    if (trackNodes) {
      trackNodes.forEach((t) => {
        t.muted = true;
      })
      trackNodes[nowPlaying].muted = false;
      trackNodes[0].addEventListener('timeupdate', function(){
      progressBarRef.current.value = trackNodes[0].currentTime;
      // if (loopSegment) {
      //   if (audioElement1.currentTime <= loopStart) {audioElement1.currentTime = audioElement2.currentTime = loopStart}
      //   if (audioElement1.currentTime >= loopEnd) {audioElement1.currentTime = audioElement2.currentTime = loopStart}
      // }
      });
    }
  }, [trackNodes, nowPlaying]);

  const playPause = () => {
    paused ?
      trackNodes.forEach((t) => {
        t.play();
      })
      :
      trackNodes.forEach((t) => {
        t.pause();
      });
    setPaused(!paused)
  }

  const switchTrack = () => {
    setNowPlaying(n => (n + 1) % trackNodes.length);
    trackNodes.forEach((t) => {
      t.muted = true;
    })
    trackNodes[nowPlaying].muted = false;
  }

  return (
    <div id="main" tabIndex="-1">
      <div id="dashboard">
        <div id="buttons">
          <Button id="play" buttonText={!paused ? `▌▌` : `►`} handleClick={playPause} />
          <Button id="loop" buttonText="Loop" handleClick={playPause} />
          <Button id="switch" buttonText="Switch" handleClick={switchTrack} />
        </div>
        <ProgressBar progressRef={progressBarRef} duration={duration} value={position}/>
      </div>
      <div>
        <TrackSet tracksRef={trackNodesRef} set={set} nowPlaying={nowPlaying}/>
      </div>
    </div>
  );
}

export default App;
