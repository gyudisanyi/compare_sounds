import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@material-ui/core';

import generalFetch from '../../utilities/generalFetch';

import SetList from '../../components/SetList/SetList';

export default function SetsPage() {

  const [sets, getSets] = useState();
  const [message, setMessage] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await generalFetch("sets/", "GET");
        console.log({ response });
        if (response.message) setMessage(response.message);
        if (response) getSets(Object.values(response));
      } catch (error) {
        if (error.message) setMessage(error.message);
        console.log({ error })
      }
    }
    fetchData();

  }, [])

  return (
    <Card>
      <CardHeader title="Others' sets" />
      <CardContent>
        {sets
          ? <SetList sets={sets} own={false}/>
          : `${message}` || `Fetching sets...`
        }
      </CardContent>
    </Card>

  )
}