import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router,
  Switch,
  Route,
  useParams } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '@material-ui/core';

import generalFetch from '../../utilities/generalFetch';

import SetList from '../../components/SetList/SetList';
import Set from '../Set/Set';

export default function Users () {
  const [sets, getSets] = useState();
  const [message, setMessage] = useState();
  const entryParam = useParams().id;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await generalFetch("user/"+entryParam, "GET");
        console.log({response});
        getSets(Object.values(response.data));
        if (response.message) setMessage(response.message);
      } catch (error) {
        if (error.message) setMessage(error.message);
        console.log({error})
      }
    }
    fetchData();

  }, [entryParam])

  return (
    <Router>
    <Switch>
      <Route path={`/${entryParam}/:id`}>
        <Set username={entryParam}/>
      </Route>
      <Route path="">
        <Card>
          <CardHeader title={`${entryParam}'s sets`} subheader={localStorage.getItem('username') === entryParam ? `That's you` : ``}/>
          <CardContent>
            {sets 
              ? <SetList sets={sets}/>
              : `${message}` || `Fetching sets...`
            }
          </CardContent>
        </Card>
      </Route>
    </Switch>
    </Router>
  )
}