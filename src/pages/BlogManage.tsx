import BlogRight from "../components/BlogManage/BlogRight.tsx";
import CategoryLeft from "../components/BlogManage/CategoryLeft.tsx";
import {useEffect, useState} from "react";
import {getBlogTag} from "../Helper/Helper.ts";
import {toast} from "react-toastify";


interface Tag{
    key : number;
    tag : string;
}

const BlogManage = () => {

    //var
    const [categoryType, setCategoryType] = useState<number>(0);
    const [dataTag, setDataTag] = useState<Tag[]>([]);
    const [loading, setLoading] = useState<boolean>(false); // loading table
    // load tag
    useEffect(() => {
        const fetchTag = async () => {
            setLoading(true);
            const response = await getBlogTag();
            setLoading(false)
            if( response.hasOwnProperty('code') && response.code === "ERR_NETWORK"){
                toast.error("NETWORK DON'T CONNECT");
                return;
            }
            if( response.status === 200 ){
                const arr : Tag[] = [];
                response.data.forEach( item => {
                    arr.push({
                        key : item.id,
                        tag : item.tag
                    })
                })
                setDataTag(arr);
            }else{
                toast.error(response.message)
            }
        }
        fetchTag();
    }, []);
    return (
        <div>
            <div></div>
            <div className={'grid grid-cols-[2fr_1fr] gap-4'}>
                <div>
                    <BlogRight categoryType={categoryType} setCategoryType={setCategoryType} dataTag={dataTag}/>
                </div>
                <div>
                    <CategoryLeft setCategoryType={setCategoryType} categoryType={categoryType} dataTag={dataTag} loading={loading} setLoading={setLoading} setDataTag={setDataTag}/>
                </div>
            </div>
        </div>
    );
};

export default BlogManage;