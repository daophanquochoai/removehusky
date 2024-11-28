import React, {useContext, useEffect, useState} from 'react';
import SideLeft from "./SideLeft.tsx";
import Item from "../Home/Item.tsx";
import {Dropdown, MenuProps, Pagination, Space, Spin} from "antd";
import {DownOutlined} from "@ant-design/icons";
import { getProductWithOption} from "../../Helper/Helper.ts";
import {CommonContext} from "../../context/CommonContext.tsx";
import {toast} from "react-toastify";


const Products:React.FC = () => {
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'Phù Hợp',
        },
        {
            key: '2',
            label: 'Cao đến Thấp'
        },
        {
            key: '3',
            label: 'Thấp đến Cao'
        },
        {
            key: '4',
            label: 'Đánh giá cao'
        },
    ];
    const [selected,  setSelected] = useState<number>(1);

    const [dataProduct, setDataProduct] = useState<object[]>([]);
    const {numberItem, setNumberItem, handleUpDownItem, category, search, rate, price, sort, setSort,page, setPage } = useContext(CommonContext);

    const [isLoadingProduct, setIsLoadingProduct] = useState<boolean>(false);
    const [pageTotal, setPageTotal] = useState<number>(1);

    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoadingProduct(true);
            const data = await getProductWithOption(page,category, sort, price[0], price[1], rate, search);
            setIsLoadingProduct(false)
            if( data.hasOwnProperty('code') && data.code === "ERR_NETWORK"){
                toast.error("Product don't loading!");
                return;
            }
            if( data.status === 200 ){
                setPageTotal(data.data.totalPage);
                const dateItem: object[] = [];
                data.data.product.forEach( (product) =>
                    dateItem.push(
                        {
                            id : product.productId,
                            title : product.productTitle,
                            price : product.priceUnit,
                            priceOld : product.priceOld,
                            image : product.imageUrl,
                            rate : product.rate,
                            selled : product.selled > 1000 ? product.selled/1000 + 'k' : product.selled,
                            quantity : product.quantity
                        }
                    )
                )
                setDataProduct(dateItem)
            }else{
                toast.error(data.message)
            }
        }
        fetchProduct();
    }, [page, category, search, sort, price, rate]);


    return (
        <div className={'grid grid-cols-[1fr_4fr] px-8'}>
            <SideLeft />
            <div>
                <div className={'flex justify-between items-center px-4 mb-4'}>
                    <div className={'text-xl'}>Showing <span className={'text-green-500 font-bold text-2xl'}>{page  + 1 }</span> in <span className={'text-green-500 font-bold text-2xl'}>{pageTotal}</span> page</div>
                    <div className={'border-2 cursor-pointer'}>
                        <Dropdown menu={{ items, onClick : (e) => setSort(e.key)}} className={'p-2 text-gray-400'} >
                            <Space>
                                <p>Lọc Theo</p>
                                <DownOutlined />
                            </Space>
                        </Dropdown>
                    </div>
                </div>
                <Spin tip={"Loading..."} spinning={isLoadingProduct}>
                    <div className={`grid ${dataProduct.length > 0 ? "grid-cols-5" : "grid-cols-1"} gap-4`}>
                        {
                            dataProduct.length > 0 ?
                                <>
                                    {dataProduct.map((pro, index) =>
                                        <div key={index}>
                                            <Item
                                                numberItem={numberItem.filter(i => i.item === pro.productId).length ? numberItem.filter(i => i.item === pro.productId)[0].number : 1}
                                                handleUpItem={() => handleUpDownItem(pro.productId, 1)}
                                                handleDownItem={() => handleUpDownItem(pro.productId, -1)}
                                                title={pro.title} price={pro.price} priceOld={520000} image={pro.image}
                                                rate={pro.rate} selled={pro.selled} quantity={pro.quantity}
                                                id={pro.id}
                                            />
                                        </div>
                                    )}
                                </>
                                :
                                <>
                                    <div className={'h-[500px] flex items-center justify-center font-bold'}>
                                        <p className={'text-2xl'}>PRODUCT IS EMPTY</p>
                                    </div>
                                </>
                        }
                    </div>
                </Spin>
                <div className={'flex items-center justify-center py-8'}>
                    { dataProduct.length > 0 && <Pagination defaultCurrent={page + 1} total={pageTotal} onChange={(e)=> console.log(e)}/>}
                </div>
            </div>
        </div>
    );
};

export default Products;