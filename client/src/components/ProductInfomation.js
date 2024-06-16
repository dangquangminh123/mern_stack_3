import React, { memo, useCallback, useState } from "react";
import { productInfoTabs } from "../ultils/contants";
import Votebar  from "./Votebar";
import Button from "./Button";
import { renderStarFromNumber } from "../ultils/helpers";
import { apiRatings } from "../apis";
import { useDispatch, useSelector } from "react-redux";
import VoteOption from "./VoteOption";
import { showModal } from "../store/app/appSlice";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import path from "../ultils/path";
import { useNavigate } from "react-router-dom";

const ProductInfomation = ({totalRatings, ratings, nameProduct, pid, rerender}) => {
  const [activedTab, setActivedTab] = useState(1);
  const [isVote, setIsVote] = useState(false)
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector(state => state.user)

  // const [payload, setPayload] = useState({
  //   comment: '',
  //   score: ''
  // })

  const dispatch = useDispatch()
  const handleSubmitVoteOption = async ({score, comment}) => {
      // console.log(comment, score, pid)
      if(!comment || !score || !pid) {
        toast.error('Làm ơn đánh giá trước khi gửi');
        return
      }
      await apiRatings({star: score, comment, pid})
      dispatch(showModal({isShowModal: false, modalChildren: null}))
        rerender();
  }

  const handleVoteNow = () => {
    if(!isLoggedIn){
      Swal.fire({
        text: 'Login to vote',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Go Login',
        showCancelButton: true,
        title: 'Oops!',
      }).then((rs) => {
        if(rs.isConfirmed) navigate(`/${path.LOGIN}`)
      })
    }else {
      dispatch(
        showModal({
          isShowModal: true, 
          modalChildren:
          <VoteOption nameProduct={nameProduct} 
          handleSubmitVoteOption={handleSubmitVoteOption}/>
        })
      )
    }
  }

  return (
  <div className="pt-16">
    <div className='flex items-center gap-2 relative bottom-[-8px]'>
      {productInfoTabs.map(el => (
        <span className={`py-2 px-4 cursor-pointer ${activedTab === +el.id ? 'bg-white border border-b-0' : 'bg-gray-200'}`} 
        key={el.id} 
        onClick={() => setActivedTab(el.id)}>
          {el.name}
        </span>
      ))}
      <div className={`py-2 px-4 cursor-pointer ${activedTab === 5? 'bg-white border border-b-0' : 'bg-gray-200'}`}
      onClick={() => setActivedTab(5)}>
        CUSTOMER REVIEW
      </div>
    </div>
    <div className='w-full h-[300px] border p-4'>
        {productInfoTabs.some(el => el.id === activedTab) && productInfoTabs.find(el => el.id === activedTab)?.content}
        {activedTab === 5 && <div className='flex flex-col p-4'>
            <div className="flex">
              <div className='flex-4 border flex flex-col items-center justify-center border-red-500 shadow-sm'>
                  <span className="font-semibold text-3xl">{`${totalRatings}/5`}</span>
                  <span className='flex items-center gap-1'>
                    {renderStarFromNumber(totalRatings)?.map((el, index) => (
                      <span key={index}>{el}</span>
                    ))}
                  </span>
                  <span className='text-sm'>{`${ratings?.length} reviews and commentors`}</span>
              </div>
              <div className='flex-6 border flex gap-2 flex-col p-4'>
                {Array.from(Array(5).keys()).reverse().map(el => (
                  <Votebar
                      key={el}
                      number={el + 1}
                      ratingTotal={ratings?.length}
                      ratingCount={ratings?.filter(item => item.star === el + 1)?.length}
                  />
                ))}
              </div>
            </div>
            <div className='p-4 flex items-center justify-center text-sm flex-col gap-2'>
              <span>How do you feel abouts this products ?</span>
      
              <Button handleOnClick={handleVoteNow}>
                Rating!
              </Button>
            </div>
        </div>}
       
    </div>
  </div>
  )
};

export default memo(ProductInfomation);
