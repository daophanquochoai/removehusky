import React from 'react';
import {FaCalendarDay} from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import {formatTime} from "../../Helper/Helper.ts";

type Props = {
    image : string,
    time : string,
    title : string,
    content : string,
    isLoading : boolean
}
const BlogItem:React.FC = ( props : Props) => {
    return (
        <div className={'grid grid-cols-1 gap-4 shadow_primary hover:scale-105 transition-all duration-300 cursor-pointer p-4'}>
            <div>
                {
                    props.isLoading ?
                        <Skeleton className={'w-full h-[200px]'}/>
                        :
                        <img src={props.image} alt={'blog'}/>
                }
            </div>
            <div className={'flex flex-col items-center justify-center'}>
                {
                    props.isLoading ?
                        <>
                            <Skeleton />
                            <Skeleton />
                            <Skeleton />
                        </>
                        :
                        <>
                            <div className={'flex items-center gap-4 justify-center text-gray-300'}><FaCalendarDay />{formatTime(props.time)}</div>
                            <h3  className={'text-2xl font-bold title-shortcut'}>{props.title}</h3>
                            <p className={'shortcut'}>{props.content}</p>
                        </>
                }
            </div>
        </div>
    );
};

export default BlogItem;