import React, { useState, useEffect, useCallback } from 'react';
import Button from './components/Button/Button';
import defaultCollection from './defaultCollection';
import TrackInfo from './components/TrackInfo/TrackInfo';
import './App.css';

function App() {
  const [URL, setURL] = useState('./');
  const [collection, setCollection] = useState(defaultCollection());
  const [trackNodes, setTrackNodes] = useState();
  const [nowPlaying, setNowPlaying] = useState(0);
  const [progressBarCtx, setProgressBarCtx] = useState();
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(true);
  const [canvasWidth, setCanvasWidth] = useState(300);
  const [loopBarCtx, setLoopBarCtx] = useState();
  const [looping, setLooping] = useState(false);
  const [loop, setLoop] = useState([0, 1000]);
  const [loopBarClicked, setLoopBarClicked] = useState(false);
  const [loopBarClickedPosition, setLoopBarClickedPosition] = useState();
  const [loopBarClickedValue, setLoopBarClickedValue] = useState();

  useEffect(() => {
    try {
      async function fetchData() {
      const httpResponse = await fetch(`${process.env.REACT_APP_API_URL}sets/1`);
      const response = await httpResponse.json();
      console.log(response);
      setURL(process.env.REACT_APP_API_URL);
      setCollection(response);
      if (!response.loops[0]) {setLoop([0, 1000]); return};
      setLoop([response.loops[0].loopstart || 0, response.loops[0].loopend || 1000])
      }
      fetchData()
    }
    catch {
      console.log(collection);
    }
  }, []);

  
  const loopBarRef = useCallback((setCanvas) => {
    if (!setCanvas) {console.log(`nocanvas`); return}
    const canvasCtx = setCanvas.getContext("2d");
    canvasCtx.fillStyle = '#333';
    canvasCtx.fillRect(0, 0, canvasWidth, 10);
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
    if (!setNode.children) { console.log(`ohnnono`); return }
    const track1 = setNode.children[0];
    track1.muted = false;
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
    if(!trackNodes) {console.log(`ejh`); return}
    console.log("TYOOFD")
    trackNodes[0].addEventListener('timeupdate', ({target}) => {
      console.log(`progresss`, target.currentTime / trackNodes[0].duration);
      setProgress((target.currentTime / trackNodes[0].duration)*1000);
    })
  }, [])

  useEffect(() => {
    if (!loopBarCtx) { console.log('whatcanvas'); return }
    loopBarCtx.fillStyle = 'black';
    loopBarCtx.fillRect(0, 0, canvasWidth, 10);
    loopBarCtx.fillStyle = looping ? 'yellow' : '#333';
    loopBarCtx.fillRect(loop[0] / (1000/canvasWidth), 0, (loop[1] - loop[0]) / (1000/canvasWidth), 10);
    loopBarCtx.beginPath();
    loopBarCtx.strokeStyle = looping ? 'red' : '#999';
    loopBarCtx.lineWidth = 4;
    loopBarCtx.moveTo(loop[0] / (1000/canvasWidth), 0);
    loopBarCtx.lineTo(loop[0] / (1000/canvasWidth), 10);
    loopBarCtx.moveTo(loop[1] / (1000/canvasWidth), 0);
    loopBarCtx.lineTo(loop[1] / (1000/canvasWidth), 10);
    loopBarCtx.stroke();
  }, [loop, looping]);

  useEffect(() => {
    console.log(`clickdragyo`, loopBarClickedValue, loopBarClickedPosition);
    if (!loopBarCtx || !loopBarClicked) { console.log('whatnooocanvas'); return }
    loopBarCtx.strokeStyle="#fff";
    loopBarCtx.lineWidth=1;
    loopBarCtx.moveTo(loopBarClickedValue, 5)
    loopBarCtx.lineTo(loopBarClickedPosition, 5);
    loopBarCtx.stroke();
  }, [loopBarClickedValue, loopBarClickedPosition])

  useEffect(() => {
    if (!looping) return;
    if (trackNodes[0].currentTime <= loop[0]/1000*trackNodes[0].duration
      || trackNodes[0].currentTime >= loop[1]/1000*trackNodes[0].duration)
      {
        trackNodes.forEach((t)=>t.currentTime = loop[0]/1000*trackNodes[0].duration)
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


  function seek({nativeEvent}) {
    let seekSeconds = (nativeEvent.offsetX / canvasWidth) * (trackNodes[0].duration)
    console.log({seekSeconds})
    if(!seekSeconds) return;
    trackNodes[0].currentTime = seekSeconds;
  }

  function loopBarMouseMove({nativeEvent}) {
    if(!loopBarClicked) return;
    console.log('somewhere over the loopbar', nativeEvent.offsetX)
    setLoopBarClickedPosition(nativeEvent.offsetX);
  }

  function loopBarMouseClick({nativeEvent}) {
    setLoopBarClicked(true);
    setLoopBarClickedPosition(nativeEvent.offsetX);
    setLoopBarClickedValue(nativeEvent.offsetX);
  }

  function loopBarMouseLeave({nativeEvent}) {
    if (!loopBarClicked) return;
    setLoopBarClicked(false);
    if (Math.abs(loopBarClickedValue - nativeEvent.offsetX) < 10) {
      setLooping(prev => !prev);
      return;
    };
    const newCoord = Math.max(Math.min((nativeEvent.offsetX / canvasWidth) * canvasWidth, canvasWidth), 0);
    console.log("clkval", newCoord/canvasWidth)
    const newLoop = [(loopBarClickedValue / canvasWidth) * 1000, (newCoord / canvasWidth) * 1000].sort((a, b) => {return a - b});
    console.log(newLoop)
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
        onMouseMove={loopBarMouseMove}
        onMouseDown={loopBarMouseClick}
        onMouseUp={loopBarMouseLeave}
        onMouseLeave={loopBarMouseLeave}        
        width={canvasWidth} height={10} />
      </div>
      {collection.set.title}
      <div id="tracks">
        <div id="tracksload" ref={trackNodesRef}>{collection.tracks.map((t, i)=> (<audio src={`${URL}audio_src/${t.url}`} key={i} id={i} loop muted/>))}</div>
        <div onClick={switchTrack} id="tracklist">{collection.tracks.map((t, i)=> (<TrackInfo track={t} key={i} id={i} active={nowPlaying === i}/>))}</div>
        <div id="trackdescr">{collection.tracks[nowPlaying].description}</div>
      </div>
    </div>
  );
}

export default App;
