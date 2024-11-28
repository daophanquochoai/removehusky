import {ChangeEvent, useEffect, useState} from 'react';
import {Divider, Table, TableColumnsType} from "antd";
import {toast} from "react-toastify";

type Props = {
    data : object,
    history : object[],
    cart : [],
    setCart : Function,
    addToCart : Function
}

const TableTime = ( props : Props) => {
    // khai bao
    interface DataType {
        key : number;
        productTitle: string;
        imageUrl : string;
        quantity: number;
        price : number;
        unit : string;
        stock : number;
    }

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
                <div className={'flex justify-center'}>
                    <button className={'text-white text-xl w-[30px] h-[30px] bg-green-500'} onClick={() => handleUpOrDown(item.key, -1, item.quantity, item.stock)}>-</button>
                    <input className={'outline-0 text-center'} type={"number"} value={item.quantity} max={item.stock} onChange={ (e: ChangeEvent<HTMLInputElement>) => handleChangeValue(e,item.stock, item.key)}/>
                    <button className={'text-white text-xl w-[30px] h-[30px] bg-green-500'} onClick={() => handleUpOrDown(item.key, 1, item.quantity, item.stock)}>+</button>
                </div>
            )
        },
        {
            title : 'Price',
            align: 'center',
            render: ( item : DataType ) => (
                <p>{item.price.toLocaleString()}đ/1{item.unit}</p>
            )
        },
        {
            title : 'Action',
            align: 'center',
            render: ( item : DataType ) => (
                <button className={`${item.stock - item.quantity >= 0 ? 'bg-green-500' : 'bg-gray-400'} px-3 py-2 text-white font-bold`} disabled={item.stock < item.quantity} onClick={ () => props.addToCart(item.key)}>Add Cart</button>
            )
        }
    ];

    const [dataSource, setDataSource] = useState<DataType[]>([])

    //function prodcess
    const handleUpOrDown = ( id : number, rise : number, quantity: number, stock : number) => {
        if( quantity >= stock && rise > 0 ){
            toast.warning("Quantity don't large than stock");
            return;
        }
        setDataSource(
            dataSource.map( item => {
                if( item.key === id ){
                    if( item.quantity === 1 && rise < 0){
                        return item;
                    }
                    item.quantity += rise;
                }
                return item;
            })
        )
    }

    const handleChangeValue = (e : any, stock : number, id: number) => {
        console.log(e.target.value)
        if( e.target.value >= stock || e.target.value < 0){
            toast.warning("Quantity don't large than stock and less than 0");
            return;
        }
        setDataSource(
            dataSource.map( item => {
                if( item.key === id ){
                    item.quantity = e.target.value;
                }
                return item;
            })
        )
    }

    useEffect(() => {
        const arr:DataType[] = [];
        props.data.listOrderItems.forEach( item => {
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
    }, [props.history]);


    return (
        <div>
            <Divider>{props.data.time.join('-')}</Divider>
            <Table<DataType> columns={columns} dataSource={dataSource} pagination={false}/>
        </div>
    );
};

export default TableTime;