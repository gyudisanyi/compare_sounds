import React from 'react';
import {Grid, Button} from '@material-ui/core';
import SetListItem from './SetListItem';

export default function SetList({sets, own}) {

  return (
    <Grid container spacing = {3}>
        {sets.map((set) => (
            <Grid item >
              { own ?
              <Button variant={set.published ? "contained" : "text"} color={set.published ? "secondary" : "default"}>Publish{set.published ? "ed" : ""}</Button>
              : ``
              }
              {set.published || own ? <SetListItem set={set} own={own}/> : ``}
            </Grid>          
        ))}
    </Grid>


  )
}
