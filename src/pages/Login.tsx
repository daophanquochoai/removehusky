import React, {useContext, useState} from 'react';
import {Input, Spin} from "antd";
import { UserOutlined } from '@ant-design/icons';
import {RiLockPasswordLine} from "react-icons/ri";
import {NavLink, useNavigate} from "react-router-dom";
import {FaFacebook, FaGithub} from "react-icons/fa";
import {authenticate, getSocialLoginUrl, parseJwt} from "../Helper/Helper.ts";
import {toast} from "react-toastify";
import {CommonContext} from "../context/CommonContext.tsx";

const Login : React.FC = () => {
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const {setIsLogin} = useContext(CommonContext);
    const navigation = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const handleSubmit = async (e) => {
        setIsLoading(true)
        e.preventDefault();
        if( e.target[0].value === ''){
            toast.warning("User name not null")
            e.target[0].focus();
            setIsLoading(false)
            return;
        }
        if( e.target[1].value === ''){
            toast.warning("Password not null")
            e.target[1].focus();
            setIsLoading(false)
            return;
        }
        const responce = await authenticate(e.target[0].value, e.target[1].value);
        if( responce.status === 404 ){
            toast.error("User not found!!")
            setIsLoading(false)
            return;
        }
        if(responce.status === 200 ){
            localStorage.setItem("accessToken", responce.data.accessToken)
            localStorage.setItem("email", parseJwt(responce.data.accessToken).sub)
            localStorage.setItem("refreshToken", responce.data.refreshToken)
            setIsLogin(true);
            navigation('/')
        }
    }
    return (
       <div className={'w-full h-[100vh] flex items-center justify-center'}>
           <div className={'border-2 rounded-2xl overflow-hidden shadow_form'}>
               <div className={'bg-green_primary w-[400px] p-4'}>
                   <h2 className={'text-center text-3xl text-white font-bold'}>Sign In</h2>
               </div>
               <Spin tip={"Loading..."} spinning={isLoading}>
                   <form onSubmit={handleSubmit}>
                       <div className={'px-5 mt-8'}>
                           <Input size="large" type={"email"} placeholder="Email" prefix={<UserOutlined />} />
                       </div>
                       <div className={'px-5 mt-8'}>
                           <Input.Password
                               size="large" placeholder="Password" prefix={<RiLockPasswordLine />}
                               visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                           />
                       </div>
                       <div className={'flex items-center justify-center'}>
                           <button className={'mt-8 bg-green_primary text-white w-[50%] py-2 rounded-2xl hover:bg-white border-2 border-green_primary hover:text-green_primary'}>Login</button>
                       </div>
                   </form>
               </Spin>
               <div className={'flex gap-6 items-center justify-center mt-8'}>
                   <div className={'text-4xl text-green_primary cursor-pointer'}><a href={getSocialLoginUrl('github')}><FaGithub /></a></div>
                   <div className={'text-4xl text-green_primary cursor-pointer'}><FaFacebook/></div>
               </div>
               <div className={'flex flex-col items-center justify-center mt-16 mb-2'}>
                   <NavLink to={'/forget-account'} className={'text-gray-300'}>Forget account ?</NavLink>
                   <NavLink className={'text-green-300'} to={'/register'}>Sign Up</NavLink>
               </div>
           </div>
       </div>
    );
};

export default Login;