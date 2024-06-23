import React, {memo} from 'react'
import { ScaleLoader } from 'react-spinners'


const Loading = () => {
  return (
    <ScaleLoader color='#EA2027'/>
  )
}

export default memo(Loading)