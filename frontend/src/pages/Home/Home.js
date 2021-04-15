import React from 'react';
import { useHistory } from 'react-router-dom';

import { Card, CardContent } from '@material-ui/core';

export default function Home () {

  const path = useHistory();
  console.log("Redirecting to a set while no home")
  //path.push('../sets/1')

  return (
      <Card>
        <CardContent>
          HOME
        </CardContent>
      </Card>
  )
}