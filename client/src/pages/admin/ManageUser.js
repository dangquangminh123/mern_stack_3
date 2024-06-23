import React, {useEffect, useState, useCallback} from 'react'
import { apiDeleteUser, apiGetUsers, apiUpdateUser } from 'apis/user'
import { roles, blockStatus } from 'ultils/contants'
import moment from 'moment'
import { Button, InputField, InputForm, Pagination, Select } from 'components'
import useDebounce from 'hooks/useDebounce'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import clsx from 'clsx'
import Swal from 'sweetalert2'
const ManageUser = () => {
  const [users, setUsers] = useState(null)
  const [queries, setQueries] = useState({
    queryUser: ""
  })

  const {handleSubmit, register, formState: {errors}, reset} = useForm({
    email: '',
    firstname: '',
    lastname: '',
    role: '',
    phone: '',
    isBlocked: ''
  })
  const [update, setUpdate] = useState(false)
  const [editElm, setEditElm] = useState(null)
  const [params] = useSearchParams()

  const fetchUsers = async (params) => {
    const response = await apiGetUsers({...params, limit: +process.env.REACT_APP_LIMIT})
    // console.log(response);
    if(response.success) setUsers(response)
  }

  const render = useCallback(() => {
    setUpdate(!update)
  }, [update])

  const queriesDebounce = useDebounce(queries.queryUser, 1000)

  useEffect(() => {
    const queries = Object.fromEntries([...params])
    if(queriesDebounce) queries.queryUser = queriesDebounce
    fetchUsers(queries)
  }, [queriesDebounce, params, update])

  const handleUpdate = async (data) => {
    const response = await apiUpdateUser(data, editElm._id);
    if(response.success) {
      setEditElm(null)
      render()
      toast.success(response.mes)
    }else {
      toast.error(response.mes)
    }
  }

  const handleDeleteUser = async (uid) => {
    Swal.fire({
      title: 'Are you sure delete...',
      text: 'Are you ready remove this user?',
      showCancelButton: true
    }).then(async (result) => {
      if(result.isConfirmed) {
        const response = await apiDeleteUser(uid)
        if(response.success) {
          render()
          toast.success(response.mes)
        } else {
          toast.error(response.mes)
        }
      }
    })
  }

  useEffect(() => {
    if(editElm) reset({
      email: editElm.email,
      firstname: editElm.firstname,
      lastname: editElm.lastname,
      phone: editElm.phone,
      role: editElm.role,
      isBlocked: editElm.isBlocked
    })
  }, [editElm])
 
  // console.log(queries.queryUser)
  return (
    <div className={clsx('w-full pl-2', editElm && 'pl-16')}>
        <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
            <span>Manage User</span>
        </h1>
        <div className='w-full p-4'>
          <div className='flex justify-end py-4'>
            <InputField 
              nameKey={'queryUser'}
              value={queries.queryUser}
              setValue={setQueries}
              style={'w500'}
              placeholder='Search name or email user...'
              isHideLabel
            />
          </div>
          <form onSubmit={handleSubmit(handleUpdate)}>
            {editElm && <Button type='submit'>Update</Button>}
            <table className='table-auto mb-6 text-left w-full overflow-x-auto overscroll-y-auto'>
                <thead className='font-bold bg-gray-700 text-[13px]  text-white'>
                    <tr className='border border-blue-500'>
                      <th className='px-4 py-2'>#</th>
                      <th className='px-4 py-2'>Email address</th>
                      <th className='px-4 py-2'>Firstname</th>
                      <th className='px-4 py-2'>Lastname</th>
                      <th className='px-4 py-2'>Role</th>
                      <th className='px-4 py-2'>Phone</th>
                      <th className='px-4 py-2'>Status</th>
                      <th className='px-4 py-2'>Created At</th>
                      <th className='px-4 py-2'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users?.users?.map((el, idx) => (
                        <tr key={el._id} className='border border-gray-500'>
                          <td className='py-2 px-4'>{idx+1}</td>
                          <td className='py-2 px-4 w-36'>
                            {editElm?._id === el._id ? 
                            <InputForm 
                                register={register}
                                fullWidth
                                defaultValue={editElm?.email} 
                                errors={errors}
                                id={'email'}
                                validate={{
                                  require: true,
                                  pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "invalid email address"
                                  }
                                }}
                            /> : <span>{el.email}</span>}
                          </td>
                          <td className='py-2 px-4 w-36'>
                            {editElm?._id === el._id ? 
                            <InputForm 
                                register={register}
                                fullWidth
                                defaultValue={editElm?.firstname} 
                                errors={errors} 
                                id={'firstname'} 
                                validate={{require: true,
                                  pattern: {
                                    value: /^[a-z,',-]+(\s)[a-z,',-]+$/i,
                                    message: "invalid email firstname"
                                  }
                                }} 
                            /> : <span>{el.firstname}</span>}
                          </td>
                          <td className='py-2 px-4 w-36'>
                            {editElm?._id === el._id ? 
                            <InputForm 
                              register={register}
                              fullWidth
                              defaultValue={editElm?.lastname} 
                              errors={errors} 
                              id={'lastname'} 
                              validate={{require: true,
                                pattern: {
                                  value: /^[a-z,',-]+(\s)[a-z,',-]+$/i,
                                  message: "invalid email lastname"
                                }
                              }} 
                            /> : <span>{el.lastname}</span>}
                          </td>
                          <td className='py-2 px-4 w-36'>
                            {editElm?._id === el._id ?
                            <Select 
                              register={register}
                              fullWidth
                              errors={errors}
                              defaultValue={+el.role}
                              id={'role'}
                              validate={{require: 'Require selected.'}}
                              options={roles}
                            /> 
                            : <span>{roles.find(role => +role.code === +el.role)?.value}</span>}
                          </td>
                          <td className='py-2 px-4 w-36'>
                            {editElm?._id === el._id ? 
                            <InputForm
                              register={register}
                              fullWidth
                              defaultValue={editElm?.mobile} 
                              errors={errors} 
                              id={'mobile'} 
                              validate={{require: true,
                                pattern: {
                                  value:  /^(\()?\d{10}$/i,
                                  message: "invalid email mobile"
                                }
                              }} 
                            /> : <span>{el.mobile}</span>}
                          </td>
                          <td className='py-2 px-4 w-36'>
                            {editElm?._id === el._id ? 
                            <Select 
                              register={register}
                              fullWidth
                              errors={errors}
                              defaultValue={el.isBlocked}
                              id={'isBlocked'}
                              validate={{require: 'Require fill.'}}
                              options={blockStatus}
                            /> 
                            : <span>{el.isBlocked ? 'Blocked' : 'Active'}</span>}
                          </td>
                          <td className='py-2 px-4 w-24'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
                          <td className='py-2 px-4 w-24'>
                              {editElm?._id === el._id ? <span onClick={() => setEditElm(null)} 
                                  className='px-2 text-orange-600 hover:underline cursor-pointer'>
                                Back </span>
                                :
                                <span onClick={() => setEditElm(el)} 
                                  className='px-2 text-orange-600 hover:underline cursor-pointer'>
                                  Edit
                                </span>
                              }
                              <span onClick={() => handleDeleteUser(el._id)} className='px-2 text-orange-600 hover:underline cursor-pointer'>Delete</span>
                          </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </form>
          <div className='w-full flex justify-end'>
              <Pagination 
                  totalCount={users?.counts}
                  paginaType={+process.env.REACT_APP_LIMIT}
              />
          </div>
        </div>
    </div>
  )
}

export default ManageUser