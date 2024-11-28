import {useContext, useEffect, useState} from 'react';
import {CommonContext} from "../context/CommonContext.tsx";
import {IoCaretBack} from "react-icons/io5";
import {useNavigate} from "react-router-dom";
import {GetProp, Space, Spin, Table, TableColumnsType, TreeSelect, TreeSelectProps} from "antd";
import {getAddressByEmail, paymentCart} from "../Helper/Helper.ts";
import {toast} from "react-toastify";
import type { RadioChangeEvent } from 'antd';
import { Radio } from 'antd';

type DefaultOptionType = GetProp<TreeSelectProps, 'treeData'>[number];

interface DataType {
    key : number;
    imageUrl : string;
    productTitle: string;
    quantity: number;
}

const AcceptPage = () => {
    const navigate = useNavigate();
    const {acceptCart, info} = useContext(CommonContext);
    const [dataSource, setDataSource] = useState<DataType[]>([]);
    const [loadingAddress, setLoadingAddress] = useState<boolean>(false);
    const [payment, setPayment] = useState(1);
    const [treeData, setTreeData] = useState<Omit<DefaultOptionType, 'label'>[]>();
    const [addDefault, setAddDefault] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [total, setTotal] = useState<number>(0)
    const [address, setAddress] = useState<string>('');
    const [openAddress, setOpenAddress] = useState<boolean>(false);
    const [numberPhone, setNumberPhone] = useState<string>(info.phone)
    const [loadingPayment, setIsLoadingPayment] = useState<boolean>(false);

    //useEffedt
    useEffect(() => {
        const arr:DataType[] = [];
        let sum : number = 0;
        acceptCart.forEach( item => {
            sum += item.price * item.quantity
            arr.push(
                {
                    key : item.productId,
                    productTitle: item.title,
                    imageUrl : item.image,
                    quantity: item.quantity,
                }
            )
        })
        setTotal(sum);
        setDataSource(arr)
    }, []);

    useEffect(() => {
        const fetchAddress = async () => {
            if( localStorage.getItem("accessToken") == undefined){
                localStorage.removeAll();
                navigate('/login')
                return;
            }
            setLoadingAddress(true)
            const response = await getAddressByEmail(localStorage.getItem("accessToken"));
            setLoadingAddress(false);
            if( response.hasOwnProperty('code') && response.code === "ERR_NETWORK" ){
                toast.error("Load Address Fails!!!!");
                return;
            }
            if( response.status === 200 ){
                const arr : Omit<DefaultOptionType, 'label'>[] = [];
                response.data.forEach( (item, index) => {
                    arr.push({ id: item.address, pId: 0, value: item.id, title : <p className={'text-green-500'}>{item.address}</p>})
                    if( item.isDefault ){
                        setAddDefault(item.address)
                    }
                })
                setTreeData(arr);
            }else{
                toast.error(response.message)
            }
        }
        fetchAddress();
    }, []);

    // type
    const columns: TableColumnsType<DataType> = [
        {
            title: 'Product Name',
            align:  'center',
            render: ( item : DataType ) => (
                <div className={'flex items-center justify-center gap-2'}>
                    <img className={'w-[50px] h-[50px]'} src={item.imageUrl}/>
                    <p className={'shortcut'}>{item.productTitle}</p>
                </div>
            )
        },
        {
            title : 'Quantity',
            align:  'center',
            render: ( item : DataType ) => (
                <p>{item.quantity}</p>
            )
        }
    ];


    interface PaymentDto {
        productId : number;
        quantity : number;
    }
    //function
    const handleAcceptCart = async () => {
        if(localStorage.getItem('accessToken') === null ){
            navigate("/login")
            toast.warning("SESSION EXPIRED!!!")
            return;
        }
        const paymentItemList : PaymentDto[] = [];
        acceptCart.forEach( item => {
            paymentItemList.push({
                productId : item.productId,
                quantity : item.quantity
            })
        })
        setIsLoadingPayment(true)
        const response = await paymentCart(paymentItemList, openAddress ? address : addDefault, numberPhone,0,total,description, localStorage.getItem("accessToken"));
        setIsLoadingPayment(false)
        console.log(response)
        if( response.hasOwnProperty('code') && response.code === "ERR_NETWORK" ){
            toast.error("NETWORK FAILING!!!!");
            return;
        }
        if( response.status === 200 ){
            navigate('/')
            toast.success("PAYMENT SUCCESS!!")
        }
        else if( response.status === 401){
            toast.warning("SESSION EXPIRED!!!")
        }else{
            toast.error(response.message)
        }

    }
    const onChangePayment = (e: RadioChangeEvent) => {
        setPayment(e.target.value);
    };
    const onChangeAddress = (e) => {
        setAddDefault(e);
    }

    const handleAddress = () => {
        setOpenAddress(!openAddress);
    }

    return (
        <Spin tip={"Paymenting..."} spinning={loadingPayment}>
            <div className={'mt-6 flex flex-col gap-4'}>
                <div>
                    <div
                        className={'flex items-center justify-start text-xl font-bold text-green_primary cursor-pointer'}
                        onClick={() => navigate(-1)}>
                        <IoCaretBack/> BACK
                    </div>
                </div>
                <div className={'text-4xl text-green-500 font-bold text-center'}>
                    <h2>ACCEPT ORDER</h2>
                </div>
                <div className={'mt-6 mx-[5%]'}>
                    <Table<DataType> scroll={{y: 400}} columns={columns} dataSource={dataSource} pagination={false}
                                     bordered={true}/>
                </div>
                <div className={'flex justify-center items-center gap-4'}>
                    <div className={'border-2 p-4'}>
                        <div className={'flex justify-center items-center gap-4 flex-col p-4 border-b-2'}>
                            <p className={'text-2xl text-green-500 font-bold'}>Payment</p>
                            <Radio.Group onChange={onChangePayment} value={payment}>
                                <Space direction={"vertical"}>
                                    <Radio value={1}>Payment upon receipt</Radio>
                                    <Radio value={2}>VNPAY</Radio>
                                </Space>
                            </Radio.Group>
                        </div>
                        <div className={'flex justify-center items-center gap-4 flex-col p-4 border-b-2'}>
                            <p className={'text-2xl text-green-500 font-bold'}>Address</p>
                            <div className={'flex gap-2 flex-col'}>
                                 <div className={'flex gap-2'}>
                                    <TreeSelect
                                        treeDataSimpleMode
                                        style={{minWidth: '200px'}}
                                        value={addDefault}
                                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                        placeholder="Please select"
                                        onChange={onChangeAddress}
                                        loading={loadingAddress}
                                        treeData={treeData}
                                    />
                                    <button
                                        onClick={handleAddress}
                                        className={'bg-green-500 text-white border-2 border-green-500 hover:bg-white hover:text-green-500 px-2 rounded-xl'}>
                                        { openAddress ? 'Hidden' : 'New'}
                                    </button>
                                </div>
                                <input className={`outline-0 border-b-2 border-green-500 w-3/4 ${openAddress ? 'inline-block' : 'hidden'}`} value={address} onChange={(e) => setAddress(e.target.value)}/>
                            </div>
                        </div>
                        <div className={'flex justify-center flex-col items-center gap-4 p-4'}>
                            <p className={'text-xl text-green-500 font-bold'}>Description</p>
                            <input value={description} onChange={(e) => setDescription(e.target.value)}
                                   className={'border-b-2 border-green-500 text-base min-w-[200px] text-center outline-0 py-1'}
                                   placeholder="Description"/>
                        </div>
                    </div>
                    <div className={'border-2 p-4 min-w-[300px]'}>
                        <div className={'flex justify-center flex-col items-center gap-4 p-4'}>
                            <p className={'text-xl text-green-500 font-bold'}>Phone : </p>
                            <input value={numberPhone} onChange={(e) => setNumberPhone(e.target.value)}
                                   maxLength={10}
                                   className={'border-b-2 border-green-500 text-base min-w-[200px] text-center outline-0 py-1'}
                                   placeholder="Description"/>
                        </div>
                        <div>
                            <div className={'flex justify-between'}>
                                <p className={'text-xl text-green-500 font-bold'}>Số Tiền :</p>
                                <p className={'text-gray-500 font-bold'}>{total}đ</p>
                            </div>
                            <div className={'flex justify-between items-center gap-4'}>
                                <p className={'text-green-500 text-xl font-bold'}>Phí vận chuyển :</p>
                                <p className={'text-gray-500 font-bold'}>0đ</p>
                            </div>
                            <div className={'flex justify-between'}>
                                <p className={'text-green-500 text-xl font-bold'}>Tổng :</p>
                                <p className={'text-gray-500 font-bold'}>{total}đ</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={'flex justify-center items-center mt-4'}>
                    <button onClick={() => handleAcceptCart()}
                            disabled={addDefault == 0 && !loadingPayment}
                            className={'text-xl font-bold border-2 border-green-500 px-4 py-2 text-white bg-green-500 hover:text-green-500 hover:bg-white'}>Payment
                    </button>
                </div>
            </div>
        </Spin>
    );
};

export default AcceptPage;