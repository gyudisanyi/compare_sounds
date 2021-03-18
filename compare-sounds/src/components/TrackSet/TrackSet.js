import React from 'react';
import Track from '../Track/Track';

const TrackSet = ({ set, tracksRef }) => {
  return (
    <div ref={tracksRef}>{set.map((t, i)=> (<Track track={t} key={i}/>))}</div>
  )
}

export default TrackSet