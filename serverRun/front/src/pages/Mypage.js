import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import WrapperBasic from "../components/WrapperBasic";
import WrapperBody from "../components/WrapperBody";
import PostPreview from "../components/PostPreview"
import Button from "../components/Button";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Mypage() {

    const [alreadyLogged, setAlreadyLogged] = useState(true);

    const [myPosts, setMyPosts] = useState([]);
    const [crypto, setCrypto] = useState(0);
    const [nfts, setNfts] = useState([]);

    const [address, setAddress] = useState(null);
    

    const navigate = useNavigate();

    useEffect(() => {
        if (alreadyLogged === false) {
            console.log("🔴 Rejected from mypage due to login issue");
            navigate(`/`);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alreadyLogged])

    useEffect(() => {
        getMypage();
        getTokenCount();
    }, [])

    // (마이페이지) GET http://localhost:4000/mypage
    axios.defaults.withCredentials = true;
    const getMypage = async () => {
        try {
            const response = await axios.get('http://localhost:4000/mypage',
                {},
                {
                    withCredentials: true
                }
            );
            console.log("Response: ", response);

            if (response.status === 200) {
                if (response.data.list !== []) setMyPosts(response.data.list);
                if (response.data.imgFiles !== []) setNfts(response.data.imgFiles);
            }
        } catch (e) {
            console.log(e);
        }
    }

    // (크립토 카운트) GET http://localhost:4000/crypto/count
    const getTokenCount = async () => {
        try {
            const response = await axios.get('http://localhost:4000/crypto/count',
                {},
                {
                    withCredentials: true
                }
            );
            console.log("Token: ", response);

            if (response.status === 200) {
                setCrypto(response.data.amount);
            }
        } catch (e) {
            console.log(e);
        }
    }

    // (NFT 구매) GET http://localhost:4000/crypto/buyNFT
    const buyNFT = async () => {
        try {
            const response = await axios.get('http://localhost:4000/crypto/buyNFT',
                {},
                {
                    withCredentials: true
                }
            );
            console.log("NFT: ", response);

            if (response.status === 200) {
                window.alert('NFT purchased! #', response.data.data.NFTid)
            }
        } catch (e) {
            console.log(e);
            window.alert("Minting failed... is Ganache connected?")
        }
    }

    return (
        <WrapperBasic>
            <Navbar setAlreadyLogged={setAlreadyLogged} setAddress={setAddress} hideMypage={true} />

            <div className="flex flex-col items-center w-full mt-10 h-40">
                <h1 className="text-4xl font-bold">My Page</h1>
                <div className="w-1/2 flex justify-center mt-5 space-x-2">
                    <Button name="Web3 Account" alert={true} alertMsg={address} />
                    <Button name="My Tokens" alert={true} alertMsg={`You have ${crypto || 0} tokens!`} />
                </div>
                <div className="w-2/3 flex justify-center mt-2 mb-5">
                    <Button name="Mint NFT (10 Tokens)" onlyDesign={true} onSubmit={buyNFT} />
                </div>
            </div>

            
            <div className="my-10">
                <WrapperBody>
                    <div className="text-2xl font-semibold mb-8">My NFTs</div>
                        <div className="flex justify-center flex-wrap mb-8 gap-4">
                            {
                                nfts && nfts.map((n) => <img src={n} alt={n} key={n} className="h-40" />)
                            }
                            { (nfts.length === 0) && <h3 className="">You don't have any yet. Collect 10 tokens for 1 NFT mint.</h3> }
                        </div> 
                </WrapperBody> 
            </div>
            

            <WrapperBody>
                <div className="flex flex-col gap-3 py-6 px-4 w-3/4">
                    {
                        myPosts.map(m =>
                            <PostPreview
                                title={m.title}
                                creator={m.user.nickName}
                                postId={m._id}
                                body={m.body}
                                key={[m.title, m.user, m._id].join("|")}
                            />
                        )
                    }
                    { (myPosts.length === 0) && <h3 className="">No posts yet! Start writing to get tokens!</h3> }
                </div>

                <div className="flex flex-col items-end w-full">
                    <div className="w-1/2 flex justify-center mt-6 -mb-24 space-x-2">
                        <Button name="To list" urlPath="" />
                        <Button name="Write" urlPath="write" />
                    </div>
                </div>
            </WrapperBody>

            <Footer />
        </WrapperBasic>
    )
}