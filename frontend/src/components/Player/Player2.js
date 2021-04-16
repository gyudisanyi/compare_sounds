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

export default function Player() {
  const context = useContext(GlobalContext);
  const url = process.env.REACT_APP_API_URL;
  const { trackNodes } = context;
  const { tracks, set } = context.setData;
  const [nowPlaying, setNowPlaying] = useState();
  const nodeKeys = Object.keys(tracks);
  const theme = useTheme();
  const bigScr = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect (() => {
    try {
      setNowPlaying(Object.keys(tracks)[0])
    } catch {
      console.log("NO TRX")
    }
  },[])

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
        <Grid item xs={12}><ProgressBar /></Grid>
      </Grid>
      </CardContent>
      : `tracks pliz` }
    </Card>
  )
}