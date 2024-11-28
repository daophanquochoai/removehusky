import React from 'react';

const InfoDownload : React = () => {
    return (
        <div className={'mt-16 h-[520px] info-background bg-yellow_primary'}>
            <div className={'mx-[10%] grid grid-cols-[1fr_1fr]'}>
                <div className={'flex justify-center items-center flex-col gap-4'}>
                    <h2 className={'text-5xl font-bold'}>Download FoodFarm App</h2>
                    <p className={'text-xl'}>Online Orders made easy, fast and reliable</p>
                    <div className={'grid grid-cols-2 gap-4'}>
                        <div className={'cursor-pointer'}>
                            <img src={'https://demo.templatesjungle.com/foodfarm/images/img-google-play.png'} alt={'chplay'}/>
                        </div>
                        <div className={'cursor-pointer'}>
                            <img src={'https://demo.templatesjungle.com/foodfarm/images/img-app-store.png'} alt={'appstore'}/>
                        </div>
                    </div>
                </div>
                <div className={'overflow-hidden h-[520px]'}>
                    <img src={'https://demo.templatesjungle.com/foodfarm/images/banner-girl.png'} alt={'image'}/>
                </div>
            </div>
        </div>
    );
};

export default InfoDownload;