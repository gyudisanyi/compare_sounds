import React, { useEffect, useCallback, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import generalFetch from '../../utilities/generalFetch';
import GlobalContext from '../../context/GlobalContext';
import { defaultCollection, defaultSets } from '../../defaults';
import Header from '../../components/Header/Header';
import Player from '../../components/Player/Player2';

function Sets() {

  const [url, setURL] = useState(process.env.REACT_APP_API_URL);
  const [sets, changeSets] = useState(defaultSets());
  const [collection, setCollection] = useState(defaultCollection());
  const [trackNodes, setTrackNodes] = useState();
  const entryParam = useParams().id;
  const [currentSet, changeCurrentSet] = useState(entryParam);

  const path = useHistory();

  const trackNodesRef = useCallback((setNode) => {
    console.log("Set audio nodes")
    if (!setNode) { console.log(`No nodes`); return }
    if (!setNode.children) { console.log(`No NodesChildren`); return }
    if (setNode.children.length === 0) { console.log("Empty set"); return }
    console.log(setNode.children);
    setNode.children[0].muted = false;
    const newTrackNodes = {}
    Array.from(setNode.children).forEach(node => newTrackNodes[node.id] = node);
    setTrackNodes(newTrackNodes);
    console.log("TRACK NODES SET", newTrackNodes);
  }, [collection]);

  const resetOffline = () => {
    console.log("Reset to offline");
    setURL('../');
    changeSets(defaultSets);
    setCollection(defaultCollection());
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const httpResponse = await generalFetch("sets", "GET");
        const response = await httpResponse;
        console.log(response);
        if (response.message || response.length === 0) { throw (response.message || "No SETS") }
        console.log(response);
        changeSets(response);
        const setKeys = Object.keys(response);
        if (!response[entryParam]) { changeCurrentSet(setKeys[0]); path.push(`/sets/${setKeys[0]}`);};
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
        console.log(response);
        if (!response.set) throw ({error: "no such set"});
        setCollection(response);
      } catch (error) {
        console.log("collection fetch error", { error })
      }
    }
    fetchData()

  }, [currentSet]);

  const isDefault = () => {
    if (url === '../') {return 1}
    return currentSet;
  }

  return (
      <GlobalContext.Provider value={{ trackNodes, url, sets, collection, setCollection, currentSet, changeCurrentSet }}>
        <Header />
        { trackNodes && collection.tracks
        ? <Player />
        : `Empty set: please upload stuff!`
        }
        <div id="tracksload" ref={trackNodesRef}>{
          Object.keys(collection.tracks).map((key) => (
            <audio src={`${url}audio_src/${isDefault()}/${collection.tracks[key].filename}`} key={key} id={key} muted preload="true" />
          ))
          }
        </div>
      </GlobalContext.Provider>
  )

}

export default Sets;