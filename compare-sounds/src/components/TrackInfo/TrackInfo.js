import React from 'react';

const TrackInfo = ({ track, id, active }) => {
  return (
    <div id={id} className={active ? "active" : "inactive"}>
      <span className="number">{id + 1}</span>
      <span className="title">{track.title}</span>
    </div>
  )
}

export default TrackInfo;