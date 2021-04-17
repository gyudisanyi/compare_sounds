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
  
  const allTracks = Object.values(trackNodes);

  const { tracks, set } = context.setData;
  const { duration } = set;
  const first = Object.keys(tracks)[0];
  
  const [paused, setPaused] = useState(true);
  const [progress, setProgress] = useState(0);
  const [nowPlaying, setNowPlaying] = useState();
  const nodeKeys = Object.keys(tracks);
  const resolution = 1000;
  const theme = useTheme();
  const bigScr = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect (() => {
    try {
      setNowPlaying(first);
      trackNodes[first].addEventListener('timeupdate', (({ target }) => {
        setProgress((target.currentTime / duration) * resolution);
      }));
      trackNodes[first].addEventListener('loadeddata', () => {
        setPaused(true);
      });
    } catch (error) {
      console.log(error || "NO TRX")
    }
  }, [])
  
  
  useEffect (() => {
    try {
      if (progress >= resolution) {
        allTracks.forEach(t => {t.currentTime=0.01; t.pause()});
        setProgress(0.01);
        setPaused(true);
      }
    } catch (error) {
      console.log(error || "NO TRX")
    }
  }, [progress])

  return (
    <Card>
      { trackNodes && tracks[nowPlaying] ?
      <CardContent>
      <Grid container direction={bigScr ? 'row-reverse' : 'column'}>
        <Grid item xs={12} sm={6}><TrackDescription props={{track: tracks[nowPlaying], url, set: set.id}}/></Grid>
        <Grid item xs={12} sm={4}><TracksList props={{trackNodes, nodeKeys, tracks, nowPlaying, setNowPlaying}}/></Grid>
        <Grid item xs={12} sm={2}><PlayControls props={{trackNodes, nodeKeys, nowPlaying, bigScr, paused, setPaused}}/></Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}><ProgressBar props={{progress, resolution}}/></Grid>
      </Grid>
      </CardContent>
      : `tracks pliz` }
    </Card>
  )
}