import React from 'react';

const ProgressBar = ({value, duration, progressRef}) => {
  return (
    <>
      <input ref = {progressRef} type="range" id="seek" min="0" max={duration} value={value} step=".1" />
    </>
  )
}

export default ProgressBar