import React, {useEffect, useState} from 'react';
import Header from "../components/Home/Header.tsx";
import Parallax from "../components/Home/Parallax.tsx";
import Sell from "../components/Home/Sell.tsx";
import Blog from "../components/Home/Blog.tsx";
import Info from "../components/Home/Info.tsx";
import Policy from "../components/Home/Policy.tsx";
import Footer from "../components/Home/Footer.tsx";

const Home = () => {
    return (
        <div>
            <Parallax />
            <Sell />
            <Blog />
            <Info />
            <Policy />
        </div>
    );
};

export default Home;