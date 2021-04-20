import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardContent } from '@material-ui/core';

import generalFetch from '../../utilities/generalFetch';

export default function UsersPage() {

  const [users, getUsers] = useState();
  const [message, setMessage] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await generalFetch("users/", "GET");
        console.log({response});
        if (response.message) setMessage(response.message);
        if (response) getUsers(response.data);
      } catch (error) {
        if (error.message) setMessage(error.message);
        console.log({ error })
      }
    }
    fetchData();

  }, [])

  return (
    <Card>
      <CardHeader title="Users who have published" />
      <CardContent>
        {users
          ? <ul>
          {users.map(user => <li><a href={`/${user.username}`}>{user.username} </a> with {user.published_sets} sets.</li>)}
          </ul>
          : `${message}` || `Fetching sets...`
        }
      </CardContent>
    </Card>

  )
}