import axios from "axios"

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import WrapperBasic from "../components/WrapperBasic";

export default function Logout() {
    const navigate = useNavigate();

    // 이미 로그인 상태라면 마이페이지로 자동 이동
    useEffect(() => {
        getLogout();
        navigate(`/`);
    }, []);

    // (로그아웃) GET http://localhost:4000/auth/logout
    axios.defaults.withCredentials = true;
    const getLogout = async () => {
        const response = await axios.get('http://localhost:4000/auth/logout',
            {},
            {
                withCredentials: true
            }
        );
        console.log("Logging out...", response);
        window.alert('Logged out!');
    }

    return (
        <WrapperBasic>
            <Navbar resetLogin={true} />
            <div>Logout...</div>
        </WrapperBasic>
        
    )
}