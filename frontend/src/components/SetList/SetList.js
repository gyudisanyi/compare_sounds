import React from 'react';
import {Badge, Grid } from '@material-ui/core';
import SetListItem from './SetListItem';


export default function SetList({sets, own}) {

  return (
    <Grid container spacing = {3}>
        {sets.map((set) => (
          own || set.published ?
            <Grid item xs={12} md={3} key={set.id}>
              <Badge color="secondary" badgeContent={own && set.published ? "Public" : 0}>
                <SetListItem set={set} own={own}/>
              </Badge>
            </Grid>
          : ``
        ))}
        
    </Grid>


  )
}
