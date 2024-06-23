import { InputForm, Loading, Pagination } from 'components'
import React, {useState, useEffect, useCallback} from 'react'
import { useForm } from 'react-hook-form'
import { apiDeleteProduct, apiGetProducts } from 'apis'
import moment from 'moment'
import { useSearchParams, createSearchParams, useNavigate, useLocation } from 'react-router-dom'
import useDebounce from 'hooks/useDebounce'
import EditProduct from './EditProduct'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { showModal } from 'store/app/appSlice'
import { useDispatch } from "react-redux";

const ManageProduct = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch();
  const [ params ] = useSearchParams()
  const {register, formState: {errors}, handleSubmit, reset, watch} = useForm()
  const [products, setProducts] = useState(null)
  const [counts, setCounts] = useState(0)
  const [editProduct, setEditProduct] = useState(null)
  const [update, setUpdate] = useState(false)
  // const { categories } = useSelector(state => state.app)
  const render = useCallback(() => {
    setUpdate(!update)
  })
  const fetchProducts = async (params) => {
    const response = await apiGetProducts({...params, limit: process.env.REACT_APP_PRODUCT})
    if(response.success) {
      setProducts(response.products)
      setCounts(response.counts)
    }
  }

  const queryDecounce = useDebounce(watch('querySearch'), 800)
  useEffect(() => {
    if(queryDecounce) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({querySearch: queryDecounce}).toString()
      })
    }else {
      navigate({
        pathname: location.pathname
      })
    }
  }, [queryDecounce])
  
  useEffect(() => {
    const searchParams = Object.fromEntries([...params])
    fetchProducts(searchParams)
  }, [params, update])

  const handleDeleteProduct = (pid) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure remove this product!',
      icon: 'warning',
      showCancelButton: true
    }).then(async (rs) => {
      if(rs.isConfirmed) {
        dispatch(showModal({isShowModal: true, modalChildren: <Loading />}))
        const response = await apiDeleteProduct(pid)
        dispatch(showModal({isShowModal: false, modalChildren: null}))
        if(response.success) {
          toast.success(response.mes)
        } else {
          toast.error(response.mes)
        }
        render()
      }
    })
  }

  return (
    <div className='w-full flex flex-col gap-4 relative'>
        {editProduct && <div className='absolute inset-0 min-h-sreen bg-white z-20'>
            <EditProduct 
              editProduct={editProduct} 
              setEditProduct={setEditProduct}
              render={render}
            />
        </div>}
        <div className='h-[69px] w-full'></div>
        <div className='p-4 border-b w-full flex bg-gray-500 justify-between items-center fixed top-0'>
            <h1 className='text-3xl font-bold tracking-tight'>Manage Product</h1>
        </div>
        <div className='flex justify-end items-center px-4'>
            <form className='w-[45%]'>
                <InputForm 
                    id='querySearch'
                    register={register}
                    errors={errors}
                    fullWidth
                    placeholder='Search products by title, description....'
                />
            </form>
        </div>
        <table className='table-auto'>
          <thead>
            <tr className='border border-gray-50 py-2 text-white bg-sky-900'>
              <th className='text-center py-2'>Order</th>
              <th className='text-center py-2'>Thumbnail</th>
              <th className='text-center py-2'>Title</th>
              <th className='text-center py-2'>Brand</th>
              <th className='text-center py-2'>Category</th>
              <th className='text-center py-2'>Price</th>
              <th className='text-center py-2'>Quantity</th>
              <th className='text-center py-2'>Sold</th>
              <th className='text-center py-2'>Color</th>
              <th className='text-center py-2'>Ratings</th>
              <th className='text-center py-2'>CreatedAt</th>
              <th className='text-center py-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((el, idx) => (
              <tr className='border-b' key={el._id}>
                  <td className='text-center py-2'>{((+params.get('page') > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_PRODUCT) + idx + 1}</td>
                  <td className='text-center py-2'>
                    <img src={el.thumb} alt='thumb' className='w-14 h-14 object-cover' />
                  </td>
                  <td className='text-center py-2'>{el.title}</td>
                  <td className='text-center py-2'>{el.brand}</td>
                  <td className='text-center py-2'>{el.category}</td>
                  <td className='text-center py-2'>{el.price}</td>
                  <td className='text-center py-2'>{el.quantity}</td>
                  <td className='text-center py-2'>{el.sold}</td>
                  <td className='text-center py-2'>{el.color}</td>
                  <td className='text-center py-2'>{el.totalRatings}</td>
                  <td className='text-center py-2'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
                  <td className='text-center py-2'>
                      <span onClick={() => setEditProduct(el)} className='text-blue-500 hover:underline cursor-pointer px-1'>Edit</span>
                      <span onClick={() => handleDeleteProduct(el._id)} className='text-red-500 hover:underline cursor-pointer px-1'>Delete</span>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='w-full flex justify-end my-8'>
          <Pagination 
            totalCount={counts} 
            paginaType={+process.env.REACT_APP_PRODUCT}
          />
        </div>
    </div>
  )
}

export default ManageProduct