export default function WrapperBody({ children }) {
    return (
        <div className="flex flex-col py-4 px-6 justify-center items-center rounded-2xl mx-auto w-5/6 md:w-3/5 bg-[#755139] text-[#F2EDD7]">
            { children }
        </div>
    )
}