import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import { addCartItem, removeCartItem, selectCartItems } from '../../store/slices/cartSlice';
import { addWishlistItem, removeWishlistItem, selectWishlistItems } from '../../store/slices/wishlistSlice';
import { doc, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
//toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useNavigate } from 'react-router-dom';
import GameRating from '../../components/gameCard/GameRating';
import { FaHeart } from 'react-icons/fa';
import { IoBagCheckSharp } from 'react-icons/io5';
import { FaCheck } from 'react-icons/fa';

const GameDetail = () => {
    const { gameId } = useParams();
    const [game, setGame] = useState(null);
    const [wishlisted, setWishlisted] = useState(false);
    const [carted, setCarted] = useState(false);
    const [showTrailer, setShowTrailer] = useState(false);
    const [videoWidth, setVideoWidth] = useState(560);
    const [videoHeight, setVideoHeight] = useState(315);

    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const wishlistItems = useSelector(selectWishlistItems);
    const cartItems = useSelector(selectCartItems);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGameData = async () => {
            try {
                const response = await fetch('../../api/gamesData.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch data!');
                }
                const data = await response.json();
                // Find the game with the matching gameId
                const selectedGame = data.find((game) => game._id === parseInt(gameId));
                setGame(selectedGame);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchGameData();
    }, [gameId]);

    useEffect(() => {
        const isWishlisted = wishlistItems?.some((item) => item._id === game?._id);
        setWishlisted(isWishlisted);
    }, [wishlistItems, game]);

    useEffect(() => {
        const isCarted = cartItems?.some((item) => item._id === game?._id);
        setCarted(isCarted);
    }, [cartItems, game]);

    useEffect(() => {
        // Adjust video size for smaller screens
        const handleResize = () => {
            if (window.innerWidth < 560) {
                setVideoWidth(window.innerWidth - 20);
                setVideoHeight((window.innerWidth - 20) * (315 / 560));
            } else {
                setVideoWidth(560);
                setVideoHeight(315);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                toast.success('Game added to cart!');
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

    const handleToggleTrailer = () => {
        setShowTrailer(!showTrailer);
    };

    if (!game) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {user &&
                <>
                    {/* Toast container */}
                    <ToastContainer />

                    <div className="m-4 mx-auto max-w-xs  rounded overflow-hidden shadow-lg bg-gray-800 cursor-pointer transition-all duration-200 ease-in transform text-white">
                        <div
                            className={`right-1 top-1 absolute rounded-md p-2 px-3 bg-gray-800 ${wishlisted ? 'text-red-500' : 'text-white'}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleWishlist(game);
                            }}>
                            <FaHeart size={16} />
                        </div>
                        <img className="w-full h-48 object-cover" src={game.img} alt={game.title} />
                        <div className="px-6 py-4">
                            <div className="font-bold inline-block text-sm mb-1 py-1 px-2 rounded-lg bg-cyan-600">{game.level}</div>
                            <div className="font-bold text-xl mb-1">{game.title}</div>
                            <p className=" text-gray-500 ">{game.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <p className="text-gray-500">Rating: {game.rating}</p>
                                <GameRating rating={game.rating} />
                            </div>
                            <p className="text-gray-300 font-bold line-through">Price: ${game.price}</p>
                            <div className="w-full flex justify-between mt-2">
                                <div className="space-x-2">
                                    <div className="font-bold inline-block text-sm py-1 px-2 rounded-lg bg-yellow-600">{game.discount * 100}% OFF</div>
                                    <div className="font-bold inline-block text-sm py-1 px-2 rounded-lg bg-red-600 ">${game.price - game.price * game.discount}</div>
                                </div>
                                <div
                                    className={`rounded-md p-2 px-3 bg-cyan-600 ${carted && 'bg-cyan-900'}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCart(game);
                                    }}>
                                    {carted ? <FaCheck size={16} /> : <IoBagCheckSharp size={16} />}
                                </div>
                            </div>
                        </div>
                        <div className="w-full mb-6 flex justify-center ">
                            <button onClick={handleToggleTrailer} className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-700 transition duration-300 ease-in-out font-bold">Show Trailer</button>
                        </div>
                    </div>
                    {showTrailer && (
                        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center" onClick={handleToggleTrailer}>
                            <iframe
                                width={videoWidth}
                                height={videoHeight}
                                src={game.trailer}
                                title="Game Trailer"
                                allowFullScreen
                                className="absolute"
                            ></iframe>
                        </div>
                    )}

                </>
            }
        </>
    );
};

export default GameDetail;
