import {GetProp, message, Modal, Switch, Upload, UploadProps} from "antd";
import { useEffect, useState } from "react";
import { TreeSelect } from 'antd';
import {toast} from "react-toastify";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {addBlog} from "../../Helper/Helper.ts";

const { SHOW_PARENT } = TreeSelect;
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        toast.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};
interface Tag {
    key: number;
    tag: string;
}
interface Blog {
    key: number;
    title: string;
    content: string;
    time: Date;
    isEnabled: boolean;
    image: string;
    tag: Tag[];
}

type Props = {
    action: string,
    open: boolean,
    setOpen: Function,
    item: Blog,
    setItem: Function,
    loadingModal: boolean,
    dataTag: Tag[],
    dataBlog : Blog[],
    setDataBlog: Function,
    setLoadingModal : Function
}

type Tree = {
    title: string,
    value: string,
    key: string
}

const initBlog = {
    key: 0,
    title: '',
    content: '',
    time: Date.now(),
    isEnabled: false,
    image: '',
    tag: []
}

const ModalAddBlog = (props: Props) => {
    const { action, open, setOpen, item, setItem, loadingModal, dataTag,dataBlog, setDataBlog , setLoadingModal } = props;
    const [treeData, setTreeData] = useState<Tree[]>([]);
    const [listTag, setListTag] = useState<string[]>([]);

    // image
    const [imageUrl, setImageUrl] = useState<string>('');
    const [loading, setLoading] =  useState(false);

    useEffect(() => {
        console.log(item)
    }, [item]);
    useEffect(() => {
        const arr : string[]  = [];
        item?.tag.forEach( tag => {
            arr.push(tag.id.toString());
        })
        setListTag(arr);
        setImageUrl(item.image ==  null ? "" : item.image)
    }, [item]);

    useEffect(() => {
        const treeTag: Tree[] = [];
        dataTag.forEach(tag => {
            treeTag.push({
                title: tag.tag,
                value: tag.key.toString(),
                key: tag.key.toString()
            });
        });
        setTreeData(treeTag);
    }, [dataTag]);

    const handleTagChange = (value: string[]) => {
        setListTag(value);  // updates listTag with selected values
        console.log("Selected Tags:", value);
    }

    const handleClose = () => {
        setOpen(false);
        setItem(initBlog);
    }
    const handleChange: UploadProps['onChange'] = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            setLoading(false)
            setImageUrl(info.file.response);
        }
    };
    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    //change  disable
    const changeDisable = (e: boolean) =>  {
        setItem({
            ...item,
            isEnabled : e
        })
    }

    const handleChangeTitle = (value: string)=> {
        setItem({
            ...item,
            title : value
        })
    }

    const handleChangeContent =  (value: string) => {
        setItem({
            ...item,
            content : value
        })
    }

    const handleSubmit = async () => {
        if( localStorage.getItem("accessToken") == null  ){
            message.error("Token expired!")
            return;
        }
        setLoadingModal(true)
        const response = await addBlog(item.key, item.title, item.content, item.isEnabled  ==  null ? false : item.isEnabled, imageUrl, listTag, localStorage.getItem("accessToken"));
        setLoadingModal(false);
        if( response.hasOwnProperty('code') && response.code === "ERR_NETWORK"){
            toast.error("NETWORK CONNTECTED FAIL!!!");
            return;
        }
        console.log(response);
        if( response.status === 200){
            if( action === "ADD"){
                message.success("Blog created successfully!");
                const temp = {
                    key: response.data.notifyId,
                    title: response.data.title,
                    content: response.data.content,
                    time: response.data.time,
                    isEnabled: response.data.isEnabled,
                    image: response.data.image,
                    tag: []
                };

                response.data.tag.forEach(t => {
                    temp.tag.push({
                        id: t.id,
                        tag: t.tag
                    });
                });

                setDataBlog([
                    ...dataBlog,
                    temp
                ])
            }else{
                message.success("Blog updated successfully!");
                const temp = {
                    key: response.data.notifyId,
                    title: response.data.title,
                    content: response.data.content,
                    time: response.data.time,
                    isEnabled: response.data.isEnabled,
                    image: response.data.image,
                    tag: []
                };

                response.data.tag.forEach(t => {
                    temp.tag.push({
                        id: t.id,
                        tag: t.tag
                    });
                });

                setDataBlog([
                    ...dataBlog.filter( b => b.key !== response.data.notifyId ),
                    temp
                ])
            }
            setOpen(false);
        }else{
            message.error(response.message);
        }
    }

    return (
        <Modal
            title={<p
                className={'text-xl font-bold text-green-500'}>{action === 'ADD' ? "Add Product" : "Edit Product With ID = " + item.key}</p>}
            footer={
                    <button onClick={() => handleSubmit()} className={'bg-green-500 text-white px-3 py-2 rounded'}> { action === "ADD"  ? "Add Product" : "Save Product"}</button>
            }
            centered
            width={500}
            loading={loadingModal}
            open={open}
            onCancel={handleClose}
        >
            <div className={'flex justify-between gap-4'}>
                <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploaderz"
                    showUploadList={false}
                    action={'http://localhost:8080/api/image'}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                >
                    {imageUrl && !loading ? <img src={imageUrl} alt="avatar" style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '5px',
                        padding: '5px'
                    }}/> : uploadButton}
                </Upload>
                <div className={'flex justify-start flex-col flex-1 gap-4'}>
                    <input className={'text-green-500 font-bold text-xl border-0 outline-0 border-b-2 border-green-500'} value={item.title} onChange={(e) => handleChangeTitle(e.target.value)}/>
                    <div className={'flex items-center gap-2'}>
                        <span className={'text-gray-500'}>Disable</span>
                        <Switch value={item.isEnabled} size={"small"} onChange={ (e) => changeDisable(e)}/>
                    </div>
                </div>
            </div>
            <textarea className={'w-full outline-0 border-2 border-gray-200 text-gray-500 min-h-[200px] p-4 mt-4'} value={item.content}  onChange={(e) => handleChangeContent(e.target.value)}/>
            <TreeSelect
                treeData={treeData}
                value={listTag}
                onChange={handleTagChange}
                treeCheckable={true}
                showCheckedStrategy={SHOW_PARENT}
                placeholder="Please select"
                style={{width: '100%'}}
            />
        </Modal>
    );
};

export default ModalAddBlog;
