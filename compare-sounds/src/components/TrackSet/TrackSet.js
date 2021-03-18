import React from 'react';
import TrackInfo from '../TrackInfo/TrackInfo';

const TrackSet = ({ set, tracksRef, nowPlaying }) => {
  return (
    <>
      <div ref={tracksRef}>{set.map((t, i)=> (<audio src={t[0]}/>))}</div>
    <div>{set.map((t, i)=> (<TrackInfo track={t} key={i} id={i} active={nowPlaying === i}/>))}</div>
    </>
  )
}

export default TrackSet