import {DatePicker, Image, message, Modal, Pagination, Popconfirm, Table, TableProps, Upload} from "antd";
import React, {useEffect, useState} from "react";
import {getOrder, updateOrderStatus} from "../Helper/Helper.ts";
import {toast} from "react-toastify";
import {data} from "autoprefixer";
import item from "../components/Home/Item.tsx";

const { RangePicker } = DatePicker;

interface Order{
    orderId: number;
    orderDate : string;
    orderDescription: string;
    orderFee: number;
    orderStatus: string;
    address : string;
    phone : string;
    email : string;
    firstName : string;
    image : string;
    lastName : string;
}

const initOrder : Order = {
    orderId: 0,
    orderDate : '',
    orderDescription: '',
    orderFee: 0,
    orderStatus: '',
    address : '',
    phone : '',
    email : '',
    firstName : '',
    lastName : '',
    image : ''
}
enum OrderStatus {
    PENDING,
    ACCEPT,
    PACKAGE,
    DELIVERY,
    RECEIVED
}

const OrderManage = () => {

    //var
    const [page, setPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [dataOrder, setDataOrder] = useState<Order[]>([]);
    const [loadingOrder, setLoadingOrder] = useState<boolean>(false);
    const [startDay, setStartDay] = useState<string>('');
    const [endDay, setEndDay] = useState<string>('');
    const [reload,  setReload] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [orderItem, setOrderItem] = useState<Order>(initOrder);
    const [orderStatus, setOrderStatus] = useState<OrderStatus>(OrderStatus.PENDING)
    //useEffect
    useEffect(() => {
        const fetchOrder = async () => {
            if( localStorage.getItem("accessToken") == null ){
                toast.error("SESSION EXPIRED");
                return;
            }
            setLoadingOrder(true);
            const response = await getOrder(page-1,startDay, endDay, localStorage.getItem("accessToken"));
            setLoadingOrder(false);
            console.log(response)
            if( response.hasOwnProperty('code') && response.code === "ERR_NETWORK"){
                toast.error("NETWORK DON'T CONNECT");
                return;
            }
            if( response.status === 200 ){
                setTotalPage(response.data.totalPage);
                setDataOrder(response.data.dataOrder);
                setDataOrder(response.data.orders)
            }else{
                toast.error(response.message)
            }
        }
        fetchOrder()
    }, [page, reload]);

    //table
    const columns : TableProps<Order>['columns'] = [
        {
            title: <p className={'text-green-600 font-bold'}>ID</p>,
            key: 'id',
            dataIndex : 'orderId',
            sorter: (a, b) => a.orderId - b.orderId,
            align : "center"
        },
        {
            title: <p className={'text-green-600 font-bold'}>Date</p>,
            key: 'date',
            dataIndex : 'orderDate',
            sorter: (a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime(),
            align: "center"
        },
        {
            title: <p className={'text-green-600 font-bold'}>Fee</p>,
            key: 'fee',
            render: (item: Order) => <p>{item.orderFee}</p>,
            align: "center"
        },
        {
            title: <p className={'text-green-600 font-bold'}>Status</p>,
            key: 'status',
            render: (item: Order) => <p className={`${item.orderStatus == 'PENDING' && 'text-gray-500'} ${item.orderStatus  == 'ACCEPT' && 'text-green-500'} 
                                    ${item.orderStatus  == 'PACKAGE' && 'text-yellow-500'} 
                                    ${item.orderStatus  == 'DELIVERY' && 'text-blue-500'} 
                                    ${item.orderStatus  == 'RECEIVED' && 'text-red-500'} font-bold`}>{item.orderStatus}</p>,
            align: "center"
        },
        {
            title: <p className={'text-green-600 font-bold'}>Phone</p>,
            key: 'phone',
            render: (item: Order) => (
               <p className={'text-purple-600 font-bold'}>{item.phone}</p>
            ),
            align: "center"
        },
        {
            title: <p className={'text-green-600 font-bold'}>Address</p>,
            key: 'address',
            render: (item: Order) => (
                <p className={'text-pink-600 font-bold'}>{item.address}</p>
            ),
            align: "center"
        }
    ];
    //functoin
    const handleDateChange = (e) => {
        if( e === null ){
            setStartDay('')
            setEndDay('');
            setPage(1);
            setReload(!reload)
            return;
        }
        if (e && e.length === 2) {
            const startDate = e[0].format("DD/MM/YYYY"); // Ngày bắt đầu
            const endDate = e[1].format("DD/MM/YYYY");   // Ngày kết thúc
            setStartDay(startDate)
            setEndDay(endDate);
            setPage(1);
            setReload(!reload)
        }
    };

    const handleClickRow = (e) => {
        const item = dataOrder.filter( item => item.orderId == e.orderId).length > 0 ? dataOrder.filter(item => item.orderId == e.orderId)[0] : null;
        if( item === null ){
            message.error("Order not found")
            return;
        }
        setOrderItem(item);
        switch ( item.orderStatus){
            case 'PENDING' :
                setOrderStatus(OrderStatus.PENDING)
                break;
            case 'ACCEPT' :
                setOrderStatus(OrderStatus.ACCEPT)
                break;
            case 'PACKAGE' :
                setOrderStatus(OrderStatus.PACKAGE);
                break;
            case 'DELIVERY' :
                setOrderStatus(OrderStatus.DELIVERY);
                break;
            case 'RECEIVED' :
                setOrderStatus(OrderStatus.RECEIVED);
                break;
        }

        setOpen(true);
    }

    // change status
    const [loadingModal, setLoadingModal] = useState<boolean>(false);
    const handleUpdateStatus = async () => {
        if( localStorage.getItem("accessToken") == null ){
            message.error("SESSION EXPIRED");
            return;
        }
        console.log(orderItem.orderId)
        console.log(orderStatus);
        setLoadingModal(true);
        const response = await updateOrderStatus(orderItem.orderId, orderStatus, localStorage.getItem("accessToken"));
        setLoadingModal(false);
        console.log(response);
        if( response.hasOwnProperty('code') && response.code === "ERR_NETWORK"){
            toast.error("NETWORK DON'T CONNECT");
            return;
        }
        console.log(response)
        if( response.data.status === "OK" ){
            setReload(!reload)
            setOpen(false);
            message.success("Updated Status")
        }else{
            toast.error(response.message)
        }
    }

    return (
        <div>
            <div className={'mb-4'}>
                <RangePicker onChange={handleDateChange}/>
            </div>
            <Table<Order> loading={loadingOrder} columns={columns} dataSource={dataOrder} rowKey={(record) => record.orderId} pagination={false} rowClassName={'cursor-pointer'} onRow={(record) => ({
                onClick: () => {
                    handleClickRow(record);
                },
            })}/>
            <div className={'flex justify-center mt-4'}>
                {
                    dataOrder.length > 0 &&
                    <Pagination current={page} total={totalPage * 8} onChange={(e)=> setPage(e)} responsive={true}/>
                }
            </div>
            <Modal
                title={<p className={'font-bold text-xl'}>ORDER ID : {orderItem.orderId}</p>}
                centered
                width={500}
                loading={loadingModal}
                open={open}
                footer={
                    <button disabled={orderItem.orderStatus == 'RECEIVED'} onClick={() => handleUpdateStatus()} className={`${orderItem.orderStatus == 'RECEIVED' ? 'bg-gray-400' : 'bg-green-500'} text-white px-3 py-2 rounded`}>Update</button>
                }
                onCancel={() => setOpen(false)}
            >
                <div className={'border-b-2 border-gray-400 mb-4 pb-4'}>
                    <p className={'font-bold'}>Order Date : <span className={'text-green-500'}>{orderItem.orderDate}</span></p>
                    <p className={'font-bold'}>Order Description : <span className={'text-green-500'}>{orderItem.orderDescription}</span></p>
                    <div className={'flex justify-between'}>
                        <p className={'font-bold'}>Order Fee : <span
                            className={'text-green-500'}>{orderItem.orderFee}</span></p>
                        <div className={'flex gap-2'}>
                            <p className={'font-bold'}>Order Status : </p>
                            <select
                                className={`
                                    px-2 py-1 outline-0 font-bold ${orderStatus == OrderStatus.PENDING && 'text-gray-500'} 
                                    ${orderStatus == OrderStatus.ACCEPT && 'text-green-500'} 
                                    ${orderStatus == OrderStatus.PACKAGE && 'text-yellow-500'} 
                                    ${orderStatus == OrderStatus.DELIVERY && 'text-blue-500'} 
                                    ${orderStatus == OrderStatus.RECEIVED && 'text-red-500'} 
                                `}
                                onChange={(e) => {
                                    const selectedValue = Number(e.target.value);
                                    setOrderStatus(selectedValue);
                                }}
                                value={orderStatus}
                            >
                                { orderItem.orderStatus == 'PENDING' && <option className={'cursor-pointer text-gray-500 font-bold'} value={'ACCEPT'}>PENDING</option>}
                                {
                                    orderItem.orderStatus != 'RECEIVED' &&
                                    <>
                                        <option className={'cursor-pointer text-green-600 font-bold'} value={1}>ACCEPT</option>
                                        <option className={'cursor-pointer text-yellow-600 font-bold'} value={2}>PACKAGE</option>
                                        <option className={'cursor-pointer text-blue-600 font-bold'} value={3}>DELIVERY</option>
                                    </>
                                }
                                <option className={'cursor-pointer text-red-500 font-bold'} value={4}>RECEIVED</option>
                            </select>
                        </div>
                    </div>
                    <p className={'font-bold'}>Address Received : <span
                        className={'text-green-500'}>{orderItem.address}</span></p>
                    <p className={'font-bold'}>Phone Number : <span
                        className={'text-green-500'}>{orderItem.phone}</span></p>
                </div>
                <div className={'flex items-end gap-4'}>
                <div>
                        <p className={'font-bold'}>Email : <span className={'text-green-500'}>{orderItem.email}</span>
                        </p>
                        <p className={'font-bold'}>User Name : <span
                            className={'text-green-500'}>{orderItem.firstName + ' ' + orderItem.lastName}</span></p>
                    </div>
                    <div>
                        <img src={orderItem.image} alt={'avatar'} className={'h-[50px] w-[50px]'}/>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default OrderManage;