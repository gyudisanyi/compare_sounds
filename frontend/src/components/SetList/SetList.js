import React from 'react';
import {Grid, Button} from '@material-ui/core';
import SetListItem from './SetListItem';

export default function SetList({sets, own}) {

  console.log(sets)

  return (
    <Grid container>
        {sets.map((set) => (
            <Grid item >
              { own ?
              <Button variant={set.published ? "contained" : ""} color={set.published ? "secondary" : ""}>Publish{set.published ? "ed" : ""}</Button>
              : ``
              }
              <SetListItem set={set} own={own}/>
            </Grid>          
        ))}
    </Grid>


  )
}
