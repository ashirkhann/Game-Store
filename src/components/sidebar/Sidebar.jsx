import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, logout } from '../../store/slices/authSlice';
import { auth } from '../../firebase/firebase'
import { signOut } from 'firebase/auth';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


//icons
import { FaHeart, FaHome } from "react-icons/fa";
import { IoBagCheckSharp } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { RiLogoutBoxLine, RiLoginBoxLine } from "react-icons/ri";
import { IoGameController } from "react-icons/io5";


const Sidebar = ({ sidebarToggle }) => {
    const user = useSelector(selectUser)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = async () => {
        if (user) {
            await signOut(auth);
            dispatch(logout());
            navigate('/')
        }
    }

    return (
        <div className={`sidebar flex flex-col justify-between h-full bg-gray-900 text-white px-0 sm:px-6 py-4 transfrom  ${sidebarToggle ? 'sm:translate-x-0 -translate-x-12 w-0 px-0' : 'translate-0'}   items-center rounded-xl transition-all ease-in duration-200`}>
            {/* Sidebar */}
            <div className="flex flex-col gap-2 ">
                {/* heading */}
                <div className="text-white flex items-center sm:justify-start justify-center space-x-2 p-2 focus:outline-none ">
                    <IoGameController size={28} />
                    <span className={`font-bold text-xl my-3 mx-1 ${sidebarToggle ? 'hidden' : 'sm:block hidden'} `} >GameStore</span>
                </div>
                {/* Home Tab */}
                <NavLink to='/'
                    className={({ isActive }) => `text-white flex items-center sm:justify-start ${sidebarToggle && 'justify-center'}   justify-center space-x-2 p-2 focus:outline-none hover:bg-gray-800 w-full ${isActive ? 'bg-gray-800' : 'bg-none'} `}
                    aria-current="page">
                    <FaHome size={20} />
                    <span className={`${sidebarToggle ? 'hidden' : 'sm:block hidden'}`}>Home</span>
                </NavLink>
                {/* Cart Tab */}
                <NavLink to='/cart'
                    className={({ isActive }) => `text-white flex items-center sm:justify-start justify-center space-x-2 p-2 focus:outline-none hover:bg-gray-800 w-full ${isActive ? 'bg-gray-800' : 'bg-none'} `}
                    aria-current="page">
                    <IoBagCheckSharp size={20} />
                    <span className={`${sidebarToggle ? 'hidden' : 'sm:block hidden'}`}>Your Bag</span>
                </NavLink>
                {/* Wishlist Tab */}
                <NavLink to='/wishlist'
                    className={({ isActive }) => `text-white flex items-center sm:justify-start justify-center space-x-2 p-2 focus:outline-none hover:bg-gray-800 w-full ${isActive ? 'bg-gray-800' : 'bg-none'} `}
                    aria-current="page">
                    <FaHeart size={20} />
                    <span className={`${sidebarToggle ? 'hidden' : 'sm:block hidden'}`}>Wishlist</span>
                </NavLink>
            </div>

            {/* User Info */}
            <NavLink
                to={!user && "/"}
                className="text-white flex items-center sm:justify-start justify-center space-x-2 p-2 focus:outline-none bg-gray-800  hover:bg-gray-700 w-full rounded-xl"
                onClick={user && handleLogout}>
                {user ? <RiLogoutBoxLine size={20} /> : <RiLoginBoxLine size={20} />}
                <span className={`sm:block hidden`}>
                    {user ? 'Logout' : 'Login'}
                </span>
            </NavLink>

        </div>
    );
};

export default Sidebar;
