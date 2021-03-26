import React, { useState, useContext } from 'react';
import { Slider } from '@material-ui/core'

import GlobalContext from '../../context/GlobalContext';

export default function Looper () {

  const context = useContext(GlobalContext);
  
  function changeLoop({id, value}) {
    const newLoops = [...context.loops];
    console.log(newLoops);
    newLoops[id].range = value;
    context.setLoops(newLoops)
    context.setActualLoop(id);
  }

  return (
    <>
    {context.loops.map((loop, id) => (
          <div>
            <Slider
              color={id===parseInt(context.actualLoop) ? "secondary" : "primary"}
              max={context.resolution}
              value={loop.range} 
              onClick={()=>context.setActualLoop(id)}
             />
          </div>
          ))
        }

    </>
  )

}