import React, {useEffect, useState} from 'react';
import BlogItem from "./BlogItem.tsx";
import {getNotifyRecent} from "../../Helper/Helper.ts";
import Skeleton from "react-loading-skeleton";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

const Blog = () => {

    const [blogData, setBlogData] = useState<object[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            const response = await getNotifyRecent();
            setIsLoading(false)
            if( response.hasOwnProperty('code') && response.code === "ERR_NETWORK"){
                toast.error("Blog don't loading!");
                return;
            }
            if( response.status === 200 ){
                setBlogData(response.data);
            }else{
                toast.error(response.message);
            }
        }
        fetchData()
    }, []);

    return (
        <div className={'mx-[10%] mt-16'}>
          <div className={'flex justify-between items-center'}>
              <p className={'text-3xl font-bold'}>Our Recent Blog</p>
              <button className={'bg-green_primary p-2 rounded-[7px] text-white hover:bg-yellow-200 transition-all duration-300'} onClick={() => { scrollTo(0,0); navigate('blog')}}>View All</button>
          </div>
          <div className={`mt-8 grid ${blogData.length > 0 ? 'grid-cols-5' : 'grid-cols-1'} gap-4`}>
              {
                 isLoading ?
                     <>
                         <Skeleton className={'h-[230px]'}/>
                         <Skeleton className={'h-[230px]'}/>
                         <Skeleton className={'h-[230px]'}/>
                     </>
                     :
                     <>
                         {
                             blogData.length >  0 ?
                             blogData.map( (blog, index) =>
                                 <BlogItem image={blog.image} time={blog.time} title={blog.title} content={blog.content} isLoading={isLoading} key={index}/>
                             )
                                 :
                                 <>
                                     <div className={'flex items-center justify-center h-[200px] w-full border-dotted border-2'}>
                                         <p className={'text-xl'}>BLOG IS EMPTY</p>
                                     </div>
                                 </>
                         }
                     </>
              }
          </div>
        </div>
    );
};

export default Blog;