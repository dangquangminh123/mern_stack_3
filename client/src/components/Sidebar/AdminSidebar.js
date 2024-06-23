import React, {memo, Fragment, useState} from 'react'
import logo from 'assets/images/logo.png'
import { adminSidebar } from 'ultils/contants'
import { NavLink, Link } from 'react-router-dom'
import clsx from 'clsx'
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

const activedStyle = 'px-4 py-2 flex items-center gap-2 bg-blue-500'
const notActivedStyle = 'px-4 py-2 flex items-center gap-2 hover:bg-blue-200'


const AdminSidebar = () => {
    const [actived, setActived] = useState([])

    const handleShowTabs = (tabId) => {
        if(actived.some(el => el === tabId)) {
            setActived(prev => prev.filter(el => el !== tabId))
        }else {
            setActived(prev => [...prev, tabId])
        }
    }
  return (
    <div className='py-4 bg-orange-300 h-full'>
        <Link to={'/'} className='flex flex-col justify-center items-center p-4 gap-2'>
            <img src={logo} alt='Logo admin' className='w-[200px] object-contain' />
            <small>Admin workspace</small>
        </Link>
        <div>
            {adminSidebar.map(el => (
                <Fragment key={el.id}>
                    {el.type === 'SINGLE' && <NavLink to={el.path}
                        className={({ isActive }) => clsx(isActive && activedStyle, !isActive && notActivedStyle)}
                    >
                            <span>{el.icon}</span>
                            <span>{el.text}</span>
                    </NavLink>}
                    {el.type === 'PARENT' && <div onClick={() => handleShowTabs(+el.id)} className='flex flex-col'>
                        <div className='flex items-center justify-between px-4 py-2 hover:bg-blue-200 cursor-pointer'>
                            <div className='flex items-center gap-2'>
                                <span>{el.icon}</span>
                                <span>{el.text}</span>
                            </div>
                            {actived.some(id => +id === +el.id) ? <FaChevronRight /> : <FaChevronDown/> }
                        </div>
                        {actived.some(id => +id === +el.id) && <div className='flex flex-col'>
                            {el.submenu.map(item => (
                                <NavLink 
                                    key={el.text} 
                                    to={item.path}
                                    className={({ isActive }) => clsx(isActive && activedStyle, !isActive && notActivedStyle, 'pl-6')}
                                >
                                    {item.text}
                                </NavLink>
                            ))}
                        </div> }
                    </div>}
                </Fragment>
            ))}
        </div>
    </div>
  )
}

export default memo(AdminSidebar)