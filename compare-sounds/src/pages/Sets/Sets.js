import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import GlobalContext from '../../context/GlobalContext';
import { defaultCollection, defaultSets } from '../../defaults';
import Header from '../../components/Header/Header';
import Player from '../../components/Player/Player';

function Sets() {

  const [URL, setURL] = useState(process.env.REACT_APP_API_URL);
  const [sets, changeSets] = useState(defaultSets());
  const [collection, setCollection] = useState(defaultCollection());
  const [trackNodes, setTrackNodes] = useState();
  const entryParam = useParams().setId;
  const [currentSet, changeCurrentSet] = useState(entryParam);

  const trackNodesRef = useCallback((setNode) => {
    console.log("YPPPPPPPPPPP")
    if (!setNode) { console.log(`no Nodes`); return }
    if (!setNode.children) { console.log(`no NodesChildren`); return }
    if (setNode.children.length === 0) { console.log("Empty set"); return }
    if (setNode.children.length !== collection.tracks.length) { console.log(`children updated`); return }
    setNode.children[0].muted = false;
    setTrackNodes(Array.from(setNode.children));
  }, [collection]);

  const resetDefault = () => {
    console.log("RESETTTTT")
    setURL('../');
    changeSets(defaultSets);
    setCollection(defaultCollection());
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const httpResponse = await fetch(`${URL}sets/`);
        const response = await httpResponse.json();
        console.log("RESP", { response })
        if (response.length === 0) { resetDefault(); throw new Error("No SETS") }
        changeSets(response);
        changeCurrentSet(response[0].id);
      } catch (error) {
        console.log("sets fetch error", { error })
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const httpResponse = await fetch(`${URL}sets/${currentSet}`);
        const response = await httpResponse.json();
        if (!response.set) throw new Error("no such set");
        console.log({response});
        setCollection(response);
      } catch (error) {
        resetDefault();
        console.log("collection fetch error", { error })
      }
    }
    fetchData()

  }, [currentSet]);

  const isDefault = () => {
    console.log(URL === '../');
    console.log({trackNodes})
    if (URL === '../') {return 1}
    return currentSet;
  }

  return (
    <div id="main">
      <GlobalContext.Provider value={{ trackNodes, URL, sets, collection, currentSet, changeCurrentSet }}>
        <Header />
        <Player />
      </GlobalContext.Provider>
        <div id="tracksload" ref={trackNodesRef}>{
          collection.tracks.map((t, i) => (
            <audio src={`${URL}audio_src/${isDefault()}/${t.filename}`} key={i} id={i} muted preload="true" />
          ))}
        </div>
    </div>
  )

}

export default Sets;