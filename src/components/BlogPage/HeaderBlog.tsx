import React, {useEffect, useState} from 'react';
import {Dropdown, MenuProps, Space, Spin} from "antd";
import {GrUp} from "react-icons/gr";
import {DownOutlined} from "@ant-design/icons";
import {IoMdSearch} from "react-icons/io";
import {getBlogTag} from "../../Helper/Helper.ts";
import {toast} from "react-toastify";

type Props = {
    sortBy : string,
    searchBlog : string,
    setSearchBlog : Function,
    setSortBy : Function,
}
const HeaderBlog  = (props : Props) => {
    const [isLoadingTag, setIsLoadingTag] = useState<boolean>(false);
    const [items, setItems] = useState<MenuProps[]>([])
    const [open, setOpen] = useState<boolean>(false);

    //useEffect
    useEffect(() => {
        const fetchTags = async () => {
            setIsLoadingTag(true)
            const response = await getBlogTag();
            setIsLoadingTag(false)
            if(response.hasOwnProperty('code') && response.code === "ERR_NETWORK"){
                toast.error("Load Tags Blogs Fail!!");
                return;
            }
            if( response.status === 200 ){
                const temp : MenuProps[] = [{
                    key : 0,
                    label : <p className={'w-full'} onClick={ e => props.setSortBy('')}>All</p>
                }]
                response.data.forEach( tag => temp.push({
                    key : tag.id,
                    label : <p onClick={ e => props.setSortBy(e.target.textContent)}>{tag.tag}</p>
                }))
                setItems(temp);
            }
        }
        fetchTags();
    }, []);

    return (
        <div className={'flex items-center justify-between mx-[5%] mt-6'}>
            <p className={'text-3xl font-bold'}>Our Recent Blog</p>
            <Spin spinning={isLoadingTag}>
                <div className={'border-2 border-green-500 rounded-xl flex overflow-hidden'}>
                    <Dropdown menu={{items}} className={'p-2 px-4 text-gray-400 cursor-pointer bg-green-500'}
                              onOpenChange={e => setOpen(e)}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space className={'text-white text-base font-bold flex items-center'}>
                                <p>{props.sortBy === '' ? 'Sort by' : props.sortBy}</p>
                                {open ? <GrUp/> : <DownOutlined/>}
                            </Space>
                        </a>
                    </Dropdown>
                    <div className={'flex items-center'}>
                        <input value={props.searchBlog} onChange={e => props.setSearchBlog(e.target.value)}
                               className={'text-xl outline-none text-gray-300 bg-gray_primary px-4 py-1'}
                               placeholder={"Search blog"}/>
                        <IoMdSearch className={'text-3xl cursor-pointer text-gray-200 w-[40px]'}/>
                    </div>
                </div>
            </Spin>
        </div>
    );
};

export default HeaderBlog;