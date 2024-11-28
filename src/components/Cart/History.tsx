import {toast} from "react-toastify";
import TableTime from "./TableTime.tsx";

type Props = {
    cart : object[],
    setCart: Function,
    history : object[],
    setHistory : Function,
    setForm : Function,
}

const History = ( props : Props) => {

    const {history, setHistory} = props;

    //fucntion
    const addToCart = ( id :number) => {
        let checked = false;
        history.forEach( his => {
            const product = his.listOrderItems.filter( pro => pro.productId === id );
            if( product.length !== 0){
                checked = true;
                props.setCart(
                    [
                        ...props.cart,
                        product[0]
                    ]
                );
            }
        })
        if( !checked ){
            toast.error("System error!!!")
            return;
        }
        const historyObj : object[] = [];
        history.forEach( his => {
            const data = {
                time : his.time,
                orderId : his.orderId,
                listOrderItems: []
            }
            data.listOrderItems = his.listOrderItems.filter( item => item.productId !== id);
            historyObj.push(data);
        })
        setHistory(historyObj)
    }

    return (
        <div className={'max-h-[500px] overflow-y-scroll'}>
            {
                history ? history.map( (hi, index) =>
                    <TableTime history={history} key={index} data={hi} cart={props.cart} setCart={props.setCart} addToCart={addToCart}/>
                )
                    :
                    <div className={'flex h-[300px] items-center justify-center border-dotted border-2'}>
                        <p className={'text-xl font-bold'}>CART IS EMPTY</p>
                    </div>
            }
        </div>
    );
};

export default History;