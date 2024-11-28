import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {Table, TableColumnsType} from "antd";
import {addWishList, addWishListToCart, getWishList} from "../Helper/Helper.ts";
import {useNavigate} from "react-router-dom";
import {CommonContext} from "../context/CommonContext.tsx";
import {toast} from "react-toastify";


interface DataType{
    key : number;
    image_url : string;
    product_title : string;
    unit : string;
    price : number;
}

const WishListPage = () => {

    //bien
    const [dataSource, setDataSource] = useState<DataType[]>([]);
    const {setIsLogin} = useContext(CommonContext);
    const navigate = useNavigate();
    const [selected, setSelected] = useState<number[]>([])
    const [loadingTable, setLoadingTable] = useState(false);

    //useEffect
    useEffect(() => {
        const fetchDataWish = async () => {
            if( localStorage.getItem("accessToken") === null ){
                navigate('/login')
                setIsLogin(false);
                localStorage.removeAll();
                return''
            }
            setLoadingTable(true)
            const response = await getWishList(localStorage.getItem('accessToken'));
            setLoadingTable(false)
            if( response.hasOwnProperty("code") && response.code === "ERR_NETWORK"){
                toast.warning("NETWORK DON'T CONNECTED!!");
                return;
            }
            if( response.status === 200 ){
                const arr : DataType[] = [];
                response.data.forEach( item => {
                    arr.push(        {
                        key : item.productId,
                        image_url : item.imageUrl,
                        product_title : item.productTitle,
                        unit : item.unit,
                        price : item.priceUnit,
                    })
                })
                setDataSource(arr);
            }
        }
        fetchDataWish();
    }, []);
    // column table
    const columns: TableColumnsType<DataType> = [
        {
            title: 'Product',
            align:  'center',
            render: ( item : DataType ) => (
                <div className={'flex items-center justify-center px-[5%] gap-2'}>
                    <img alt={'image'} className={'w-[50px] h-[50px]'} src={item.image_url}/>
                    <p className={'shortcut'}>{item.product_title}</p>
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
                <button>Add Cart</button>
            )
        }
    ];
    //function
    const onSelectColumn = (e) => {
        setSelected(e);
    }
    const handleWishListToCart = async () => {
        if( localStorage.getItem('accessToken') == null ){
            navigate('/login');
            setIsLogin(false);
            localStorage.removeAll();
            return;
        }
        setLoadingTable(true)
        const response = await addWishListToCart(selected, localStorage.getItem('accessToken'));
        setLoadingTable(false)
        if( response.hasOwnProperty('code') && response.code === "ERR_NETWORK"){
            toast.error("NETWORK CONNECTED FAIL!!!");
            return;
        }
        if( response.status === 200 ){
            toast.success("ADD WISHLIST SUCCESS!!!");
            setDataSource(dataSource.filter( item => !selected.includes(item.key)))
        }else{
            toast.error(response.message);
        }
    }
    return (
        <div className={'mt-[150px] mb-[100px]'}>
            <p className={'text-2xl text-green-500 font-bold text-center mb-4'}>MY WISH LIST</p>
            <div className={'mx-[10%]'}>
                <Table<DataType> columns={columns} dataSource={dataSource} rowSelection={{
                    onChange : onSelectColumn
                }} loading={loadingTable} pagination={false}/>
            </div>
            <div className={'mx-[10%] justify-end flex mt-4'}>`
                <button onClick={() => handleWishListToCart()} disabled={selected.length === 0} className={'hover:text-yellow-400 hover:bg-white text-white bg-yellow-400 border-2 border-yellow-400 px-2 py-1 cursor-pointer font-bold'}>ADD TO CART</button>
            </div>
        </div>
    );
};

export default WishListPage;