import React, { useEffect, useCallback, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import generalFetch from '../../utilities/generalFetch';
import GlobalContext from '../../context/GlobalContext';
import { defaultCollection, defaultSets } from '../../defaults';
import Header from '../../components/Header/Header';
import Player from '../../components/Player/Player';

function Sets() {

  const [URL, setURL] = useState(process.env.REACT_APP_API_URL);
  const [sets, changeSets] = useState(defaultSets());
  const [collection, setCollection] = useState(defaultCollection());
  const [trackNodes, setTrackNodes] = useState();
  const entryParam = useParams().id;
  const [currentSet, changeCurrentSet] = useState(entryParam);

  const path=useHistory();

  const trackNodesRef = useCallback((setNode) => {
    console.log("Set audio nodes")
    if (!setNode) { console.log(`No nodes`); return }
    if (!setNode.children) { console.log(`No NodesChildren`); return }
    if (setNode.children.length === 0) { console.log("Empty set"); return }
    if (setNode.children.length !== collection.tracks.length) { console.log(`children updated`); return }
    setNode.children[0].muted = false;
    setTrackNodes(Array.from(setNode.children));
    console.log("TRACK NODES SET", setNode.children);
  }, [collection]);

  const resetOffline = () => {
    console.log("Reset to offline")
    setURL('../');
    changeSets(defaultSets);
    setCollection(defaultCollection());
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const httpResponse = await generalFetch("sets", "GET");
        const response = await httpResponse;
        console.log("RESP", { response })
        if (response.length === 0) { throw new Error("No SETS") }
        changeSets(response);
        if (!response.map((set)=>''+set.id).includes(entryParam)) {console.log(currentSet, entryParam, "CHANGE TO", response[0].id, response.map((set)=>set.id)); changeCurrentSet(response[0].id); path.push(`/sets/${response[0].id}`);};
      } catch (error) {
        resetOffline();
        console.log("sets fetch error", { error })
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const httpResponse = await generalFetch(`sets/${currentSet}`, "GET");
        const response = await httpResponse;
        console.log("YIUYIUYIUYIUYI", {response});
        if (!response.set) throw new Error("no such set");
        setCollection(response);
      } catch (error) {
        console.log("collection fetch error", { error })
      }
    }
    fetchData()

  }, [currentSet]);

  const isDefault = () => {
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