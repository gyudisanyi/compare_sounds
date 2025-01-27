import React, { useState, useCallback, useEffect } from 'react';
import { Card } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import generalFetch from '../../utilities/generalFetch';

import GlobalContext from '../../context/GlobalContext';

import Header from '../../components/Header/Header';
import Player from '../../components/Player/Player';
import SetStarter from '../../components/SetStarter/SetStarter';

export default function Set({username}) {

  const url = process.env.REACT_APP_API_URL;

  const [message, setMessage] = useState("");
  const [setData, setSetData] = useState();
  const [trackNodes, setTrackNodes] = useState();

  const setId = useParams().id;

  const trackNodesRef = useCallback((setNode) => {
    try {
    setNode.children[0].muted = false;
    const newTrackNodes = {}
    Array.from(setNode.children).forEach(node => newTrackNodes[node.id] = node);    
    setTrackNodes(newTrackNodes);
    console.log("TRACK NODES SET", newTrackNodes);
    }
    catch (error) {
      console.log(error)
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await generalFetch("sets/"+setId, "GET");
        console.log({response});
        if (response.message) {setMessage(response.message); throw (response.message)}
        const own = response.set && parseInt(response.set.user_id) === parseInt(localStorage.getItem('userid'));
        if (own) {
          response.set[`own`] = true;
        }
        if (!own && !response.set.published) {setMessage("This set is not public");}
        setSetData(response);
      } catch (error) {
        if (error.message) setMessage(error.message);
        console.log({error})
      }
    }
    fetchData();

  }, [setId])

  return (
    <>
      {setData && !message
        ?
        <GlobalContext.Provider value={{setData, trackNodes, username, }} >
          <Header />
          {setData.tracks
            ?
            <div id="tracksload" ref={trackNodesRef}>{
              Object.keys(setData.tracks).map((key) => (
            <audio src={`${url}audio_src/${setId}/${setData.tracks[key].filename}`} key={key} id={key} muted preload/>
            ))}
            </div>
          : ``
          }
          { trackNodes
            ? <Player />
            : <SetStarter setId={setId} own={setData.set.own}/>
          }

        </GlobalContext.Provider>
        : (<Card><h2>{message || `Fetching data . . . `}</h2></Card>)
      }
    </>
  )
}