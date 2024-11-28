// @ts-ignore
import React, {useEffect, useState} from 'react';
import {getBlogByOption} from "../../Helper/Helper.ts";
import {toast} from "react-toastify";
import {Divider, Pagination, Spin} from "antd";

type Blog = {
    id : number;
    title : string;
    image : string;
    time : string;
    content : string;
}
type Props = {
    searchBlog : string,
    setSearchBlog : Function,
    sortBy : string,
    setSortBy : Function,
    pageBlog : number,
    setPageBlog : Function,
    totalPageBlog : number,
    setTotalPageBlog : Function
}

const RenderBlog = (props : Props) => {


    const [blogList, setBLogList] = useState<Blog[]>([])
    // loading
    const [isLoadingBLog, setIsLoadingBlog] = useState<boolean>(false);
    useEffect(() => {
        const fetchBlog = async () => {
            setIsLoadingBlog(true)
            const response = await getBlogByOption(props.searchBlog, props.sortBy, props.pageBlog);
            setIsLoadingBlog(false)
            if( response.hasOwnProperty('code') && data.code === "ERR_NETWORK"){
                toast.error("Product don't loading!");
                return;
            }
            if( response.status === 200 ){
                props.setPageBlog(response.data.page)
                props.setTotalPageBlog(response.data.totalPage)
                const temp:Blog[] = []
                response.data.notifys.forEach( blo =>
                    temp.push({
                        id : blo.notifyId,
                        title : blo.title,
                        image : blo.image,
                        time : blo.time,
                        content : blo.content
                    })
                )
                setBLogList(temp);
            }else{
                toast.error(response.message)
            }
        }
        fetchBlog()
    }, [props.searchBlog, props.sortBy, props.pageBlog]);
    return (
        <Spin tip={"Loading..."} spinning={isLoadingBLog}>
            <div className={`grid ${blogList.length > 0 ? 'grid-cols-5' : 'grid-cols-1'} mx-[5%] mt-6 gap-4`}>
                {
                    blogList.length > 0 ? (
                        blogList.map((blo, index) => (
                            <div key={index}
                                 className={'border-2 hover:scale-105 shadow_primary cursor-pointer transition-all duration-300'}>
                                <div className={'h-[50%] overflow-hidden'}>
                                    <img
                                        src={`${blo.image === null ? 'https://thinkzone.vn/uploads/2022_01/blogging-1641375905.jpg' : blo.image}`}
                                        alt={'blog'}
                                        className={'w-full h-full object-center'}/>
                                </div>
                                <Divider><span className={'text-gray-300'}>{blo.time}</span></Divider>
                                <div className={'p-4 pt-0'}>
                                    <h2 className={'title-shortcut text-xl font-bold text-center'}>{blo.title}</h2>
                                    <p className={'shortcut text-gray-400 mt-4 text-center'}>{blo.content}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={'h-[250px] border-2 border-dotted flex items-center justify-center w-full'}>
                            <p className={'text-2xl font-bold text-gray-300'}>Blog Not Found</p>
                        </div>
                    )
                }
            </div>

            <div className={'flex items-center justify-center w-full my-6'}>
                {
                    blogList.length > 0 &&
                    <Pagination defaultCurrent={props.pageBlog} total={props.totalPageBlog * 8}
                                onChange={(e) => console.log(e)}/>
                }
            </div>
        </Spin>
    );
};

export default RenderBlog;