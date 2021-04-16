import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent} from '@material-ui/core';
import { 
  useParams } from 'react-router-dom';

import generalFetch from '../../utilities/generalFetch';

export default function Set({username}) {
  const [setData, setSetData] = useState();
  const [tracksData, setTracksData] = useState();
  const [loopsData, setLoopsData] = useState();
  const [message, setMessage] = useState();
  const setId = useParams().id;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await generalFetch("sets/"+setId, "GET");
        console.log({response});
        if (response.message) setMessage(response.message);
        const { set, tracks, loops } = response;
        setSetData(set);
        setTracksData(tracks);
        setLoopsData(loops);
      } catch (error) {
        if (error.message) setMessage(error.message);
        console.log({error})
      }
    }
    fetchData();

  }, [setId])

  return (
    <Card>
      {setData
        ? <><CardHeader title={setData.title} subheader={setData.username}/ >
          {JSON.stringify(tracksData)}</>
        : `${message}` || `Fetching data . . . `
      }
    </Card>
  )
}