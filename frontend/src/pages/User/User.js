import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Button, Card, CardHeader, CardContent } from '@material-ui/core';

import generalFetch from '../../utilities/generalFetch';

import SetList from '../../components/SetList/SetList';

export default function Users() {

  const [sets, getSets] = useState();
  const [message, setMessage] = useState();

  const entryParam = useParams().id;
  const path = useHistory();


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await generalFetch("user/" + entryParam, "GET");
        console.log({ response });
        if (response.message) setMessage(response.message);
        if (response.data) getSets(Object.values(response.data));
      } catch (error) {
        if (error.message) setMessage(error.message);
        console.log({ error })
      }
    }
    fetchData();

  }, [entryParam])

  const newSet = async () => {
    const res = await generalFetch("sets/new", "POST");
    path.push(`/sets/${res.newSetId}`);
  }

  return (
    <Card>
      <CardHeader title={`${entryParam}'s sets`} subheader={localStorage.getItem('username') === entryParam ? `That's you` : ``} />
      <CardContent>
      {localStorage.getItem('username') === entryParam 
        ? <Button id="addset" variant="contained" color="primary" onClick={newSet}>Add new set</Button>
        : ``}
        {sets
          ? <SetList sets={sets} own={localStorage.getItem('username') === entryParam}/>
          : `${message}` || `Fetching sets...`
        }
      </CardContent>
    </Card>

  )
}