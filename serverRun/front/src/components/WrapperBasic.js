export default function WrapperBasic({ children }) {
    return (
        <div className="flex flex-col w-full min-h-screen bg-[#F2EDD7] text-[#755139]">
            { children }
        </div>
    )
}