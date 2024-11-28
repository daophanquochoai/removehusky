import { Table, TableColumnsType} from "antd";
import  {useEffect, useState} from "react";
import {toast} from "react-toastify";
import { getAllBlog} from "../../Helper/Helper.ts";
import {MdManageSearch} from "react-icons/md";
import ModalAddBlog from "./ModalAddBlog.tsx";


interface Tag{
    key : number;
    tag : string;
}
interface Blog{
    key : number;
    title : string;
    content : string;
    time :  Date;
    isEnabled : boolean;
    image : string;
    tag : Tag[];
}

const initBlog = {
    key : 0,
    title : '',
    content : '',
    time :  Date.now(),
    isEnabled : false,
    image : '',
    tag : []
}

interface Props {
    categoryType : number;
    setCategoryType : Function;
    dataTag : Tag[];
}

const BlogRight = ( props : Props ) => {

    const {categoryType, setCategoryType, dataTag} = props;
    //var
    const [dataBlog, setDataBlog] = useState<Blog[]>([]); // mang hien thi
    const [dataOrigin, setDataOrigin] = useState<Blog[]>([]); // luu lai mang ban dau
    const [dataFilterTag, setDataFilterTag] = useState<Blog[]>([]);
    const [value, setValue] = useState<string>(''); //search

    //useEffect
    useEffect(() => {
        const fetchBlog = async () => {
            if (localStorage.getItem("accessToken") == null) {
                toast.error("SESSION EXPIRED");
                return;
            }
            const response = await getAllBlog(localStorage.getItem("accessToken"));
            if( response.hasOwnProperty('code') && response.code === "ERR_NETWORK"){
                toast.error("NETWORK DON'T CONNECT");
                return;
            }
            if( response.status === 200 ){
                const arr : Blog[] = [];
                response.data.forEach(item => {
                    const temp = {
                        key: item.notifyId,
                        title: item.title,
                        content: item.content,
                        time: item.time,
                        isEnabled: item.isEnabled,
                        image: item.image,
                        tag: []
                    };
                    item.tag.forEach(t => {
                        temp.tag.push({
                            id: t.id,
                            tag: t.tag
                        })
                    });
                    arr.push(temp)
                });
                setDataBlog(arr);
                setDataOrigin(arr);
                setDataFilterTag(arr);
            }else{
                toast.error(response.message)
            }
        }

        fetchBlog();
    }, []);

    // filter
    useEffect(() => {
        if( categoryType == 0 ){
            setDataBlog(dataOrigin);
            setDataFilterTag(dataOrigin);
        }
        else {
            setDataBlog(dataOrigin.filter(blog => blog.tag.some( tag => tag.id ==  categoryType)));
            setDataFilterTag(dataOrigin.filter(blog => blog.tag.some( tag => tag.id ==  categoryType)))
        }
    }, [categoryType]);

    //search
    useEffect(() => {
        setDataBlog(dataFilterTag.filter(blog => blog.title.includes(value) || blog.content.includes(value)));
    }, [value]);


    // column
    const columns: TableColumnsType<Blog> = [
        {
            title: 'Title',
            dataIndex: 'title',
            align: 'center',
            width: '20%',
        },
        {
            title: 'Time',
            dataIndex: 'time',
            sorter: (a, b) => a.time.getTime() - b.time.getTime(),
            align: 'center',
            width: '20%',
        },
        {
            title: 'Image',
            render: (item: Blog) => (
               <div className={'flex items-center justify-center'}>
                   { item.image == null || item.image == '' ? <p>Empty</p> : <img src={item.image} alt="image" className="w-[40px] h-[40px]" />}
               </div>
            ),
            align: 'center',
            width: '20%',
        },
        {
            title: 'Tags',
            dataIndex: 'tag',
            key: 'tag',
            align: 'center',
            width: '40%', // Set a maximum width for the Tags column
            render: (tags: { id: number; tag: string }[]) => (
                <div className="max-w-[100%] overflow-x-auto whitespace-nowrap">
                    {tags.length > 5 ? tags.slice(0,5).map(tag => (
                        <span
                            key={tag.id}
                            style={{ marginRight: 8 }}
                            className="bg-green-500 text-white px-2 py-1 rounded font-bold"
                        >
                        {tag.tag}
                    </span>
                    )) :
                        (tags.map(tag => (
                            <span
                                key={tag.id}
                                style={{ marginRight: 8 }}
                                className="bg-green-500 text-white px-2 py-1 rounded font-bold"
                            >
                        {tag.tag}
                    </span>
                        )))
                    }
                </div>
            ),
        },
    ];

    //var modal
    const [action, setAction] = useState<string>('ADD');
    const [open, setOpen] = useState<boolean>(false);
    const [item, setItem] = useState<Blog>(initBlog);
    const [loadingModal, setLoadingModal] = useState<boolean>(false);

    //handle modal
    const handleModal = () => {
        setAction("ADD");
        setOpen(true);
    }

    return (
        <div className={'flex flex-col gap-6'}>
            <div className={'flex justify-between items-end'}>
                <div className={'font-bold mb-2'}>List Blog</div>
                <div className={'flex gap-2 items-end'}>
                    <div className={'flex gap-4 items-end'}>
                        <input value={value} onChange={(e) => setValue(e.target.value)}
                               className={'border-0 outline-0 p-2 border-b-2 border-green-300'}
                               placeholder={"Search blog"}/>
                        <MdManageSearch className={'text-2xl text-green-500 cursor-pointer'}/>
                    </div>
                    <button onClick={() => setCategoryType(0)} className={'bg-green-500 text-white px-2 py-1 hover:bg-white hover:text-green-500 transition-all duration-300 border-2 border-green-500'}>Clear</button>
                </div>
            </div>
            <div>
                <Table<Blog>
                    columns={columns}
                    dataSource={dataBlog}
                    // onChange={onChange}
                    pagination={{position: ["bottomCenter"], pageSize: 8}}
                    showSorterTooltip={{target: 'sorter-icon'}}
                    bordered={true}
                    onRow={ (record) => {
                        return {
                            onClick: () => {
                                setAction("EDIT");
                                setItem(record);
                                setOpen(true);
                            },
                        };
                    }}
                />
            </div>
            <div className={'flex'}>
                <button className={'bg-green-500 flex-1 text-white py-2 font-bold'} onClick={() => handleModal()}>ADD NEW BLOG</button>
            </div>
            <ModalAddBlog action={action} open={open} setOpen={setOpen} item={item} setItem={setItem} loadingModal={loadingModal} dataTag={dataTag} dataBlog={dataBlog} setDataBlog={setDataBlog} setLoadingModal={setLoadingModal} />
        </div>
    );
};

export default BlogRight;