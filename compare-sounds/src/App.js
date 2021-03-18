import React, { useState, useEffect, useCallback, useRef } from 'react';
import Button from './components/Button/Button';
import ProgressBar from './components/ProgressBar/ProgressBar';
import TrackSet from './components/TrackSet/TrackSet';
import './App.css';

const set = [
  ["./audio_src/5A.mp3", "Mix 1"],
  ["./audio_src/5B.mp3", "Mix 2"],
]

function App() {

  const [trackNodes, setTrackNodes] = useState();
  const [nowPlaying, setNowPlaying] = useState(0);
  const [paused, setPaused] = useState(true);
  const [looping, setLooping] = useState(false);
  const [loop, setLoop] = useState([2, 4])
  const progressBarRef = useRef(null);
  const [pbWidth, setPbWidth] = useState(250);
  const pbHeight = 20;

  const trackNodesRef = useCallback((setNode) => {
    if (!setNode) { console.log(`ohno`); return }
    console.log('ohhhhhhhhh')
    setTrackNodes(Array.from(setNode.children));
  }, []);


  useEffect(() => {
    if (trackNodes) {
      const seek = (e) => {
        console.log({ e })
        trackNodes.forEach((t) => t.currentTime = t.duration * (e.offsetX / pbWidth));
      }
      trackNodes.forEach((t) => {
        t.muted = true;
      })
      trackNodes[nowPlaying].muted = false;

      const progressBar = progressBarRef.current.getContext('2d');
      setPbWidth(progressBarRef.current.width);

      progressBar.fillStyle = 'black';
      progressBar.fillRect(0, 0, pbWidth, pbHeight);
      progressBarRef.current.addEventListener('click', (e) => seek(e))

      trackNodes[0].addEventListener('timeupdate', (e) => {
        console.log({e});
        console.log({trackNodes});
        console.log(looping, trackNodes[0].currentTime);
        if (looping) {looper()};
        progressBar.fillStyle = 'black';
        progressBar.fillRect(0, 0, pbWidth, pbHeight);
        progressBar.fillStyle = 'white';
        progressBar.fillRect(0, 0, pbWidth * trackNodes[0].currentTime / trackNodes[0].duration, pbHeight)

      });

      trackNodes[0].removeEventListener('timeupdate', ()=>{});

      const looper = () => {
        console.log(looping);
        if (trackNodes[0].currentTime <= loop[0] || trackNodes[0].currentTime >= loop[1]) {trackNodes.forEach((t)=>t.currentTime = loop[0])}
        if (!looping) {return};
      }

    }
  }, [nowPlaying, trackNodes, looping]);

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
          <Button id="loop" buttonText="Loop" buttonClass={looping ? "emptyButton" : ""} handleClick={() => setLooping(!looping)} />

          <Button id="switch" buttonText="Switch" handleClick={switchTrack} />
        </div>
        <ProgressBar progRef={progressBarRef} />
      </div>
      <div>
        <TrackSet tracksRef={trackNodesRef} set={set} nowPlaying={nowPlaying} />
      </div>
    </div>
  );
}

export default App;
