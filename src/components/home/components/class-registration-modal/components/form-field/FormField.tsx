import React from 'react'

type Props = {
  label: string
  name: string
  value: string
  autoComplete?: string
  placeholder?: string
  required?: boolean
  type?: React.HTMLInputTypeAttribute
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const FormField: React.FC<Props> = ({
  label,
  name,
  value,
  autoComplete,
  placeholder,
  required = false,
  type = 'text',
  onChange,
}) => (
  <label className="block space-y-3 text-[26px] font-medium leading-none text-slate-500">
    <span>{label}</span>
    <input
      autoComplete={autoComplete}
      className="h-18 w-full rounded-[22px] border border-[#C8D0DB] bg-white px-6 text-[26px] text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-[#1186AD] focus:ring-4 focus:ring-cyan-100"
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      type={type}
      value={value}
    />
  </label>
)
