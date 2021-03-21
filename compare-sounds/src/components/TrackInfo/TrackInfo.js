import React from 'react';

const TrackInfo = ({ track, id, active }) => {
  return (
    <div className={active ? "active" : "inactive"}>
      <span className="number">{id + 1}</span>
      <span className="title">{track[1]}</span>
    </div>

  )
}

export default TrackInfo;