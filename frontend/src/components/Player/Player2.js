import React from 'react';
import {useContext, useState, useEffect} from 'react';
import {Card, CardContent, Grid} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import GlobalContext from '../../context/GlobalContext';
import PlayControls from './PlayControls';
import TrackDescription from './TrackDescription';
import TracksList from './TracksList';
import ProgressBar from './ProgressBar';
import LoopBar from './LoopBar';

export default function Player() {
  const context = useContext(GlobalContext);
  const {trackNodes, collection, url} = context;
  const {tracks, set} = collection;
  console.log(Object.keys(tracks)[0]);
  const [nowPlaying, setNowPlaying] = useState(Object.keys(tracks)[0]);
  const nodeKeys = Object.keys(tracks);
  const theme = useTheme();
  const bigScr = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect (() => {
    console.log("YOOO")
    setNowPlaying(Object.keys(tracks)[0])
  },[])

  console.log(nowPlaying, {tracks}, {trackNodes})

  return (
    <Card>
      { trackNodes && tracks[nowPlaying] ?
      <CardContent>
      <Grid container direction={bigScr ? 'row-reverse' : 'column'}>
        <Grid item xs={12} sm={6}><TrackDescription props={{track: tracks[nowPlaying], url, set: set.id}}/></Grid>
        <Grid item xs={12} sm={4}><TracksList props={{trackNodes, nodeKeys, tracks, nowPlaying, setNowPlaying}}/></Grid>
        <Grid item xs={12} sm={2}><PlayControls props={{trackNodes, nodeKeys, nowPlaying, bigScr}}/></Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}><ProgressBar props={{loops: ""}}/></Grid>
        <Grid item xs={12}><LoopBar /></Grid>
      </Grid>
      </CardContent>
      : `Empty set. Plz upload stuff!` }
    </Card>
  )
}