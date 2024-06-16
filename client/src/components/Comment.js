import React from 'react'
import avatar from '../assets/images/avata_default.png'
import moment from 'moment'
import { renderStarFromNumber } from '../ultils/helpers'

const Comment = ({image = avatar, name, updatedAt, comment, star}) => {
  return (
    <div className='flex'>
        <div className='p-5 flex-none'>
            <img src={image} alt='avatar' className='w-[80px] h-[80px] object-cover rounded-full'/>
        </div>

        <div className='flex flex-col flex-auto'>
            <div className='flex justify-between items-center'>
                <h3>{name}</h3>
                <span>{moment(updatedAt)?.fromNow()}</span>
            </div>
            <div className='flex flex-col gap-2 pl-4'>
                <span>
                    <span className='font-semibold'>Vote</span>
                    <span className='flex items-center gap-1'>
                    {renderStarFromNumber(star)?.map((el, index) => (
                      <span key={index}>{el}</span>
                    ))}
                    </span>
                </span>
                <span>
                    <span className='font-semibold'>Comment</span>
                    <span className='flex items-center gap-1'>
                        {comment}
                    </span>
                </span>
            </div>
        </div>
    </div>
  )
}

export default Comment