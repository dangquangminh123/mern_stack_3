import React, {memo} from 'react'
import clsx from 'clsx'

const InputForm = ({label, disable, register, errors, id, validate, type = 'text', placeholder, fullWidth, defaultValue, style}) => {
  return (
    <div className={clsx('flex flex-col gap-2', style)}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type={type}
        id={id}
        {...register(id, validate)}
        disable={disable}
        placeholder={placeholder}
        className={clsx('form-input text-blue-900 my-auto', fullWidth && 'w-full overflow-x-auto overscroll-y-auto', style)}
        defaultValue={defaultValue}
      />
      {errors[id] && <small className='text-xs text-red-500'>{errors[id]?.message}</small>}
    </div>
  )
}

export default memo(InputForm)