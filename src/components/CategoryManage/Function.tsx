import {useState} from 'react';
import {SiQuicklook} from "react-icons/si";

type Props = {
    setSearchAccept : Function,
    setAction : Function,
    setOpen : Function,
}

const Function = ( props : Props) => {
    const { setSearchAccept, setAction, setOpen} = props;
    //var
    const [search, setSearch] = useState<string>('')

    //function
    const handleOpen = () => {
        setOpen(true)
        setAction("ADD")
    }

    return (
        <div className={'flex justify-between items-center mb-4'}>
            <div>
                <button className={'transition-all duration-300 font-bold text-white bg-green-500 border-2 border-green-500 hover:bg-white hover:text-green-500 px-4 py-1'} onClick={() => handleOpen()}>Add</button>
            </div>
            <div className={'flex items-center gap-4'}>
                <input className={'outline-0 border-0 border-b-2 border-green-500'} value={search}
                       onChange={(e) => setSearch(e.target.value)}/>
                <SiQuicklook className={'text-green-600 text-2xl cursor-pointer'} onClick={() => {
                    setSearchAccept(search);
                }}/>
            </div>
        </div>
    );
};

export default Function;