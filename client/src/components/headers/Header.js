import React, { Fragment, memo} from 'react'
import logo from 'assets/images/logo.png'
import icons from 'ultils/icons'
import { Link } from 'react-router-dom'
import path from 'ultils/path'
import { useSelector } from 'react-redux'

const Header = () => {
  const { MdLocalPhone, MdOutlineEmail, GiShoppingBag, FaUser, FaHeart } = icons;
  const {current} = useSelector(state => state.user)
  return (
    <div className='w-main flex justify-between h-[110px] py-[35px]'>
        <Link to={`/${path.HOME}`}> 
            <img src={logo} alt='logo' className='w-[234px] object-contain' />
        </Link>
        <div className='flex text-[13px]'>
            <div className='flex flex-col items-center px-6 border-r'>
                <span className='flex gap-4 items-center'>
                    <MdLocalPhone color='red' />
                    <span className='font-semibold'>(+1800) 000 8808</span>
                </span>
                <span>Mon-Sat 9:00AM - 8:00PM</span>
            </div>
            <div className='flex flex-col items-center px-6 border-r'>
                <span className='flex gap-4 items-center'>
                    <MdOutlineEmail color='red' />
                    <span className='font-semibold'> SUPPORT@TADATHEMES.COM</span>
                </span>
                <span>Online Support 24/7</span>
            </div>
            {current && <Fragment>
                <div className='flex cursor-pointer items-center justify-center gap-2 px-6 border-r'>
                    <GiShoppingBag color='red'/>
                    <span>0 items(s)</span>
                </div>
                <Link className='flex cursor-pointer items-center justify-center px-6'
                    to={+current?.role === 1945 ? `/${path.ADMIN}/${path.DASHBOARD}` : `/${path.MEMBER}/${path.PERSONAL}`}
                >
                    <FaUser color='red' />
                    <span>Profile</span>
                </Link>    
            </Fragment>}
        </div>
    </div>
  )
}

export default memo(Header)
