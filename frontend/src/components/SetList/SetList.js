import React from 'react';
import {Grid, Button} from '@material-ui/core';
import SetListItem from './SetListItem';

export default function SetList({sets, own}) {


  return (
    <Grid container spacing = {3}>
        {sets.map((set) => (
            <Grid item xs = {6} md = {3}>
              { own ?
              <>
                <Button variant={set.published ? "contained" : "text"} color={set.published ? "secondary" : "default"}>{set.published ? "Published" : ""}</Button>
                <SetListItem set={set} own={own}/>
              </>
              : 
              <div style={{display: ! set.published || set.username === localStorage.getItem('username') ? "none" : ""}}>
                By <a href={`/${set.username}`}>{set.username}</a>
                <SetListItem set={set} own={own}/>
              </div>
              }
            </Grid>          
        ))}
    </Grid>


  )
}
