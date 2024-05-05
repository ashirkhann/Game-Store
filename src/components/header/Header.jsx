import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';

//slice
import { selectWishlistItems } from '../../store/slices/wishlistSlice'
import { selectCartItems } from '../../store/slices/cartSlice';

//icons
import { FaHeart } from "react-icons/fa";
import { IoBagCheckSharp } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";

const Header = ({ handleSidebarToggle }) => {

    const wishlistItemsArray = useSelector(selectWishlistItems);
    const cartItemsArray = useSelector(selectCartItems);

    const user = useSelector(selectUser)

    return (
        <div className="header w-full h-14 flex sm:justify-between justify-end items-center py-4 px-6 bg-gray-900 text-white rounded-xl">
            {/* {selectItems.length} */}
            <button className="sm:block hidden text-white focus:outline-none"
                onClick={handleSidebarToggle}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
            </button>
            <div className="flex items-center space-x-4">
                <span className='relative'>
                    <FaHeart size={24} />
                    {user?.userId && (
                        wishlistItemsArray.length > 0 && (
                            <span className='absolute bottom-0 left-0 transform translate-y-1/2 bg-red-600 px-1 py-[px] rounded-full text-sm font-bold'>{wishlistItemsArray.length}</span>
                        )
                    )}
                </span>
                <span className='relative'>
                    <IoBagCheckSharp size={24} />
                    {user?.userId && (
                        cartItemsArray.length > 0 && (
                            <span className='absolute bottom-0 left-0 transform translate-y-1/2 bg-red-600 px-1 py-[px] rounded-full text-sm font-bold'>{cartItemsArray.length}</span>
                        )
                    )}
                </span>
                <div className="flex items-center">
                    <MdAccountCircle size={24} />
                    <span className="ml-2">{user?.name || user?.fullName || 'User'}</span>
                </div>
            </div>
        </div>
    );
};

export default Header;
