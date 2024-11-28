import {useContext, useEffect, useState} from 'react';
import {Drawer, GetProp, message, Spin, Switch, Upload, UploadProps} from "antd";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {updateInfoById} from "../../Helper/Helper.ts";
import {toast} from "react-toastify";
import {CommonContext} from "../../context/CommonContext.tsx";
import TableAddress from "./TableAddress.tsx";

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

type Props = {
    open : boolean,
    onClose: Function
}

const MyAccount = ( props : Props ) => {
    const {open, onClose} = props
    const [loading, setLoading] = useState(false);
    // BIEN FORM
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [email, setEmail] = useState<string>('')
    const [imageUrl, setImageUrl] = useState<string>('')
    const [edit, setEdit] = useState<boolean>(false);
    const { info, setInfo, setIsLogin} = useContext(CommonContext);
    // loading
    const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false)

    // function


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

    const handleSaveInfo: Function = async () => {
        setEdit(!edit)
        if( !edit){
            return;
        }
        if( localStorage.getItem("accessToken") === undefined) {
            setIsLogin(false);
            navigation('/login')
            return
        }
        setLoadingUpdate(true)
        const response = await updateInfoById(info.id,localStorage.getItem("accessToken"),firstName, lastName, phone, email, imageUrl )
        setLoadingUpdate(false)
        if( response.hasOwnProperty('code') && response.code === "ERR_NETWORK"){
            toast.error("NETWORK CONNTECTED FAIL!!!");
            return;
        }
        if( response.status === 200 ){
            setInfo(response.data);
        }else{
            toast.warning(response.message)
        }
    }

    useEffect(() => {
        if( info != null ){
            setFirstName(info.firstName);
            setLastName(info.lastName);
            setPhone(info.phone)
            setEmail(info.email);
            setImageUrl(info.imageUrl);
        }
    }, [info]);

    return (
        <Drawer title={
            <div className={'flex items-center justify-between'}>
                <p className={'text-xl text-green-500'}>My Account</p>
                <Switch checkedChildren="SAVE" unCheckedChildren="EDIT" value={edit} onChange={() => handleSaveInfo()}/>
            </div>
        } width={500} onClose={onClose} open={open}>
            <Spin tip={"Change..."} spinning={loadingUpdate}>
                <div className={'flex gap-4 flex-col'}>
                    <div className={'grid grid-cols-[1fr_2fr] items-center'}>
                        <Upload
                            name="avatar"
                            listType="picture-circle"
                            className="avatar-uploader"
                            showUploadList={false}
                            action={'http://localhost:8080/api/image'}
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                            disabled={!edit}
                        >
                            {imageUrl && !loading ? <img src={imageUrl} alt="avatar" style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%'
                            }}/> : uploadButton}
                        </Upload>
                        <div className={'flex flex-col gap-2'}>
                            <div className={'flex flex-col gap-2'}>
                                <label className={`${!edit ? 'text-gray-500' : 'text-green-500'} text-base font-bold`}>First
                                    name :</label>
                                <input disabled={!edit} value={firstName}
                                       onChange={e => setFirstName(e.target.value)}
                                       className={`text-base py-1 px-2 outline-0 border-b-2 ${!edit ? 'border-gray-500' : 'border-green-300'}`}/>
                            </div>
                            <div className={'flex flex-col gap-2'}>
                                <label className={`${!edit ? 'text-gray-500' : 'text-green-500'} text-base font-bold`}>Last
                                    name
                                    :</label>
                                <input disabled={!edit} value={lastName} onChange={e => setLastName(e.target.value)}
                                       className={`text-base py-1 px-2 outline-0 border-b-2 ${!edit ? 'border-gray-500' : 'border-green-300'}`}/>
                            </div>
                        </div>
                    </div>
                    <div className={'flex flex-col gap-2'}>
                        <label className={`${!edit ? 'text-gray-500' : 'text-green-500'} text-base font-bold`}>Number
                            phone :</label>
                        <input disabled={!edit} maxLength={11} min={10} value={phone}
                               onChange={e => setPhone(e.target.value)}
                               className={`text-base py-1 px-2 outline-0 border-b-2 ${!edit ? 'border-gray-500' : 'border-green-300'}`}/>
                    </div>
                    <div className={'flex flex-col gap-2'}>
                        <label className={`${!edit ? 'text-gray-500' : 'text-green-500'} text-base font-bold`}>Email
                            :</label>
                        <input disabled={!edit} type={"email"} value={email} onChange={e => setEmail(e.target.value)}
                               className={`text-base py-1 px-2 outline-0 border-b-2 ${!edit ? 'border-gray-500' : 'border-green-300'}`}/>
                    </div>
                    <div className={'flex-1 flex justify-center items-center gap-2'}>
                        <button
                            className={`${info.role === "ADMIN" ? "block" : "hidden"} flex-1 bg-green-500 text-white text-xl py-2 border-2 border-green-500 hover:bg-white hover:text-green-500`}>DASBBOARD
                        </button>
                    </div>
                    <TableAddress edit={edit}/>
                </div>
            </Spin>
        </Drawer>
    );
};

export default MyAccount;