import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import WrapperBasic from "../components/WrapperBasic";
import WrapperBody from "../components/WrapperBody";
import Input from "../components/Input";
import Button from "../components/Button";
import Message from "../components/Message";

import axios from "axios";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_BUTTON_TEXT = "Input ID/PW";

export default function Login() {
  // Signup POST failed?
  const [fail, setFail] = useState(false);

  const [alreadyLogged, setAlreadyLogged] = useState(false);

  const [buttonText, setButtonText] = useState(DEFAULT_BUTTON_TEXT);
  const [disabled, setDisabled] = useState(true);

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (id && pw) {
      setDisabled(false);
      setButtonText("Login!");
    } else {
      setDisabled(true);
      setButtonText(DEFAULT_BUTTON_TEXT);
    }
  }, [id, pw]);

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(id, pw);
    postLogin(id, pw);
  };

  // 이미 로그인 상태라면 마이페이지로 자동 이동
  useEffect(() => {
    if (alreadyLogged === true) navigate(`/mypage`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alreadyLogged]);

  // (로그인) POST http://localhost:4000/auth/login
  axios.defaults.withCredentials = true;
  const postLogin = async (id, pw) => {
    const response = await axios.post(
      "http://localhost:4000/auth/login",
      {
        email: id,
        password: pw,
      },
      {
        withCredentials: true,
      }
    );
    console.log(response);

    if (response.status === 200) {
      // window.alert('Login Success!');
      navigate(`/mypage`);
    }
  };

  return (
    <WrapperBasic>
      <Navbar setAlreadyLogged={setAlreadyLogged} hideLogin={true} />
      <WrapperBody>
        <div className="flex flex-col items-center space-y-6 w-full my-4">
          <div className="flex flex-col space-y-2 justify-center items-center">
            <Input inputName="ID" value={id} onChange={setId} />
            <Input inputName="PW" value={pw} onChange={setPw} />
          </div>
          <Button
            name={buttonText}
            isSubmit={true}
            onSubmit={onSubmit}
            disabled={disabled}
          />
          {fail ? <Message m="Login failed." /> : null}
        </div>
      </WrapperBody>
      <Footer />
    </WrapperBasic>
  );
}
