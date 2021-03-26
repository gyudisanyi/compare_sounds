import React, { useContext} from 'react'
import GlobalContext from './context/GlobalContext'

export default function Tester () {
  const context=useContext(GlobalContext)
  console.log({context})
  return (
    <></>
  )
}
