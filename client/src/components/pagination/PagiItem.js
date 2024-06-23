import React, {useEffect, useState, memo} from 'react'
import clsx from 'clsx'
import { useSearchParams, useNavigate, createSearchParams, useLocation } from 'react-router-dom'

const PagiItem = ({children}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  // console.log(params.get('page'))

  const handlePagination = () => {
    // let param = [];
    // // entries tạo các cặp key/value của 1 object thành mảng lồng vào nhau 
    // for (let i of params.entries()) param.push(i)
    // const queries = {}
    // for(let i of param) queries[i[0]] = i[1]
    const queries = Object.fromEntries([...params])
    if(Number(children)) {
      queries.page = children
      navigate({
        pathname: location.pathname,
        search: createSearchParams(queries).toString()
      })
    }
  }

  return (
    <button className={clsx('w-10 h-10 flex justify-center',
      !Number(children) && 'items-end pb-2', 
      Number(children) && 'items-center hover:rounded-full hover:bg-gray-300',
      +params.get('page') === +children && 'rounded-full bg-gray-400',
      !+params.get('page') && +children === 1 && 'rounded-full bg-gray-400'
    )}
      onClick={handlePagination}  
      type='button'
      disabled={!Number(children)}
    >
        {children}
    </button>
  )
}

export default memo(PagiItem)