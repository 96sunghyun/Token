import { useEffect, useState } from "react"
import axios from "axios"
import PostPreview from "../components/PostPreview"

export default function Details() {

    const [posts, setPosts] = useState(null);

    // 전체 Post 가져오기
    axios.defaults.withCredentials = true;
    const getDetails = async () => {
        const response = await axios.get('http://localhost:4000/', {}, {
            withCredentials: true
        });
        const data = response.data;
        console.log(data.post);
        setPosts(data.post)
    }

    useEffect(()=>{
        getDetails();
    }, [])

    return (
        <div className="flex flex-col gap-3 py-6 px-4 w-full">
            {
                posts && posts.map(p =>
                    <PostPreview
                        title={p.title}
                        creator={p.user.nickName}
                        postId={p._id}
                        body={p.body}
                        key={[p.title, p.user, p._id].join("|")}
                    />)
            }
        </div>
    )
}