import React from 'react';
import {FaAmazon, FaFacebookF, FaInstagram, FaTwitter} from "react-icons/fa";
import {IoLogoYoutube} from "react-icons/io";

const Footer = () => {
    return (
        <div className={'bg-black'}>
            <div  className={'mx-[10%] py-4'}>
                <div>
                    <div className={'py-16 px-8 grid grid-cols-[2fr_1fr_1fr_1fr]'}>
                        <div className={'flex flex-col items-center justify-center'}>
                            <img src={"https://demo.templatesjungle.com/foodfarm/images/logo-light.svg"} alt={'icon'}/>
                            <div className={'text-white flex justify-center items-center gap-4 text-2xl mt-4'}>
                                <FaFacebookF className={'cursor-pointer'}/>
                                <FaTwitter className={'cursor-pointer'}/>
                                <IoLogoYoutube className={'cursor-pointer'}/>
                                <FaInstagram className={'cursor-pointer'}/>
                                <FaAmazon className={'cursor-pointer'}/>
                            </div>
                        </div>
                        <div className={'text-white'}>
                            <h4 className={'text-2xl font-bold mb-4'}>Organic</h4>
                            <div className={'flex flex-col gap-2'}>
                                <p>About us</p>
                                <p>Contact</p>
                                <p>Careers</p>
                            </div>
                        </div>
                        <div className={'text-white'}>
                            <h4 className={'text-2xl font-bold mb-4'}>Quick Links</h4>
                            <div className={'flex flex-col gap-2'}>
                                <p>Cart</p>
                                <p>Store</p>
                            </div>
                        </div>
                        <div className={'text-white'}>
                            <h4 className={'text-2xl font-bold mb-4'}>Customer Service</h4>
                            <div className={'flex flex-col gap-2'}>
                                <p>Privacy Policy</p>
                                <p>Returns & Refunds</p>
                                <p>Delivery Information</p>
                            </div>
                        </div>
                    </div>
                    <div></div>
                </div>
                <div className={'flex justify-between items-center text-white'}>
                    <p>© 2024 FoodFarm. All rights reserved.</p>
                    <p>Develop by Doctorhoai</p>
                </div>
            </div>
        </div>
    );
};

export default Footer;