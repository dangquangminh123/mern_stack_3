import React, { useEffect, useState, memo } from 'react'
import usePagination from 'hooks/usePagination'
import PagiItem from './PagiItem'
import { useSearchParams } from 'react-router-dom'



const Pagination = ({totalCount, paginaType}) => {
  const [params] = useSearchParams()
  const pagination = usePagination(totalCount, +params.get('page') || 1, paginaType)

  const range = () => {
    const currentPage = +params.get('page')
    // const pageSize = +process.env.REACT_APP_PRODUCT || 12
    const pageSize =paginaType || 12
    const start = Math.min(((currentPage - 1) * pageSize) + 1, totalCount)
    const end = Math.min(currentPage * pageSize, totalCount)

    return `${start} - ${end}`
  }


  // console.log(usePagination(78, 3))


  return (
    <div className='flex w-full items-center justify-between'>
      {!+params.get('page') ? <span className='text-sm italic'>
        {`Show products ${Math.min(totalCount, 1)} - ${Math.min(+process.env.REACT_APP_PRODUCT, totalCount)} of ${totalCount}`}
      </span> : ''}

      {+params.get('page') ? <span className='text-sm italic'>
        {`Show products ${range()} of ${totalCount}`}
      </span> : ''}
      <div className='flex items-center'>
        {pagination?.map(el => (
          <PagiItem key={el}>
            {el}
          </PagiItem>
        ))}
      </div>
    </div>
  )
}

export default memo(Pagination)