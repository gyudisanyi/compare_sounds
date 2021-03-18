import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ progRef }) => {

  return (
    <>
      <canvas ref={progRef} width="250" height="10"></canvas>
      {/* <input ref = {progressRef} type="range" id="seek" min="0" max={duration} value={value} step=".1" /> */}
    </>
  )
}

export default ProgressBar