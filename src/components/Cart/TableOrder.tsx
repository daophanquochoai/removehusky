import {ChangeEvent, useContext, useEffect, useState} from 'react';
import {Table, TableColumnsType} from "antd";
import {CommonContext} from "../../context/CommonContext.tsx";
import {useNavigate} from "react-router-dom";

type Props = {
    cart : object[],
    setCart : Function,
    removeToCart : Function,
}

interface DataType {
    key : number;
    productTitle: string;
    imageUrl : string;
    quantity: number;
    price : number;
    unit : string;
    stock : number;
}

const TableOrder = ( props : Props ) => {

    const [dataSource, setDataSource] = useState<DataType[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0)
    const navigate = useNavigate();
    const {setAcceptCart} = useContext(CommonContext);

    const columns: TableColumnsType<DataType> = [
        {
            title: 'Product Name',
            align:  'center',
            render: ( item : DataType ) => (
                <div className={'flex items-center gap-2'}>
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
        },
        {
            title : 'Action',
            align: 'center',
            render: ( item : DataType ) => (
                <button className={`bg-green-500 px-3 py-2 text-white font-bold`} onClick={ () => props.removeToCart(item.key)}>X</button>
            )
        }
    ];

    const handleOrder = () => {
        setAcceptCart(props.cart);
        navigate('/acceptCart')
    }

    useEffect(() => {
        const arr:DataType[] = [];
        let sum : number = 0;
        props.cart.forEach( item => {
            sum += item.price * item.quantity
            arr.push(
                {
                    key : item.productId,
                    productTitle: item.title,
                    imageUrl : item.image,
                    quantity: item.quantity,
                    price : item.price,
                    unit : item.unit,
                    stock : item.stock,
                }
            )
        })
        setDataSource(arr)
        setTotalPrice(sum)
    }, [props.cart]);

    return (
        <div>
            <Table<DataType> columns={columns} dataSource={dataSource} pagination={false}/>
            <div className={'mt-4 px-4'}>
                <div className={'flex justify-between items-center text-gray-500'}>
                    <p>Số tiền : </p>
                    <p>{totalPrice.toLocaleString()}đ</p>
                </div>
                <div  className={'flex justify-between items-center text-gray-500'}>
                    <p>Phí vận chuyển :</p>
                    <p>0đ</p>
                </div>
                <div  className={'flex justify-between items-center text-gray-500'}>
                    <p>Tổng : </p>
                    <p>{totalPrice.toLocaleString()}đ</p>
                </div>
            </div>
            <button disabled={props.cart.length===0} className={`text-white ${props.cart.length == 0 ? 'bg-gray-400' : 'bg-green-500'} w-full py-2 text-xl mt-6 font-bold`} onClick={()=> handleOrder()}>Order</button>
        </div>
    );
};

export default TableOrder;