import Footer from "../components/Footer";
import Input from "../components/Input";
import Navbar from "../components/Navbar";
import WrapperBasic from "../components/WrapperBasic";
import WrapperBody from "../components/WrapperBody";
import Button from "../components/Button";

import axios from "axios"

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_BUTTON_TEXT = "Write 50+ letters...";

export default function Write() {

    const [fail, setFail] = useState(false);

    const [buttonText, setButtonText] = useState(DEFAULT_BUTTON_TEXT)
    const [disabled, setDisabled] = useState(true);

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (title && body.length >= 50) {
            setDisabled(false);
            setButtonText("POST");
        } else {
            setDisabled(true);
            setButtonText(DEFAULT_BUTTON_TEXT);
        }
    }, [title, body])

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(title, body);
        postContent(title, body);
    }

    // (신규 포스팅) POST http://localhost:4000/content
    axios.defaults.withCredentials = true;
    const postContent = async (title, body) => {
        const response = await axios.post('http://localhost:4000/content',
            {
                title,
                body
            },
            {
                withCredentials: true
            }
        );
        console.log(response);

        if (response.status === 200) {
            window.alert('New Post Success!');
            navigate(`/mypage`);
        }
    }

    return (
        <WrapperBasic>
            <Navbar hideWrite={true} />
            <div className="flex flex-col items-center w-full mt-10 mb-5">
                <h1 className="text-4xl font-bold">New Post</h1>
            </div>
            <WrapperBody>
                <Input width="w-full" inputName="Title" onChange={setTitle} value={title}  />
                <div className="mt-4 mb-6 w-full">
                    <Input isLarge={true} width="w-full" inputName="Body" onChange={setBody} value={body} />
                </div>
                <Button name={buttonText} isSubmit={true} onSubmit={onSubmit} disabled={disabled} />
            </WrapperBody>
            <Footer />
        </WrapperBasic>
    )
}