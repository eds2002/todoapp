export default function TextArea({
  placeholder,
  onChange,
  defaultValue,
}: {
  placeholder: string
  onChange: (name: string, val: string) => void
  defaultValue: any
}) {
  return (
    <textarea
      defaultValue={defaultValue}
      placeholder={placeholder}
      onChange={e => onChange('description', e.target.value)}
      className="w-full p-4 mb-4 transition-all bg-gray-600 outline-none resize-none rounded-2xl text-text"
    />
  )
}
