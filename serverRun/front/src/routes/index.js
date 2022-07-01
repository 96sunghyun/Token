import { useRoutes } from 'react-router-dom';

import Main from "../pages/Main"
import Post from "../pages/Post"
import Login from "../pages/Login"
import Logout from "../pages/Logout"
import Signup from "../pages/Signup"
import Write from "../pages/Write"
import Mypage from "../pages/Mypage"

export default function Router() {
    return useRoutes([
        // Main Routes
        {
            path: '/',
            element: <Main />
        },
        {
            path: '/login',
            element: <Login />
        },
        {
            path: '/logout',
            element: <Logout />
        },
        {
            path: '/signup',
            element: <Signup />
        },
        {
            path: '/write',
            element: <Write />
        },
        {
            path: '/mypage',
            element: <Mypage />
        },
        // useLocation으로 세부 postId 파악하기
        {
            path: '/post/:postId',
            element: <Post />
        }
    ])
}