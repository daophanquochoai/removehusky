import {Modal, Radio, Spin, Table, TableColumnsType} from "antd";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {addAddressByEmail, getAddressByEmail, removeAddressWithEmail, setAddressDefault} from "../../Helper/Helper.ts";
import {toast} from "react-toastify";
import {CommonContext} from "../../context/CommonContext.tsx";

interface DataType {
    key : number;
    address : string;
    isDefault : boolean;
}

type Props = {
    edit : boolean;
}
const TableAddress  = ( props: Props) => {

    // bien
    const {edit} = props;
    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState<DataType[]>([]);
    const [loadingTable, setLoadingTable] = useState<boolean>(false);
    const {setIsLogin} = useContext(CommonContext);
    //modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [checkedDefault, setCheckedDefault] = useState<boolean>(true);
    const [addressNew, setAddressNew] = useState<string>('')

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        setIsModalOpen(false);
        setAddressNew('');
        if( localStorage.getItem("accessToken") === null ){
            navigate('/login')
            setIsLogin(false);
            localStorage.removeAll();
            return;
        }
        setLoadingTable(true);
        const response = await addAddressByEmail(addressNew,checkedDefault, localStorage.getItem("accessToken"));
        setLoadingTable(false);
        if( response.hasOwnProperty('code') && response.code === "ERR_NETWORK"){
            toast.error("NETWORK CONNTECTED FAIL!!!");
            return;
        }
        if( response.status === 200 ){
            const arr : DataType[]  = dataSource.map( (item, index) => {
                return {
                    key : item.key,
                    address : item.address,
                    isDefault : checkedDefault ? false : item.isDefault,
                }
            })
            arr.push({
                key : response.data.id,
                address : response.data.address,
                isDefault : response.data.isDefault
            })
            setDataSource(arr);
        }else if( response.status === 500 ){
            toast.error("SERVER_ERROR!");
        }else {
            toast.error(response.message);
        }
    };


    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const columns: TableColumnsType<DataType> = [
        {
            title: <p className={`${edit ? 'text-green-500' : 'text-gray-500'}`}>Address</p>,
            align:  'center',
            render: ( item : DataType ) => (
                <p className={`${item.isDefault ? 'text-green-500' : 'text-gray-500'} `}>{item.address}</p>
            )
        },
        {
            title : <p className={`${edit ? 'text-green-500' : 'text-gray-500'}`}>Action</p>,
            align:  'center',
            render: ( item : DataType ) =>
                <>
                    {
                        item.isDefault ?
                            <>
                                <div className={'flex justify-center'}>
                                    <p className={'text-white bg-green-500 border-green-500 border-2 px-2 py-1 rounded'}>Default</p>
                                </div>
                            </>
                            :
                            <>
                                <div className={'flex justify-center flex-col gap-1'}>
                                    <button onClick={() => setDefault(item.key)} className={`${edit ? 'bg-green-500 text-white' : ' border-2 text-gray-500'} px-2 py-1 rounded`} disabled={!edit}>Set Default</button>
                                    <button onClick={() => removeAddress(item.key)} className={`${edit ? 'bg-red-500 text-white' : 'border-2 text-gray-500'} px-2 py-1 rounded`} disabled={!edit}>Remove</button>
                                </div>
                            </>
                    }
                </>
        },
    ];

    // useEffedt
    useEffect(() => {
        const fetchAddress = async () => {
            if( localStorage.getItem("accessToken") == undefined){
                localStorage.removeAll();
                navigate('/login')
                return;
            }
            setLoadingTable(true);
            const response = await getAddressByEmail(localStorage.getItem("accessToken"));
            setLoadingTable(false);
            if( response.hasOwnProperty('code') && response.code === "ERR_NETWORK" ){
                toast.error("Load Price Fails!!!!");
                return;
            }
            if( response.status === 200 ){
                const arr:DataType[] = []
                response.data.forEach( item => {
                    arr.push({
                        key : item.id,
                        address : item.address,
                        isDefault : item.isDefault
                    })
                })
                setDataSource(arr);
            }else{
                toast.error(response.message)
            }
        }
        fetchAddress();
    }, []);

    const setDefault = async (id : number) => {
        if( localStorage.getItem("accessToken") == undefined){
            localStorage.removeAll();
            navigate('/login')
            return;
        }
        setLoadingTable(true);
        const response = await setAddressDefault(localStorage.getItem("accessToken"), id);
        setLoadingTable(false);
        if( response.hasOwnProperty('code') && response.code === "ERR_NETWORK" ){
            toast.error("NETWORK CONNECTED FAIL!!!!");
            return;
        }
        console.log(response)
        if( response.status === 200 ){
            const arr:DataType[] = []
            dataSource.forEach( item => {
                arr.push({
                    key : item.key,
                    address : item.address,
                    isDefault : item.key === id ? true : false,
                })
            })
            setDataSource(arr);
            toast.success(response.data.message)
        }else{
            toast.error(response.message)
        }
    }

    const removeAddress = async (id : number) => {
        if( localStorage.getItem("accessToken") == undefined){
            localStorage.removeAll();
            navigate('/login')
            return;
        }
        setLoadingTable(true);
        const response = await removeAddressWithEmail(localStorage.getItem("accessToken"), id);
        setLoadingTable(false);
        if( response.hasOwnProperty('code') && response.code === "ERR_NETWORK" ){
            toast.error("NETWORK CONNECTED FAIL!!!!");
            return;
        }
        if( response.status === 200 ){
            setDataSource(dataSource.filter( item => item.key !== id));
            toast.success(response.data.message)
        }else{
            toast.error(response.message)
        }
    }

    return (
        <div>
            <Spin tip={"Change..."} spinning={loadingTable}>
                <Table<DataType> columns={columns} pagination={false} dataSource={dataSource}  scroll={{ y: 200 }} />
                <button onClick={() => showModal(true)} disabled={!edit} className={`${edit ? 'bg-green-500' : 'bg-gray-500'} text-white font-bold px-2 py-1 w-full`}>NEW ADDRESS</button>
            </Spin>
            <Modal title={<p className={'text-green-500'}>ADD NEW ADDRESS</p>}
                   okText={"ADD"}
                   open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div className={'flex gap-8 items-end'}>
                    <input className={'border-b-2 border-green-500 outline-0 px-2 py-1'} value={addressNew} onChange={(e) => setAddressNew(e.target.value)}/>
                    <Radio checked={checkedDefault} onClick={() => setCheckedDefault(!checkedDefault)}>Default</Radio>
                </div>
            </Modal>
        </div>
    );
}

export default TableAddress;