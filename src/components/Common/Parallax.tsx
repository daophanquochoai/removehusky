import {ParallaxBanner} from "react-scroll-parallax";
import {NavLink} from "react-router-dom";

type Props = {
    image : string,
    path : string,
}

const Parallax = (props : Props) => {
    return (
        <div>
            <ParallaxBanner
                style={{height : 600}}
                layers={[
                    { image: props.image === '' ? 'https://demo.templatesjungle.com/foodfarm/images/bg-vegetables.jpg' : props.image, speed: -20 },
                ]}
                className="aspect-[2/1]"
            >
                <div className="absolute inset-0 flex items-center justify-start mx-[10%] ">
                    <div className={'flex flex-col gap-4'}>
                        <div className={'text-white text-2xl'}><NavLink to={'/'}>HOME</NavLink> / <span className={'text-green_primary'}>{props.path}</span></div>
                        <div className={'text-8xl font-bold text-white'}>{props.path}</div>
                    </div>
                </div>
            </ParallaxBanner>
        </div>
    );
};

export default Parallax;