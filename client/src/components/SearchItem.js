import React, {memo, useEffect, useState} from 'react'
import icons from '../ultils/icons'
import { colors } from '../ultils/contants'
import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { path } from '../ultils/path'
import { apiGetProducts } from '../apis'
import useDebounce from '../hooks/useDebounce'
import { toast } from "react-toastify";

const { FaChevronDown } = icons


const SearchItem = ({ name, activeClick, changeActiveFitler, type = 'checkbox' }) => {
  const [selected, setSelected] = useState([])
  const [price, setPrice] = useState({
    from: '',
    to: ''
  })
  const [bestPrice, setBestPrice ] = useState(null);
  const { category } = useParams();
  const navigate = useNavigate();

    const handSelect = (e) => {
      const alreadyEl = selected.find(el => el === e.target.value)
      if(alreadyEl) setSelected(prev => prev.filter(el => el !== e.target.value))
      else setSelected(prev => [...prev, e.target.value])
      changeActiveFitler(null)
    }

    const fetchBestPriceProduct = async () => {
        const response = await apiGetProducts({sort: '-price', limit: 1})
        if(response.success) {
          setBestPrice(response.products[0]?.price);
        }
    }

    useEffect(() => {
      if(selected.length > 0){
        navigate({
          pathname: `/${category}`,
          search: createSearchParams({
            color: selected.join(',')
          }).toString()
        })
      }else {
        navigate(`/${category}`)
      }
    }, [selected])

    useEffect(() => {
      if (type=== 'input') {
        fetchBestPriceProduct()
      }
    }, [type])

    const deboucePriceFrom = useDebounce(price.from, 3000)
    const deboucePriceTo = useDebounce(price.to, 3000)

    useEffect(() => {
      const data = {}
      if(Number(price.from) > 0) data.from = price.from
      if(Number(price.to) > 0) data.to = price.to
      navigate({
        pathname: `/${category}`,
        search: createSearchParams(data).toString()
      })
    }, [deboucePriceFrom, deboucePriceTo])

    useEffect(() => {
      if(price.from && price.to) {
        if(price.from > price.to) {
          toast.error('Giá bắt đầu phải thấp hơn giá cuối cùng!');
        }
      }
    }, [price])


  return (
    <div onClick={() => changeActiveFitler(name)}
    className='p-3 text-gray-500 text-xs gap-6 relative border border-gray-800 flex justify-between items-center'>
        <span className='capitalize'>{name}</span>
        <FaChevronDown />
       {activeClick === name &&  <div className='absolute z-10 top-[calc(100%+1px)] left-0 w-fit p-4 bg-white min-w-[150px]'>
            { type === 'checkbox' && <div className=''>
                <div className='p-4 items-center flex justify-between gap-8 border-b'>
                  <span className='whitespace-nowrap'>{`${selected.length} selected`}</span>
                  <span onClick={e => {e.stopPropagation()
                      setSelected([])}} 
                      className='underline cursor-pointer hover:text-main'>
                        Reset
                  </span>
                </div>
                <div onClick={e => e.stopPropagation()} className='flex flex-col gap-3 mt-4'>
                  {colors.map((el, index) => (
                    <div className='flex items-center gap-4' key={index}>
                      <input 
                        type='checkbox' 
                        className='form-checkbox' 
                        value={el}
                        onChange={handSelect}
                        id={el}
                        checked={selected.some(selectedItem => selectedItem === el)}
                      />
                      <label className='capitalize text-gray-700' htmlFor={el}>{el}</label>
                    </div>
                  ))}
                </div>
             </div>
            }
            {type === 'input' && <div onClick={e => e.stopPropagation()}>
                  <div className='p-4 items-center flex justify-between gap-8 border-b'>
                    <span className='whitespace-nowrap'>{`The highest price is ${Number(bestPrice).toLocaleString()} VNĐ`}</span>
                    <span onClick={e => {e.stopPropagation()
                     setPrice({ from: '', to: ''})
                     changeActiveFitler(null)
                    }} 
                     className='underline cursor-pointer hover:text-main'>Reset</span>
                  </div>
                <div className='flex items-center p-2 gap-2'>
                  <div className='flex items-center gap-2'>
                      <label htmlFor='from'>From</label>
                      <input className='form-input' type='number' id='from' 
                      value={price.from}
                      onChange={e => setPrice(prev => ({ ...prev, from: e.target.value }))}/>
                  </div>
                  <div className='flex items-center gap-2'>
                      <label htmlFor='to'>To</label>
                      <input className='form-input' type='number' id='to' 
                      value={price.to}
                      onChange={e => setPrice(prev => ({ ...prev, to: e.target.value }))}/>
                  </div>
                </div>
            </div>}
        </div>}
    </div>
  )
}

export default memo(SearchItem)