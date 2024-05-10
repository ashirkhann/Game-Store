import React, { useState, useEffect, } from 'react';
import GameRating from './GameRating';
import { FaHeart } from "react-icons/fa";
import { IoBagCheckSharp } from "react-icons/io5";
import { FaCheck } from 'react-icons/fa';
import './GameCard.css';
import { useDispatch, useSelector } from 'react-redux';
import { addCartItem, removeCartItem, selectCartItems } from '../../store/slices/cartSlice';
import { addWishlistItem, removeWishlistItem, selectWishlistItems } from '../../store/slices/wishlistSlice';
import { selectUser } from '../../store/slices/authSlice';
import { db } from '../../firebase/firebase';
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
//react-toastify
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const GameCard = React.memo(({ game }) => {
    const [wishlisted, setWishlisted] = useState(false);
    const [carted, setCarted] = useState(false);

    const wishlistItems = useSelector(selectWishlistItems);
    const cartItems = useSelector(selectCartItems);

    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const isWishlisted = wishlistItems?.some(item => item._id === game._id);
        setWishlisted(isWishlisted);
    }, [wishlistItems]);

    useEffect(() => {
        const isCarted = cartItems?.some(item => item._id === game._id);
        setCarted(isCarted);
    }, [cartItems]);

    const handleWishlist = async (game) => {
        try {
            const userRef = doc(db, 'users', user.userId);
            const wishlistRef = collection(userRef, 'wishlist');

            if (!wishlisted) {
                toast.success('Game added to wishlist!');
                await addDoc(wishlistRef, game);
                dispatch(addWishlistItem(game));
            } else {
                const querySnapshot = await getDocs(wishlistRef);
                querySnapshot.forEach((doc) => {
                    const wishlistItem = doc.data();
                    if (wishlistItem._id === game._id) {
                        toast.info('Game deleted from wishlist!');
                        deleteDoc(doc.ref);
                        dispatch(removeWishlistItem(game._id));
                    }
                });
            }
        } catch (error) {
            console.error('Error handling wishlist:', error?.message || error);
        }
    };

    const handleCart = async (game) => {
        setCarted(!carted);

        try {
            const userRef = doc(db, 'users', user.userId);
            const cartRef = collection(userRef, 'cart');

            if (!carted) {
                await addDoc(cartRef, game);
                toast.success('Game added to cart!')
                dispatch(addCartItem(game));
            } else {
                const querySnapshot = await getDocs(cartRef);
                querySnapshot.forEach((doc) => {
                    const cartItem = doc.data();
                    if (cartItem._id === game._id) {
                        deleteDoc(doc.ref);
                        toast.info('Game deleted from cart!');
                        dispatch(removeCartItem(game._id));
                    }
                });
            }
        } catch (error) {
            console.error('Error handling cart:', error?.message || error);
        }
    };


    const handleGameDetail = (gameId) => {
        navigate(`/details/${gameId}`); // Redirect to game detail page
    };

    return (
        <>
            <div className="max-w-xs h-full rounded overflow-hidden shadow-lg bg-gray-800  transition-all duration-200 ease-in transform text-white"
            >
                <div className={`right-1 top-1 absolute rounded-md p-2 px-3 bg-gray-800 ${wishlisted ? 'text-red-500' : 'text-white'} cursor-pointer`}
                    onClick={() => handleWishlist(game)}>
                    <FaHeart size={16} />
                </div>
                <img className="w-full h-48 cursor-pointer object-cover" src={game.img} alt={game.title}
                    onClick={() => handleGameDetail(game._id)} />
                <div className="px-6 py-4">
                    <div className="font-bold inline-block text-sm mb-1 py-1 px-2 rounded-lg bg-cyan-600">{game.level}</div>
                    <div className="font-bold text-xl mb-1">{game.title}</div>
                    <p className="description text-gray-500 ">{game.description}</p>
                    <div className='flex items-center gap-2 mt-2'>
                        <p className="text-gray-500">Rating: {game.rating}</p>
                        <GameRating rating={game.rating} />
                    </div>
                    <p className="text-gray-300 font-bold line-through">Price: ${game.price}</p>
                    <div className='w-full flex justify-between mt-2'>
                        <div className='space-x-2'>
                            <div className="font-bold inline-block text-sm py-1 px-2 rounded-lg bg-yellow-600">{game.discount * 100}% OFF</div>
                            <div className="font-bold inline-block text-sm py-1 px-2 rounded-lg bg-red-600 ">${game.price - (game.price * game.discount)}</div>
                        </div>
                        <div className={` rounded-md p-2 px-3 bg-cyan-600 ${carted && 'bg-cyan-900'} cursor-pointer`}
                            onClick={() => handleCart(game)}>
                            {carted ? <FaCheck size={16} /> : <IoBagCheckSharp size={16} />}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default GameCard;
