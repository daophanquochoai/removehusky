import { Column } from '@ant-design/plots';
import {useContext, useEffect, useState} from "react";
import {CommonContext} from "../context/CommonContext.tsx";
import {useNavigate} from "react-router-dom";
import {getRevenueByYear, getRevenueForYear } from "../Helper/Helper.ts";
import {Spin} from "antd";

interface Revenue {
    month : string;
    numberMonth : number;
    price : number;
}

const initRevenue : Revenue[]= [
    {
        month : 'January',
        numberMonth : 1,
        price : 0
    },
    {
        month : 'February',
        numberMonth : 2,
        price : 0
    },
    {
        month : 'March',
        numberMonth : 3,
        price : 0
    },
    {
        month : 'April',
        numberMonth : 4,
        price : 0
    },
    {
        month : "May",
        numberMonth : 5,
        price : 0
    },
    {
        month : 'June',
        numberMonth : 6,
        price : 0
    },
    {
        month : 'July',
        numberMonth : 7,
        price : 0
    },
    {
        month : 'August',
        numberMonth : 8,
        price : 0
    },
    {
        month : 'September',
        numberMonth : 9,
        price : 0
    },
    {
        month : 'October',
        numberMonth : 10,
        price : 0
    },
    {
        month : 'November',
        numberMonth : 11,
        price : 0
    },
    {
        month : 'December',
        numberMonth : 12,
        price : 0
    }
]

const OverView = () => {

    // bien
    const { setIsLogin } = useContext(CommonContext);
    const [year, setYear] = useState<number[]>([]);
    const [loadingYear, setLoadingYear] = useState<boolean>(false);
    const [dataRevenue, setDataRevenue] = useState<Revenue[]>([...initRevenue]);
    const [loadingRevenue, setLoadingRevenue] = useState<boolean>(false);
    const [yearChoose, setYearChoose] = useState<number>(0);
    const navigate = useNavigate();


    const config = {
        data : dataRevenue,
        xField: 'month',
        yField: 'price',
        colorField: 'month',
        axis: {
            x: {
                size: 40,
            }
        },
        tooltip: { channel: 'y', valueFormatter: (d) => d.toLocaleString() + 'đ'}
    };


    //useEffect
    useEffect(() => {
        const fetchYear = async () => {
            if( localStorage.getItem("accessToken") === undefined ){
                setIsLogin(false)
                navigate("/login")
                return;
            }
            const token : string | null = localStorage.getItem("accessToken") === null ? '' : localStorage.getItem("accessToken");
            setLoadingYear(true);
            const response = await getRevenueForYear(token);
            setLoadingYear(false)
            if( response?.code === "ERR_NETWORK") {
                return;
            }
            if( response.status === 200 ){
                const arr: number[] = [];
                if( response.data != [] ) setYearChoose(response.data[0].year);
                response.data.forEach( item => {
                    arr.push( item.year);
                })
                setYear(arr);
                setIsLogin(true);
            }
            if( response.status === 401 ){
                toast.warning("Please reload web!!")
            }
        }
        fetchYear();
    }, []);
    useEffect(() => {
        const fetchRevenue = async ( year : number ) => {
            if( year === 0 ) return;
            if( localStorage.getItem("accessToken") === undefined ){
                setIsLogin(false)
                navigate("/login")
                return;
            }
            const token : string | null = localStorage.getItem("accessToken") === null ? '' : localStorage.getItem("accessToken");
            setLoadingRevenue(true);
            const response = await getRevenueByYear(year,token);
            setLoadingRevenue(false)
            if( response?.code === "ERR_NETWORK") {
                return;
            }
            if( response.status === 200 ){
                const arr : Revenue[] =  initRevenue.map(item => ({ ...item }));
                response.data.forEach( (item, index) => {
                    arr.map( it => {
                        if( it.numberMonth == item.month){
                            it.price = item.revenue;
                        }
                        return it;
                    })
                })
                setDataRevenue(arr);
            }
            if( response.status === 401 ){
                toast.warning("Please reload web!!")
            }
        }
        fetchRevenue(yearChoose)
    }, [yearChoose]);


    return (
        <div>
            <div className={'flex justify-between px-4'}>
                <div></div>
                <Spin tip={"loading..."} spinning={loadingYear}>
                    <select className={'border-green-500 border-2 px-4 py-1 text-white bg-green-500 text-xl outline-0'} onChange={(e) => {
                        setYearChoose(Number(e.target.value)) ;
                    }}
                        value={yearChoose}
                    >
                        {
                            year.map( (item, index) =>
                                <option key={index}>{item}</option>
                            )
                        }
                    </select>
                </Spin>
            </div>
            <div>
                <Spin tip={"loading..."} spinning={loadingRevenue}>
                    <Column {...config} />
                </Spin>
            </div>
            
        </div>
    );
};

export default OverView;
