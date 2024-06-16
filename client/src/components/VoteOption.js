import React, { memo, useEffect, useRef, useState } from 'react'
import logo from '../assets/images/logo.png'
import { voteOptions } from '../ultils/contants'
import { TiStar } from "react-icons/ti";
import Button from './Button'

const VoteOption = ({nameProduct, handleSubmitVoteOption}) => {
  const modalRef = useRef()
  const [chooseScore, setChooseScore] = useState(null);
  const [comment, setComment] = useState('');
  const [score, setScore] = useState(null);

  useEffect(() => {
    modalRef.current.scrollIntoView({block: "center", behavior: 'smooth'})
  }, [])

  return (
    <div onClick={e => e.stopPropagation()} ref={modalRef} className="bg-white w-[700px] p-4 flex flex-col gap-4 items-center justify-center">
        <img src={logo} alt='logo' className='w-[300px] object-contain my-8'/>
        <h2 className='text-center text-medium text-lg'>{`Đánh giá sản phẩm ${nameProduct}`}</h2>
        <textarea 
          className='w-full form-textarea placeholder:italic placeholder:text-xs placeholder:text-gray-500 text-sm' 
          placeholder='Để lại vài lời cảm nhận từ chính bạn'
          value={comment}
          onChange={e => setComment(e.target.value)}
        >

        </textarea>
        <div className='w-full flex flex-col gap-4'>
            <p>Mức độ cảm nhận của bạn về sản phẩm này như thế nào ?</p>
            <div className='flex justify-center gap-4 items-center'>
                {voteOptions.map(el => (
                    <div className='w-[100px] h-[100px] bg-gray-200 cursor-pointer rounded-md p-1 flex items-center justify-center flex-col gap-2' 
                      onClick={() => {
                        setChooseScore(el.id)
                        setScore(el.id)
                      }}
                      key={el.id}
                    >
                      {(Number(chooseScore) && chooseScore >= el.id) ? <TiStar color='orange' /> : <TiStar color='gray' />}
                      <span>{el.text}</span>
                    </div>
                ))}
            </div>
        </div>

        <Button handleOnClick={() => handleSubmitVoteOption({comment, score})} fw>Đánh giá</Button>
    </div>
  )
}

export default memo(VoteOption)