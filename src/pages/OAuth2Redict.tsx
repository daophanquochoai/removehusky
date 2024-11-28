import React, {useContext, useEffect, useState} from 'react';
import {CommonContext} from "../context/CommonContext.tsx";
import {Navigate, useLocation} from "react-router-dom";
import {Spin} from "antd";

const OAuth2Redict : React.FC = () => {

    const {isLogin, setIsLogin} = useContext(CommonContext);
    const [redirectTo, setRedirectTo] = useState<string>('/login');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const location = useLocation()
    useEffect(() => {
        const accessToken = extractUrlParameter('atoken')
        const refreshToken = extractUrlParameter('rtoken')
        if (accessToken) {
            console.log(accessToken)
            handleLogin(accessToken)
            setRedirectTo('/')
        }
        setIsLoading(false)
    }, [])
    const extractUrlParameter = (key) => {
        return new URLSearchParams(location.search).get(key)
    }
    const handleLogin = (accessToken) => {
        // const data = parseJwt(accessToken)
        // const user = { data, accessToken }
        setIsLogin(true)
    };
    console.log(redirectTo)
    if( isLoading ){
        return (
            <Spin fullscreen={true} tip={"Loading..."}/>
        );
    }
    return <Navigate to={redirectTo} />;
};

export default OAuth2Redict;