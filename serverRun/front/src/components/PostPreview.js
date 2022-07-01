import { Link } from "react-router-dom";

export default function PostPreview({ title, creator, postId, body }) {

    return (
        <Link to={`/post/${postId}`} className="flex flex-col w-full p-2 border-y border-dashed hover:bg-[#F2EDD7] hover:text-[#755139] hover:cursor-pointer">
            <div className="flex justify-between">  
                <div className="text-lg font-medium">{title}</div>
                <div className="font-light">{creator}</div>
            </div>
            <div className="font-extralight text-sm mt-2">
                {body?.slice(0, 10)}...
            </div>
        </Link>
    )
}