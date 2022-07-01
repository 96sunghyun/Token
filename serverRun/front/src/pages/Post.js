import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import WrapperBasic from "../components/WrapperBasic";
import WrapperBody from "../components/WrapperBody";

import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function Post() {

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [nickname, setNickname] = useState("");

    const location = useLocation();
    console.log(location);

    // (포스트 내용확인) GET http://localhost:4000/content/*
    axios.defaults.withCredentials = true;
    const getContent = async () => {
        try {
            const response = await axios.get('http://localhost:4000/content/' + location.pathname.split("/")[2],
                {},
                {
                    withCredentials: true
                }
            );

            console.log(response);
            setTitle(response.data.title);
            setBody(response.data.body);
            setNickname(response.data.user.nickName);

            console.log("Read post success:", response.data);
        } catch (e) {
            console.log("Read post fail:", e);
        }
    }

    useEffect(() => {
        getContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <WrapperBasic>
            <Navbar />
            <div className="flex flex-col items-center w-full mt-10 h-20">
                <h1 className="text-4xl font-bold">Post{ nickname && ` by ${nickname}` }</h1>
            </div>
            <WrapperBody>
                <div className="text-xl font-bold mb-6">
                    {title}
                </div>
                <div className="break-all">
                    {body}
                </div>
            </WrapperBody>
            <Footer />
        </WrapperBasic>
    )
}