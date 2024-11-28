import React from 'react';
import {ParallaxBanner} from "react-scroll-parallax";
import {NavLink} from "react-router-dom";

const ParallaxShop:React.FC = () => {
    return (
        <div>
            <ParallaxBanner
                style={{height : 600}}
                layers={[
                    { image: 'https://demo.templatesjungle.com/foodfarm/images/bg-vegetables.jpg', speed: -20 },
                ]}
                className="aspect-[2/1]"
            >
                <div className="absolute inset-0 flex items-center justify-start mx-[10%] ">
                    <div className={'flex flex-col gap-4'}>
                        <div className={'text-white text-2xl'}><NavLink to={'/'}>HOME</NavLink> / <span className={'text-green_primary'}>SHOP</span></div>
                        <div className={'text-8xl font-bold text-white'}>SHOP</div>
                    </div>
                </div>
            </ParallaxBanner>
        </div>
    );
};

export default ParallaxShop;