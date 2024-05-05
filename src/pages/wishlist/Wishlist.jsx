import React from 'react'
import { useSelector } from 'react-redux'
import { selectWishlistItems, selectStatus } from '../../store/slices/wishlistSlice'
import GameCard from '../../components/gameCard/GameCard'
import { selectUser, isLoading } from '../../store/slices/authSlice'
import Loader from '../../components/loader/Loader'
//react-toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Wishlist = () => {
  const wishlistItems = useSelector(selectWishlistItems)
  const user = useSelector(selectUser)
  const status = useSelector(selectStatus)
  const loading = useSelector(isLoading);


  return (
    <>
      {/* Toast container */}
      <ToastContainer />

      {loading || status === 'loading' ? (
        <Loader />
      ) : (
        user &&
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mx-auto'>
            {wishlistItems.map(game => (
              <div key={game._id} className="game-card">
                <GameCard game={game} />
              </div>
            ))}
          </div>

          {/* emptyCart */}
          {wishlistItems.length === 0 && (
            <h1 className='ml-6 text-2xl sm:text-4xl font-bold text-white'>Your Wishlist is Empty</h1>
          )}
        </>
      )}
    </>
  )
}

export default Wishlist
