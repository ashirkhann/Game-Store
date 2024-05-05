import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, removeCartItem, selectStatus } from '../../store/slices/cartSlice';
import { selectUser, isLoading } from '../../store/slices/authSlice';
import { FaTrash } from 'react-icons/fa';

//firebase
import { db } from '../../firebase/firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import Loader from '../../components/loader/Loader';

//react-toastify
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';


const Cart = () => {
  const cartItems = useSelector(selectCartItems);
  const user = useSelector(selectUser);
  const loading = useSelector(isLoading);
  const status = useSelector(selectStatus);
  const dispatch = useDispatch()

  const totalCost = cartItems.reduce((total, game) => total + game.price, 0);
  const discountCost = cartItems.reduce(
    (total, game) => total + (game.price - game.price * game.discount),
    0
  );

  const handleDeleteCart = async (gameId) => {
    try {
      const userRef = doc(db, 'users', user.userId);
      const cartRef = collection(userRef, 'cart');
      const querySnapshot = await getDocs(cartRef);

      querySnapshot.forEach((doc) => {
        const cartItem = doc.data();
        if (cartItem._id === gameId) {
          toast.info(`Game deleted from cart!`);
          deleteDoc(doc.ref);
          dispatch(removeCartItem(gameId));
        }
      });
    } catch (error) {
      console.error('Error handling cart:', error?.message || error);
    }
  };


  return (
    <>
      {/* Toast container */}
      <ToastContainer />

      {loading || status === 'loading' ? (
        <Loader />
      ) : (
        user && (
          <div className='p-4 mx-auto text-white'>
            <div className='grid grid-cols-1 gap-4'>
              {cartItems.map((game, index) => (
                <div key={game._id} className='flex items-center bg-gray-800 p-4 rounded-md shadow-md h-30 '>
                  <img src={game.img} alt={game.title} className='sm:w-40 w-10 h-auto' />
                  <div className='flex flex-col ml-4 text-sm'>
                    <div className='text-lg font-bold'>{game.title}</div>
                    <div className='flex justify-between mt-1'>
                      <div>
                        <span className='font-semibold'>Price: </span><span>${game.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className='flex justify-between'>
                      <div>
                        <span className='font-semibold'>Discount: </span><span>{(game.discount * 100)}%</span>
                      </div>
                    </div>
                    <div className='flex justify-between'>
                      <div>
                        <span className='font-semibold'>Cost: </span><span>${(game.price - game.price * game.discount).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <button className='ml-auto' onClick={() => handleDeleteCart(game._id)}>
                    <FaTrash />
                  </button>
                </div>
              ))}

              {/* checkout */}
              {cartItems.length > 0 &&
                <div className='flex sm:flex-row flex-col sm:items-center justify-between gap-4 py-4 px-4 bg-gray-800'>
                  <div>
                    <div className='text-lg font-semibold'>
                      Total Cost: ${totalCost.toFixed(2)}
                    </div>
                    <div className='text-lg font-semibold text-green-600'>
                      Total Cost After Discount: ${discountCost.toFixed(2)}
                    </div>
                  </div>

                  <div >
                    <button className='text-lg sm:w-auto w-full font-semibold bg-blue-600 text-white px-4 py-2 rounded-md mb-2'>
                      Checkout
                    </button>
                  </div>
                </div>
              }

              {/* emptyCart */}
              {cartItems.length === 0 && (
                <h1 className='ml-4 mt-4 text-2xl sm:text-4xl font-bold'>Your Cart is Empty</h1>
              )}
            </div>
          </div>
        )
      )}

    </>
  );
};

export default Cart;
