import React, {useState} from "react";
import { formatMoney } from "../ultils/helpers";
import p_new from "../assets/images/new.png";
import trending from "../assets/images/trending.png";
import { renderStarFromNumber } from "../ultils/helpers";
import { SelectOption } from "./";
import icons from "../ultils/icons";
import { Link } from "react-router-dom";
import path from "../ultils/path";

const {GiHamburgerMenu, FaEye, FaHeart} = icons
const Product = ({ productData, isNew, normal }) => {
  // console.log(isNew); 
  const [isShowOption, setIsShowOption] = useState(false)
  return (
    <div className="w-full text-base px-[10px]">
      <Link className="w-full border px-[15px] flex flex-col items-center"
        to={`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`}
        onMouseEnter={e => {
          e.stopPropagation()
          setIsShowOption(true)
        }}
        onMouseLeave={e => {
          e.stopPropagation()
          setIsShowOption(false)
        }}  
      >
        <div className="w-full relative">
          {isShowOption && <div className="absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top">
              <SelectOption icon={<FaEye />}/>
              <SelectOption icon={<GiHamburgerMenu />}/>
              <SelectOption icon={<FaHeart />}/>
          </div>
          }
          <img
            src={
              productData?.thumb ||
              "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpngtree.com%2Fso%2Fdefault-image&psig=AOvVaw2N0QmkULq_mSXFseStgPx3&ust=1704253337687000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCKiric3kvYMDFQAAAAAdAAAAABAD"
            }
            alt=""
            className="w-[274px] h-[274px] object-cover"
          />
          {!normal && <img src={isNew ? trending : p_new} alt="" className={`absolute w-[100px] h-[35px] top-0 right-[0] object-cover`}/>}
      
        </div>
        <div className="flex flex-col mt-[15px] items-start gap-1 w-full">
          <span className="flex h-4">{renderStarFromNumber(productData?.totalRatings)?.map((el, index) => (
                <span key={index}>{el}</span>
            ))}</span>
          <span className="line-clamp-1">{productData?.title}</span>
          <span>{`${formatMoney(productData?.price)} VNĐ`}</span>
        </div>
      </Link>
    </div>
  );
};

export default Product;
