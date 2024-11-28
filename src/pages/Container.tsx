import React, {useEffect, useState} from 'react';
import Header from "../components/Home/Header.tsx";
import Footer from "../components/Home/Footer.tsx";
import {Outlet} from "react-router-dom";

const Container : React.FC = () => {
    const [state, setState] = useState<number>(0);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setState(1);
            }else{
                setState(0);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Dọn dẹp khi component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <>
            <Header state={state}/>
            <Outlet />
            <Footer  />
        </>
    );
};

export default Container;