import React, {useState} from 'react';
import {GetProp, Input, Spin, UploadProps} from "antd";
import {RiLockPasswordFill, RiLockPasswordLine} from "react-icons/ri";
import { registerAccount} from "../Helper/Helper.ts";
import { FaPhoneAlt} from "react-icons/fa";
import {NavLink, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import { message, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {MdEmail} from "react-icons/md";
import {BiRename, BiSolidRename} from "react-icons/bi";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

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

const Register : React.FC = () => {
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>('')
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [passWord, setPassWord] = useState<string>('');
    const [rePassWord, setRePassWord] = useState<string>('');
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

    const navigation = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingSubmit(true);
        if( passWord !== rePassWord ){
            toast.warning("Password don't accept!!")
            setLoadingSubmit(false)
            return;
        }
        if( !firstName.length || !lastName.length || !email.length || !phone.length || !passWord.length || !rePassWord.length ){
            toast.warning("Field can't empty!!");
            setLoadingSubmit(false)
            return;
        }
        if( phone.length != 10  && phone.length != 11){
            toast.warning("Phone don't format!!");
            setLoadingSubmit(false)
            return;
        }
        const response : object = await registerAccount(email,firstName,lastName,imageUrl,phone,passWord);
        if( response.status === 201 ){
            toast.info("Account created successful!!")
            navigation('/login');
        } else if( response.status === 400 ){
            console.log(response)
            Object.values(response.response.data).forEach( (item : string) => {
                toast.error(item);
            })
            setLoadingSubmit(false);
            return
        }
        else{
            toast.error("Account created fail!!")
            setLoadingSubmit(false)
        }
    }

    const handleChange: UploadProps['onChange'] = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            setImageUrl(info.file.response);
        }
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    return (
        <Spin tip="Loading..." spinning={loadingSubmit}>
            <div className={'w-full h-[100vh] flex items-center justify-center'}>
                <div className={'border-2 rounded-2xl overflow-hidden shadow_form'}>
                    <div className={'bg-green_primary w-[400px] p-4'}>
                        <h2 className={'text-center text-3xl text-white font-bold'}>Sign In</h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className={'px-5 mt-8 grid grid-cols-[1fr_2fr] items-center'}>
                            <Upload
                                name="avatar"
                                listType="picture-circle"
                                className="avatar-uploader"
                                showUploadList={false}
                                action={'http://localhost:8080/api/image'}
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                            >
                                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%', height: '100%',borderRadius : '50%' }} /> : uploadButton}
                            </Upload>
                            <div className={'flex gap-2 flex-col'}>
                                <Input value={firstName} required onChange={(e) =>setFirstName(e.target.value)} size="large" placeholder="First name" prefix={<BiRename />} />
                                <Input value={lastName} required onChange={(e) =>setLastName(e.target.value)} size="large" placeholder="Last name" prefix={<BiSolidRename />} />
                            </div>
                        </div>
                        <div className={'px-5 mt-8'}>
                            <Input value={email} type={"email"}  onChange={(e) =>setEmail(e.target.value)} size="large" placeholder="Email" prefix={<MdEmail />} />
                        </div>
                        <div className={'px-5 mt-8'}>
                            <Input value={phone} minLength={10} maxLength={11} onChange={(e) =>setPhone(e.target.value)} size="large" placeholder="Phone" prefix={<FaPhoneAlt />} />
                        </div>
                        <div className={'px-5 mt-8'}>
                            <Input.Password
                                value={passWord}  onChange={(e) =>setPassWord(e.target.value)}
                                size="large" placeholder="Password" prefix={<RiLockPasswordLine />}
                                minLength={6}
                                visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                            />
                        </div>
                        <div className={'px-5 mt-8'}>
                            <Input.Password
                                value={rePassWord}  onChange={(e) =>setRePassWord(e.target.value)}
                                size="large" placeholder="Accept Password" prefix={<RiLockPasswordFill />}
                                minLength={6}
                                visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                            />
                        </div>
                        <div className={'flex items-center justify-center'}>
                            <button className={'mt-8 bg-green_primary text-white w-[50%] py-2 rounded-2xl hover:bg-white border-2 border-green_primary hover:text-green_primary'}>
                                Submit
                            </button>
                        </div>
                    </form>
                    <div className={'flex flex-col items-center justify-center mt-2 mb-2'}>
                        <NavLink to={'/forget-account'} className={'text-gray-300'}>Forget account ?</NavLink>
                        <NavLink className={'text-green-300'} to={'/login'}>Sign In</NavLink>
                    </div>
                </div>
            </div>
        </Spin>
    );
};

export default Register;