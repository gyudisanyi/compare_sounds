import React, { useEffect, useCallback, useState } from 'react';
import GlobalContext from './context/GlobalContext';
import { defaultCollection, defaultSets } from './defaults';
import Header from './components/Header/Header';
import Player from './components/Player/Player';

import './App.css';

function App() {
  
  const [URL, setURL] = useState('./');
  const [sets, changeSets] = useState(defaultSets);
  const [currentSet, changeCurrentSet] = useState()
  const [collection, setCollection] = useState(defaultCollection());
  const [trackNodes, setTrackNodes] = useState();

  const trackNodesRef = useCallback((setNode) => {
    if (!setNode) { console.log(`noNodes`); return }
    if (!setNode.children) { console.log(`noNodesChildren`); return }
    const track1 = setNode.children[0];
    track1.muted = false;
    setTrackNodes(Array.from(setNode.children));
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const httpResponse = await fetch(`${process.env.REACT_APP_API_URL}sets/`);
        const response = await httpResponse.json();
        setURL(process.env.REACT_APP_API_URL);
        changeSets(response);
        changeCurrentSet(response[0].idsets)
      } catch (error) {
        console.log({ error })
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const httpResponse = await fetch(`${process.env.REACT_APP_API_URL}sets/${currentSet}`);
        const response = await httpResponse.json();
        setURL(process.env.REACT_APP_API_URL);
        setCollection(response);
      } catch (error) {
        console.log({ error })
      }
    }
    fetchData()

  }, [currentSet]);

  return (
    <div id="main">
      <GlobalContext.Provider value={{ trackNodes, sets, collection, changeSets, currentSet, changeCurrentSet}}>
          <Header />
          <Player />
      </GlobalContext.Provider>
    <div id="tracksload" ref={trackNodesRef}>{collection.tracks.map((t, i) => (<audio src={`${URL}audio_src/${t.url}`} key={i} id={i} muted loop preload />))}</div>
    </div>
  )

}

export default App;