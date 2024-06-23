import React, {useState, memo, useCallback, useEffect} from 'react'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import { Button, InputForm, Loading, MarkdownEditor, Select } from 'components'
import { useSelector } from 'react-redux'
import { validate, getBase64} from 'ultils/helpers'
import { toast } from 'react-toastify'
import { apiCreateProduct } from 'apis'
import { showModal } from 'store/app/appSlice'
import { useDispatch } from "react-redux";


const CreateProduct = () => {

  const { categories } = useSelector(state => state.app)
  const dispatch = useDispatch();
  const { register, formState: { errors }, reset, handleSubmit, watch } = useForm()
  const [payload, setPayload] = useState({
    description: ''
  })
  const [preview, setPreview] = useState({
    thumb: null,
    images: []
  })
  const [invalidFields, setInvalidFields] = useState([])
  const changeValue = useCallback((e) => {
    setPayload(e)
  }, [payload])
  const [hoverElm, setHoverElm] = useState(null)

  const handlePreview = async (file) => {
    const base64Thumb = await getBase64(file)
    setPreview(prev => ({ ...prev, thumb: base64Thumb}))
  }

  const handlePreviewImages = async (files) => {
    const imagesPreview =[]
    for(let file of files) {
      if(file.type !== 'image/jpg' && file.type !== 'image/png' && file.type !== 'image/jpeg') {
        toast.warning('File not supported!')
        return
      }
      const base64 = await getBase64(file)
      imagesPreview.push({name: file.name, path: base64})
    }

    if(imagesPreview.length > 0) {
      setPreview(prev => ({...prev, images: imagesPreview}))
    }
  }

  useEffect(() => {
    handlePreview(watch('thumb')[0])
  }, [watch('thumb')])

  useEffect(() => {
    handlePreviewImages(watch('images'))
  }, [watch('images')])

  const handleCreateProduct = async (data) => {
    const invalids = validate(payload, setInvalidFields)
    if(invalids === 0) {
      if(data.category) {
        data.category = categories?.find(el => el._id === data.category)?.title
        const finalPayload = { ...data, ...payload }
        const formData = new FormData()
        for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1])
        if(finalPayload.thumb) formData.append('thumb', finalPayload.thumb[0])
        if(finalPayload.images) {
          for(let image of finalPayload.images) formData.append('images', image)
        }
      dispatch(showModal({isShowModal: true, modalChildren: <Loading />}))
      const response = await apiCreateProduct(formData)
      dispatch(showModal({isShowModal: false, modalChildren: null}))
      if(response.success) {
        reset()
        setPreview({
          thumb: '',
          image: []
        })
        toast.success(response.mes)
      }else {
        toast.error(response.mes)
      }


        // see value FormData in js gg
        // for(var pair of formData.entries()) {
        //   console.log(pair[0] + ', ' + pair[1]);
        // }
      }
    }
  }

  const handleRemoveImage = (name) => {
    const files = [...watch('images')]
    if(preview.images?.some(el => el.name === name)) {
      setPreview(prev => ({...prev, images: prev.images?.filter(el => el.name !== name)}))
    }
    reset({
      images: files?.filter(el => el.name !== name)
    })
  }
  // console.log(watch('category'))
  return (
    <div className='w-full'>
        <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
          <span>Create New Product</span>
        </h1>
        <div className='p-4'>
          <form onSubmit={handleSubmit(handleCreateProduct)}>
              <InputForm
                label='Name Product'
                register={register}
                errors={errors}
                id='title'
                validate={{
                  required: 'Need fill this field'
                }}
                fullWidth
                placeholder='Name of new product'
              />
              <div className='w-full my-6 flex gap-4'>
                <InputForm
                  label='Price Product'
                  register={register}
                  errors={errors}
                  id='price'
                  validate={{
                    required: 'Need fill this field'
                  }}
                  fullWidth
                  style='flex-auto'
                  placeholder='Price of new product'
                  type='number'
                />

                <InputForm
                  label='Quantity Product'
                  register={register}
                  errors={errors}
                  id='quantity'
                  fullWidth
                  validate={{
                    required: 'Need fill this field'
                  }}
                  style='flex-auto'
                  placeholder='Quantity of new product'
                  type='number'
                />

                <InputForm
                  label='Color Product'
                  register={register}
                  errors={errors}
                  id='color'
                  fullWidth
                  validate={{
                    required: 'Need fill this field'
                  }}
                  style='flex-auto'
                  placeholder='Color of new product'
                />
              </div>

              <div className='w-full my-6 flex gap-4'>
                <Select 
                  label='Category'
                  options={categories?.map(el => ({code: el._id, value: el.title}))}
                  register={register}
                  id='category'
                  validate={{ required: 'Need selected this field'}}
                  style='flex-auto'
                  errors={errors}
                  fullWidth
                />
                <Select 
                  label='Brand (Optional)'
                  options={categories?.find(el => el._id === watch('category'))?.brand?.map(el => ({code: el, value: el }))}
                  register={register}
                  id='brand'
                  style='flex-auto'
                  errors={errors}
                  fullWidth
                />
              </div>
              <MarkdownEditor
                name='description'
                changeValue={changeValue}
                label='Description'
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
              />

              <div className='flex flex-col gap-2 mt-8'>
                <label className='font-semibold' htmlFor='thumb'>Upload thumb</label>
                <input 
                  type="file"
                  id="thumb" 
                  {...register('thumb', { required: 'Need this fields'})}
                />
                {errors['thumb'] && <small className='text-xs text-red-500'>{errors['thumb']?.message}</small>}
              </div>
            
              {preview.thumb && <div className='my-4'>
                <img src={preview.thumb} alt='thumbnail' className='w-[200px] object-contain' />  
              </div>}

              <div className='flex flex-col gap-2 mt-8'>
                <label className='font-semibold' htmlFor='thumb'>Upload images of product</label>
                <input 
                  type="file" 
                  id="products" 
                  multiple
                  {...register('images', { required: 'Need this fields'})}
                />
                {errors['images'] && <small className='text-xs text-red-500'>{errors['images']?.message}</small>}
              </div>
              {preview.images.length > 0 && <div className='my-4 flex w-full gap-3 flex-wrap'>
                {preview.images?.map((el, idx)=> (
                  <div 
                    onMouseEnter={() => setHoverElm(el.name)}
                    key={idx} 
                    className='w-fit relative'
                    onMouseLeave={() => setHoverElm(null)}
                  >
                      <img src={el.path} alt='images product' className='w-[200px] object-contain' />  
                      {hoverElm === el.name && <div 
                        className='absolute cursor-pointer slide-fwd-center inset-0 bg-overlay flex items-center justify-center'
                        // onClick={() => handleRemoveImage(el.name)}
                      >
                        {/* <RiDeleteBin7Line 
                          size={24} color='white'
                        /> */}
                      </div>}
                  </div>
                ))}
              </div>}
              <div className='my-6'><Button type='submit'>Create new product</Button></div>
          </form>
        </div>
    </div>
  )
}

export default memo(CreateProduct)