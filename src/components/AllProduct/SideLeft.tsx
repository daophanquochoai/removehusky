import React, {useContext, useEffect, useState} from 'react';
import {RadioChangeEvent, Slider} from "antd";
import { Radio } from 'antd';
import {FaSearch, FaStar} from "react-icons/fa";
import {getAllCategory, getRangePrice} from "../../Helper/Helper.ts";
import {toast} from "react-toastify";
import Skeleton from "react-loading-skeleton";
import {CommonContext} from "../../context/CommonContext.tsx";
const SideLeft : React.FC = () => {
    const {category, setCategory, rate, setRate, price, setPrice} = useContext(CommonContext);
    const [categoryList, setCategoryList] = useState<object[]>([])
    const [isLoadingCategory, setIsLoadingCategory] = useState<boolean>(true)
    const [min, setMin] = useState<number[]>([0,0])
    const onChange = (e: RadioChangeEvent) => {
        setRate(e.target.value);
    };

    // get price
    useEffect(() => {

        const fetchCategogy = async () => {
            const data = await getRangePrice();
            if( data.hasOwnProperty('code') && data.code === "ERR_NETWORK" ){
                toast.error("Load Price Fails!!!!");
                return;
            }
            if( data.status === 200 ){
                if( data.data.minPrice == null ) return;
                setPrice([data.data.minPrice, data.data.maxPrice]);
                setMin([data.data.minPrice, data.data.maxPrice])
            }else{
                toast.error(data.message)
            }
        }
        fetchCategogy();

    },[]);
    useEffect(() => {

        const fetchCategogy = async () => {
            const data = await getAllCategory();
            setIsLoadingCategory(false)
            if(  data.hasOwnProperty('code') && data.code === "ERR_NETWORK"){
                toast.error("Load Category Fails!!!!");
                return;
            }
            if( data.status === 200 ){
                data.data.length > 0 && setCategory(0);
                setCategoryList(data.data);
            }else{
                toast.error(data.message)
            }
        }
        fetchCategogy();

    },[]);
    return (
        <div className={'p-6 flex flex-col gap-6'}>
            <div>
                <div className={'flex justify-center items-center gap-4 bg-gray-200  rounded-[7px] px-4'}>
                    <input className={'flex-1 text-base px-2 py-2 bg-gray-200 outline-0'} placeholder={"Search here"}/>  <FaSearch className={'text-gray-400'}/>
                </div>
            </div>
            <div className={'flex flex-col gap-4'}>
                <div>
                    <h3 className={'text-2xl font-bold mb-2'}>Categories</h3>
                    <div>
                        {
                            isLoadingCategory ?
                                <>
                                    <div>
                                        <Skeleton className={'h-[30px]'}/>
                                        <Skeleton className={'h-[30px]'}/>
                                        <Skeleton className={'h-[30px]'}/>
                                        <Skeleton className={'h-[30px]'}/>
                                    </div>
                                </>
                                :
                                <>
                                    {
                                        categoryList.length > 0 ?
                                            <div className={'flex flex-col mt-6 h-[200px] overflow-y-scroll'}>
                                                <p onClick={() => setCategory(0)} className={`cursor-pointer px-4 py-2 text-xl ${category == 0 ? 'bg-green-500 text-white' : 'text-green-500'}`}>All</p>
                                                {
                                                    categoryList.map((item, index) => (
                                                        <p key={index} onClick={() => setCategory(item.key)} className={`cursor-pointer px-4 py-2 text-xl ${category == item.key ? 'bg-green-500 text-white' : 'text-green-500'}`}>{item.categoryTitle}</p>
                                                    ))
                                                }
                                            </div>
                                            :
                                            <>
                                            <div className={'h-[200px] flex items-center justify-center'}>
                                                    <p className={'font-bold text-xl'}>CATEGORY IS EMPTY</p>
                                                </div>
                                            </>
                                    }
                                </>
                        }
                    </div>
                </div>
                <div className={'flex flex-col'}>
                    <h3 className={'text-2xl font-bold'}>Rate</h3>
                    <Radio.Group onChange={onChange} value={rate}   className={'flex flex-col gap-2'}>
                        <Radio value={0}>
                            <div className={'flex items-center justify-center text-base gap-2'}>
                                <p>All</p> <FaStar className={'text-yellow-300'}/>
                            </div>
                        </Radio>
                        <Radio value={5}>
                            <div className={'flex items-center justify-center text-base gap-2'}>
                                <p>Từ 5</p> <FaStar className={'text-yellow-300'}/>
                            </div>
                        </Radio>
                        <Radio value={4}>
                            <div className={'flex items-center justify-center text-base gap-2'}>
                                <p>Từ 4</p> <FaStar className={'text-yellow-300'}/>
                            </div>
                        </Radio>
                        <Radio value={3}>
                            <div className={'flex items-center justify-center text-base gap-2'}>
                                <p>Từ 3</p> <FaStar className={'text-yellow-300'}/>
                            </div>
                        </Radio>
                        <Radio value={2}>
                            <div className={'flex items-center justify-center text-base gap-2'}>
                                <p>Từ 2</p> <FaStar className={'text-yellow-300'}/>
                            </div>
                        </Radio>
                        <Radio value={1}>
                            <div className={'flex items-center justify-center text-base gap-2'}>
                                <p>Từ 1</p> <FaStar className={'text-yellow-300'}/>
                            </div>
                        </Radio>
                    </Radio.Group>
                </div>
                {
                    price[0] !== price[1] && price[0] !== null &&
                    <div>
                        <h3 className={'text-2xl font-bold'}>Price</h3>
                        <div>
                            <Slider
                                range
                                min={min[0]}
                                max={min[1]}
                                value={price}
                                onChange={e => setPrice(e)}
                            />
                            <div className={'flex justify-between items-center gap-2'}>
                                <p>{price[0]}đ</p>
                                <p>{price[1]}đ</p>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default SideLeft;