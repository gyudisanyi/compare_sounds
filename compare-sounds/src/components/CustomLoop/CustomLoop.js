import React,  { useState, useContext } from 'react';
import GlobalContext from '../../context/GlobalContext';
import { Slider } from '@material-ui/core';

export default function CustomLoop({resolution}) {
  const context = useContext(GlobalContext);
  const [userLoop, setUserLoop] = useState([0,200]);
  
  function changes (event, value) {
    setUserLoop(value)
  }

  return (
    <div>
      <Slider max={resolution} defaultValue={[0,resolution]} value={userLoop} onChange={changes}/>
    </div>
  )
}