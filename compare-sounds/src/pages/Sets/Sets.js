import React, { useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import GlobalContext from '../../context/GlobalContext';
import { defaultCollection, defaultSets } from '../../defaults';
import Header from '../../components/Header/Header';
import Player from '../../components/Player/Player';


function Sets() {

  const [URL, setURL] = useState('./');
  const [sets, changeSets] = useState(defaultSets);
  
  const currentSet = useParams().setId;

  const [collection, setCollection] = useState(defaultCollection());
  const [trackNodes, setTrackNodes] = useState();


  const resetDefault = () => {
    setURL('./');
    changeSets(defaultSets);
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
      } catch (error) {
        setURL('./')
        console.log("seterror", { error })
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    console.log({currentSet})
    async function fetchData() {
      try {
        const httpResponse = await fetch(`${process.env.REACT_APP_API_URL}sets/${currentSet}`);
        const response = await httpResponse.json();
        console.log("RESP2", {response})
        setCollection(response);
      } catch (error) {
        console.log("collection error", { error })
      }
    }
    fetchData()

  }, [currentSet]);

  const trackNodesRef = useCallback((setNode) => {
    if (!setNode) { console.log(`noNodes`); return }
    if (!setNode.children) { console.log(`noNodesChildren`); return }
    if (setNode.children.length === 0) {console.log("Empty settt"); return}
    if (setNode.children.length !== collection.tracks.length) { console.log(`children updated`); return }
    const track1 = setNode.children[0];
    track1.muted = false;
    setTrackNodes(Array.from(setNode.children));
  }, [collection.tracks.length]);

  return (
    <div id="main">
      <GlobalContext.Provider value={{ trackNodes, sets, collection, changeSets, currentSet}}>
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

export default Sets;