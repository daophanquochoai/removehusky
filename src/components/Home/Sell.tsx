import React, {useContext, useEffect, useState} from 'react';
import Item from "./Item.tsx";
import NavItem from "./NavItem.tsx";
import {getAllCategory, getProductByCategory} from "../../Helper/Helper.ts";
import {useNavigate} from "react-router-dom";
import {CommonContext} from "../../context/CommonContext.tsx";
import Skeleton from "react-loading-skeleton";
import {toast} from "react-toastify";

const Sell = () => {
    const [category, setCategory] = useState<object[]>([]);
    const [product, setProduct] = useState<object[]>([]);
    const [activeCate, setActiveCate] = useState<number>()
    const navigate = useNavigate();
    const {numberItem, handleUpDownItem} = useContext(CommonContext);
    const [isLoadingCategory,setIsLoadingCategory] = useState<boolean>(false);
    const [isLoadingProduct, setIsLoadingProduct] = useState<boolean>(false);


    useEffect(() => {

        const fetchCategogy = async () => {
            setIsLoadingCategory(true);
            const data = await getAllCategory();
            setIsLoadingCategory(false)
            if(  data.hasOwnProperty('code') && data.code === "ERR_NETWORK"){
                toast.error("Load Category Fails!!!!");
                return;
            }
            if( data.status === 200 ){
                data.data.length > 0 && setActiveCate(1);
                setCategory(data.data);
            }else{
                toast.error(data.message)
            }
        }
        fetchCategogy();

    },[]);
    useEffect(() => {
        const fetchProductByCategory = async () => {
            setIsLoadingProduct(true)
            const data = await getProductByCategory(activeCate);
            setIsLoadingProduct(false)
            if(  data.hasOwnProperty('code') && data.code === "ERR_NETWORK"){
                toast.error("Load Category Fails!!!!");
                return;
            }
            console.log(data)
            if( data.status === 200 ){
                setProduct(data.data);
            }else{
                toast.error(data.message)
            }
        }
        fetchProductByCategory();
    }, [activeCate]);



    const navigateToDetaiProduct = ( productId:number) => {
        scrollTo(0,0);
        navigate(`/product/${productId}`)
    }

    return (
        <div className={'mx-[10%] mt-16 grid grid-cols-[1fr_3fr] gap-4'}>
          <div className={'flex flex-col gap-2 max-h-[400px] overflow-y-scroll'}>
              {
                  isLoadingCategory ?
                      <>
                          <Skeleton className={'p-4'}/>
                          <Skeleton className={'p-4'}/>
                          <Skeleton className={'p-4'}/>
                      </>
                      :
                      <>
                        {
                            category.length > 0 ? category.map( (sb, index) =>
                                (
                                    <NavItem active={sb.key === activeCate} categoryTitle={sb.categoryTitle} imageUrl={sb.imageUrl} key={index} setActiveCate={() => setActiveCate(sb.key)}/>
                                )
                            )
                                :
                                <>
                                    <div className={'h-[200px] justify-center items-center flex w-full border-2  border-dotted'} >
                                        <p className={'text-xl'}>CATEGORY IS EMPTY</p>
                                    </div>
                                </>
                        }
                      </>
              }
          </div>
          <div>
              <div className={'flex justify-between'}>
                  <p className={'text-3xl font-bold'}>Best selling products</p>
                  <button className={'bg-green_primary p-2 rounded-[7px] text-white hover:bg-yellow-200 transition-all duration-300'} onClick={ () => navigate('/product')}>View All</button>
              </div>
              <div className={`grid ${product.length > 0 ? 'grid-cols-4' : 'grid-cols-1'} mt-4 gap-4`}>
                  {
                      isLoadingProduct ?
                          <>
                              <Skeleton className={'h-[250px]'}/>
                              <Skeleton className={'h-[250px]'}/>
                              <Skeleton className={'h-[250px]'}/>
                              <Skeleton className={'h-[250px]'}/>
                          </>
                          :
                          <>
                              {
                                  product.length > 0 ?
                                  product.map(
                                      (pro,index) =>
                                          <div key={index}>
                                              <Item id={pro.productId} numberItem={numberItem.filter(i => i.item === pro.productId).length ? numberItem.filter(i => i.item === pro.productId)[0].number : 1} handleUpItem={() =>handleUpDownItem(pro.productId, 1, pro.quantity)} handleDownItem={() => handleUpDownItem(pro.productId, -1, pro.quantity)} title={pro.productTitle} price={pro.priceUnit} priceOld={pro.priceOld} image={pro.imageUrl} rate={3} selled={pro.selled} quantity={pro.quantity} key={pro.productId}/>
                                          </div>
                                  )
                                      :
                                      <>
                                          <div className={'h-[200px] w-full flex justify-center items-center border-dotted border-2'}>
                                              <p className={'text-xl'}>PRODUCT IS EMPTY</p>
                                          </div>
                                      </>
                              }
                          </>
                  }
              </div>
          </div>
        </div>
    );
};

export default Sell;