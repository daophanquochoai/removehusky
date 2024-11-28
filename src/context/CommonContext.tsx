import React, {createContext, ReactNode, useEffect, useState} from 'react';
import {getInfo, parseJwt, refreshToken} from "../Helper/Helper.ts";
import {toast} from "react-toastify";

type contextValue =  {
    numberItem: object[];
    sort: number;
    setSearch: (value: (((prevState: string) => string) | string)) => void;
    setPrice: (value: (((prevState: number[]) => number[]) | number[])) => void;
    setRate: (value: (((prevState: number) => number) | number)) => void;
    setIsLogin: (value: (((prevState: boolean) => boolean) | boolean)) => void;
    setSort: (value: (((prevState: number) => number) | number)) => void;
    isLogin: boolean;
    search: string;
    rate: number;
    setCategory: (value: (((prevState: number) => number) | number)) => void;
    price: number[];
    page: number;
    category: number;
    handleUpDownItem: (item: number, number: number) => void;
    setNumberItem: (value: (((prevState: object[]) => object[]) | object[])) => void;
    setPage: (value: (((prevState: number) => number) | number)) => void,
    info : object;
    setInfo: (value: (((prevState: object) => object) | object)) => void;
    acceptCart : object[];
    setAcceptCart : Function;
}
type Info = {
    id: number
    firstName: string,
    lastName: string,
    imageUrl: string,
    email: string,
    phone: string,
    role: string
}

export const CommonContext = createContext<contextValue>(undefined);

const CommonProvider : React.FC = ({children} : {children:ReactNode}) => {
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [numberItem, setNumberItem] = useState<object[]>([]);

    const [search,setSearch] = useState<string>('');
    const [category,setCategory] = useState<number>(0);
    const [rate,setRate] = useState<number>(0);
    const [price,setPrice] = useState<number[]>([0,0]);
    const [sort,setSort] = useState<number>(1);
    const [page,setPage] = useState<number>(0);
    const [info, setInfo] = useState<Info>({id: 0, email: "", firstName: "", imageUrl: "", lastName: "", phone: "", role: ""})

    const [acceptCart, setAcceptCart] = useState<object[]>([]);

    useEffect(() => {
        const init = async  () => {
            if( localStorage.getItem("accessToken") != null){
                if(  new Date(parseJwt(localStorage.getItem("accessToken"))['exp'] * 1000 ) >= new Date()  ){
                    const response = await getInfo( localStorage.getItem("accessToken") ,  parseJwt(localStorage.getItem("accessToken"))['sub'] );
                    if( response?.code === "ERR_NETWORK") {
                        return;
                    }
                    if( response.status === 200 ){
                        setInfo(response.data);
                        setIsLogin(true);
                    }
                    if( response.status === 401 ){
                        if (new Date(parseJwt(localStorage.getItem("refreshToken"))['exp'] * 1000) <= new Date(parseJwt(localStorage.getItem("refreshToken"))['iat'] * 1000 + 604800000)){
                            const response = await refreshToken(localStorage.getItem("refreshToken"));
                            if( response?.code === "ERR_NETWORK") {
                                return;
                            }
                            if( response.status === 200 ){
                                localStorage.setItem("accessToken", response.data.accessToken);
                                const result = await getInfo( localStorage.getItem("accessToken") ,  parseJwt(localStorage.getItem("accessToken"))['sub'] );
                                if( result?.code === "ERR_NETWORK") {
                                    return;
                                }
                                if( result.status === 200 ){
                                    setInfo(result.data);
                                    setIsLogin(true);
                                }
                            }
                        }
                    }
                }else if(localStorage.getItem("refreshToken") !== null){
                    if (new Date(parseJwt(localStorage.getItem("refreshToken"))['exp'] * 1000) >= new Date() ){
                        const response = await refreshToken(localStorage.getItem("refreshToken"));
                        if( response?.code === "ERR_NETWORK") {
                            return;
                        }
                        if( response.status === 200 ){
                            localStorage.setItem("accessToken", response.data.accessToken);
                            const result = await getInfo( localStorage.getItem("accessToken") ,  parseJwt(localStorage.getItem("accessToken"))['sub'] );
                            if( result?.code === "ERR_NETWORK") {
                                return;
                            }
                            if( result.status === 200 ){
                                setInfo(result.data);
                                setIsLogin(true);
                            }
                        }
                    }
                }
            }
            }
        init();
    }, []);

    const handleUpDownItem = (item : number, number : number, quantity : number) => {
        console.log(item)
        console.log(number)
        console.log(quantity)
        const itemSaved = numberItem.filter( i => i.item === item);
        if( itemSaved.length > 0 ){
            if( quantity == itemSaved.number && number > 0){
                toast.error("Quantity large than stock");
            }
            // numberItem.forEach( e => console.log(e.item))
            setNumberItem(() => numberItem.map( i => {
                if( i.item === item ){
                    if( number < 0 && i.number === 1 ) return i;
                    i.number += number;
                }
                return  i;
            }))
        }else{
            setNumberItem([...numberItem, { item:item, number : number > 0 ? number : 1}])
        }
    }

    const value: {
        numberItem: object[];
        sort: number;
        setSearch: (value: (((prevState: string) => string) | string)) => void;
        setPrice: (value: (((prevState: number[]) => number[]) | number[])) => void;
        setRate: (value: (((prevState: number) => number) | number)) => void;
        setIsLogin: (value: (((prevState: boolean) => boolean) | boolean)) => void;
        setSort: (value: (((prevState: number) => number) | number)) => void;
        isLogin: boolean;
        search: string;
        rate: number;
        setCategory: (value: (((prevState: number) => number) | number)) => void;
        price: number[];
        page: number;
        category: number;
        handleUpDownItem: (item: number, number: number) => void;
        setNumberItem: (value: (((prevState: object[]) => object[]) | object[])) => void;
        setPage: (value: (((prevState: number) => number) | number)) => void,
        info : object;
        setInfo: (value: (((prevState: object) => object) | object)) => void;
        acceptCart : object[];
        setAcceptCart : Function;
    } = {
        isLogin : isLogin,
        setIsLogin : setIsLogin,
        handleUpDownItem : handleUpDownItem,
        numberItem : numberItem,
        setNumberItem : setNumberItem,
        search : search,
        page : page,
        category : category,
        price : price,
        sort : sort,
        rate : rate,
        setSearch : setSearch,
        setCategory : setCategory,
        setRate : setRate,
        setSort : setSort,
        setPrice : setPrice,
        setPage : setPage,
        info,
        setInfo,
        acceptCart,
        setAcceptCart
    }
    return (
        <CommonContext.Provider value={value}>
            {children}
        </CommonContext.Provider>
    );
};

export default CommonProvider;