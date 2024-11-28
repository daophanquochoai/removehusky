import React from 'react';
import {FaLuggageCart} from "react-icons/fa";
import {PiPlantFill} from "react-icons/pi";

const Policy = () => {
    return (
        <div className={'policy-background w-full h-[550px]'}>
            <div className={'mx-[10%] grid grid-cols-2 h-full'}>
                <div className={'h-full flex items-center justify-evenly flex-col'}>
                    <div className={'text-white flex gap-4 items-center'}>
                        <FaLuggageCart className={'text-4xl'}/>
                        <div>
                            <p className={'text-2xl font-bold'}>Free delivery</p>
                            <span>Lorem ipsum dolor sit amet, consectetur adipi elit.</span>
                        </div>
                    </div>
                    <div className={'text-white flex gap-4 items-center'}>
                        <PiPlantFill  className={'text-4xl'}/>
                        <div>
                            <p className={'text-2xl font-bold'}>100% secure payment</p>
                            <span>Lorem ipsum dolor sit amet, consectetur adipi elit.</span>
                        </div>
                    </div>
                    <div className={'text-white flex gap-4 items-center'}>
                        <FaLuggageCart className={'text-4xl'}/>
                        <div>
                            <p className={'text-2xl font-bold'}>Free delivery</p>
                            <span>Lorem ipsum dolor sit amet, consectetur adipi elit.</span>
                        </div>
                    </div>
                    <div className={'text-white flex gap-4 items-center'}>
                        <FaLuggageCart className={'text-4xl'}/>
                        <div>
                            <p className={'text-2xl font-bold'}>Free delivery</p>
                            <span>Lorem ipsum dolor sit amet, consectetur adipi elit.</span>
                        </div>
                    </div>
                </div>
                <div></div>
            </div>
        </div>
    );
};

export default Policy;