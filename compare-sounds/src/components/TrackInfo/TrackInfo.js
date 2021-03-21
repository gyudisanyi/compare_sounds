import React from 'react';

const TrackInfo = ({ track, id, active }) => {
  return (
<<<<<<< HEAD
<<<<<<< HEAD
    <div className={active ? "active" : "inactive"} id={id}>
      <span>{id + 1}</span>
      {track[1]}
=======
    <div className={active ? "active" : "inactive"}>
=======
    <div id={id} className={active ? "active" : "inactive"}>
>>>>>>> 8a05afe (Loopbar replaced rc-range. tracklist functionality remade.)
      <span className="number">{id + 1}</span>
      <span className="title">{track[1]}</span>
>>>>>>> e5a491d (Layout combing)
    </div>

  )
}

export default TrackInfo;