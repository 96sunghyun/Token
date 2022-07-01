export default function Input({ inputName = "null", onChange, value, width, isLarge=false }) {
    return (
        <div className={`flex flex-col ${ width ? width : "" }`}>
            <div>{inputName}</div>
            {
                !isLarge ?
                    <input onChange={(e) => onChange(e.target.value)} value={value} type="text" className={`text-[#755139]`} />
                :
                    <textarea rows={10} onChange={(e) => onChange(e.target.value)} value={value} className={`text-[#755139] ${ isLarge ? "h-40" : "" }`} />
            }
        </div>
    )
}