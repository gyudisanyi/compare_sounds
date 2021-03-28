import React, { useEffect, useCallback, useState } from 'react';
import GlobalContext from './context/GlobalContext';
import { defaultCollection, defaultSets } from './defaults';
import Header from './components/Header/Header';
import Player from './components/Player/Player';

import './App.css';

function App() {
  
  const [URL, setURL] = useState('./');
  const [sets, changeSets] = useState(defaultSets);
  const [currentSet, changeCurrentSet] = useState(1)
  const [collection, setCollection] = useState(defaultCollection());
  const [trackNodes, setTrackNodes] = useState();

  const resetDefault = () => {
    setURL('./');
    changeSets(defaultSets);
    changeCurrentSet(1)
    setCollection(defaultCollection());
    setTrackNodes();
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const httpResponse = await fetch(`${process.env.REACT_APP_API_URL}sets/`);
        const response = await httpResponse.json();
        setURL(process.env.REACT_APP_API_URL);
        console.log("RESP", {response})
        if (response.length === 0) { resetDefault(); throw new Error("NO SETS")}
        changeSets(response);
        changeCurrentSet(response[0].idset);
      } catch (error) {
        console.log("seterror", { error })
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
        console.log("RESP2", {response})
        if (response.tracks.length === 0) { setURL(`./`); changeCurrentSet(1); setCollection(defaultCollection); throw new Error("NO TRX")}
        setCollection(response);
      } catch (error) {
        console.log("collectionerror", { error })
      }
    }
    fetchData()

  }, [currentSet]);

  const trackNodesRef = useCallback((setNode) => {
    if (!setNode) { console.log(`noNodes`); return }
    if (!setNode.children) { console.log(`noNodesChildren`); return }
    if (setNode.children.length !== collection.tracks.length) { console.log(`children updated`); return }
    const track1 = setNode.children[0];
    track1.muted = false;
    setTrackNodes(Array.from(setNode.children));
  }, [collection.tracks.length]);

  return (
    <div id="main">
      <GlobalContext.Provider value={{ trackNodes, sets, collection, changeSets, currentSet, changeCurrentSet}}>
          <Header />
          <Player />
      </GlobalContext.Provider>
      <div id="tracksload" ref={trackNodesRef}>{
        collection.tracks.map((t, i) => (
          <audio src={`${URL}audio_src/${currentSet}/${t.filename}`} key={i} id={i} muted preload="true" />
          ))}
      </div>
    </div>
  )

}

export default App;