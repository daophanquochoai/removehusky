import React from 'react';
import {Link} from "react-router-dom";

const NotFoundPage : React.FC = () => {
    return (
        <div className="relative">
            <img
                className={'w-full h-[100vh]'}
                src="https://www.pngitem.com/pimgs/m/561-5616833_image-not-found-png-not-found-404-png.png"
                alt="not-found"
            />
            <Link to="/" className="absolute top-[75vh] left-[47%]">
                <button className={'bg-green_primary px-4 py-2 text-white border-2 border-green_primary hover:bg-white hover:text-green_primary rounded-2xl'}>Go Home</button>
            </Link>
        </div>
    );
};

export default NotFoundPage;