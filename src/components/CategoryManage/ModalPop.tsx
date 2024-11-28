import {GetProp, Image, Modal, Upload, UploadFile, UploadProps} from "antd";
import React, {useEffect, useState} from "react";
import {PlusOutlined} from "@ant-design/icons";

type Props = {
    action : string,
    open : boolean,
    setOpen : Function,
    item : Category,
    handle : Function,
    setItem : Function,
    loadingModal : boolean
}
interface Category {
    key: number;
    categoryTitle: string;
    imageUrl : string;
}

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const ModalPop = ( props : Props) => {
    const {action, open, setOpen, item, handle, setItem, loadingModal} = props;

    //var
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    //useEffect
    useEffect(() => {
        if( item.imageUrl ){
            setFileList([
                {
                    uid: '1',
                    name: item.categoryTitle,
                    status: 'done',
                    url: item.imageUrl,
                }
            ])
        }
    }, [item]);

    //function
    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>{
        setFileList( newFileList.map( item => {
            if( item.hasOwnProperty('response')){
                return {
                    uid: item.uid,
                    name: item.name,
                    status: 'done',
                    url: item.response,
                }
            }
            return item;
        }))
        setItem({...item, imageUrl : newFileList.length == 0 ? '' : newFileList[0].response});
    }
    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };
    return (
        <Modal
            title={<p className={'text-xl font-bold text-green-500'}>{action == 'ADD' ? "Add Product" : "Edit Product With ID = " + item.key}</p>}
            footer={
                action == 'ADD' ?
                    <button onClick={() => handle()} className={'bg-green-500 text-white px-3 py-2 rounded'}>Add Product</button>
                    :
                    <button onClick={() => handle()}  className={'bg-green-500 text-white px-3 py-2 rounded'}>Save Product</button>
            }
            centered
            width={500}
            loading={loadingModal}
            open={open}
            onCancel={() => setOpen(false)}
        >
            <div className={'flex items-end gap-4'}>
                <div className={'flex flex-col gap-2'}>
                    <label>Category Name :</label>
                    <input value={item.categoryTitle}
                           onChange={(e) => setItem({...item, categoryTitle: e.target.value})}
                           className={'border-b-2 border-green-500 outline-0'}/>
                </div>
                <div>
                    <Upload
                        action="http://localhost:8080/api/image"
                        listType="picture-card"
                        onPreview={handlePreview}
                        onChange={handleChange}
                        fileList={fileList}
                        maxCount={1}
                        name={"avatar"}
                    >
                        {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                    {previewImage && (
                        <Image
                            wrapperStyle={{display: 'none'}}
                            preview={{
                                visible: previewOpen,
                                onVisibleChange: (visible) => setPreviewOpen(visible),
                                afterOpenChange: (visible) => !visible && setPreviewImage(''),
                            }}
                            src={previewImage}
                        />
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ModalPop;