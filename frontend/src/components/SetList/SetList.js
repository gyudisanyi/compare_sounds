import React from 'react';
import {Badge, Grid } from '@material-ui/core';
import SetListItem from './SetListItem';

export default function SetList({sets, own}) {

  return (
    <Grid container spacing = {3}>
        {sets.map((set) => (
            <Grid item >
              <Badge color="secondary" badgeContent={own && set.published ? "Public" : 0}>
                <SetListItem set={set} own={own}/>
              </Badge>
            </Grid>          
        ))}
        
    </Grid>


  )
}
