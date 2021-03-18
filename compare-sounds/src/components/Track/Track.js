import React from 'react'

const Track = ({track}) => {

  return (
      <audio src={track[0]} />
  )
}

export default Track;