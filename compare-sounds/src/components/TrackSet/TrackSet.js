import React from 'react';
import TrackInfo from '../TrackInfo/TrackInfo';

const TrackSet = ({ set, tracksRef, nowPlaying }) => {
  return (
    <>
      <div ref={tracksRef}>{set.map((t, i)=> (<audio src={t[0]}/>))}</div>
    <div>{set.map((t, i)=> i === nowPlaying ? (<TrackInfo track={t} key={i}/>) : <div />)}</div>
    </>
  )
}

export default TrackSet