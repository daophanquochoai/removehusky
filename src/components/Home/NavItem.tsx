import React from 'react';
import {IoFastFood} from "react-icons/io5";

type Props = {
    active : boolean,
    categoryTitle : string,
    imageUrl : string,
    setActiveCate : () => void,
}
const NavItem = ( props : Props) => {
    return (
        <div className={`${props.active && 'bg-green_primary text-white'} text-green_primary p-4 flex gap-2 items-center cursor-pointer border-dotted border-b-2 text-xl`} onClick={ () => props.setActiveCate()}>
            <img src={props.imageUrl} alt={'icon'} className={'w-[30px] h-[30px]'}/>  <span>{props.categoryTitle}</span>
        </div>
    );
};

export default NavItem;