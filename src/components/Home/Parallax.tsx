import React from 'react';
import { ParallaxBanner } from 'react-scroll-parallax';
import {useNavigate} from "react-router-dom";

const Parallax = () => {
    const navigation =  useNavigate();
    return (
        <div className={'h-[80vh] overflow-hidden'}>
            <ParallaxBanner
                layers={[
                    { image: 'https://demo.templatesjungle.com/foodfarm/images/slide-1.jpg', speed: -20 },
                    {
                        speed: -15,
                        children: (
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <p className={'text-white'}>Fuel Your Body, Feed Your Soul with Organic Goodness</p>
                                <h1 className="text-8xl text-white font-bold text-center fond">
                                    ALWAYS
                                    <br/>
                                    ORGANIC
                                </h1>
                                <button className={'bg-green_primary mt-10 p-2 rounded-xl text-white'} onClick={ () => {navigation('/product'); scroll(0,0)}}>SHOP NOW</button>
                            </div>
                        ),
                    }
                ]}
                className="aspect-[2/1]"
            />
            <p>123</p>
        </div>
    );
};

export default Parallax;