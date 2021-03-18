import React from 'react';
import './TrackInfo.css';

const TrackInfo = ({ track, id, active }) => {
  
  return (
    <div className={active ? "active" : "inactive"}>
      <span>{id + 1}</span>
      {track[1]}
    </div>

  )
}

export default TrackInfo;