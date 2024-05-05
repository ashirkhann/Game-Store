import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import Cart from './pages/cart/Cart'
import Wishlist from './pages/wishlist/Wishlist'
import Header from './components/header/Header'
import Sidebar from './components/sidebar/Sidebar'
import PageNotFound from './pages/pageNotFound/PageNotFound';
import GameDetail from './pages/gameDetail/GameDetail';
//firebase+redux
import { useSelector, useDispatch } from 'react-redux'
import { login, selectUser, setLoading } from './store/slices/authSlice'
import { auth } from './firebase/firebase'
import { updateProfile } from 'firebase/auth'
//slice
import { fetchWishlistItems } from './store/slices/wishlistSlice';
import { fetchCartItems } from './store/slices/cartSlice';



function App() {
  const user = useSelector(selectUser)
  const dispatch = useDispatch();

  const [sidebarToggle, setSidebarToggle] = useState(false)

  const handleSidebarToggle = () => {
    setSidebarToggle(!sidebarToggle);
  }

  //Auth Checker
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(setLoading(true));
        updateProfile(authUser, { displayName: authUser.displayName })
          .then(() => {
            dispatch(login({
              userId: authUser.uid,
              name: authUser.displayName,
              email: authUser.email
            }));
          })
          .catch((error) => {
            console.log("Error updating user profile:", error);
          })
          .finally(() => {
            dispatch(setLoading(false));
          });
      } else {
        dispatch(setLoading(false));
      }
    });

    return unsubscribe;
  }, []);

  //fetch wishlist+cart items
  useEffect(() => {
    if (user?.userId) {
      dispatch(fetchWishlistItems(user?.userId));
      dispatch(fetchCartItems(user?.userId));
    }
  }, [user]);


  return (
    <>
      <BrowserRouter>
        <div className='flex w-full h-screen p-1 bg-gray-700 '>
          <Sidebar sidebarToggle={sidebarToggle} />
          <div className='flex flex-col w-full h-full px-1'>
            <Header handleSidebarToggle={handleSidebarToggle} />
            <div className="overflow-y-scroll h-full w-full bg-gray-900 my-1 rounded-xl">
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/wishlist' element={<Wishlist />} />
                <Route path='/details/:gameId' element={<GameDetail />} />
                <Route path='*' element={<PageNotFound />} />
              </Routes>
            </div>
          </div>
        </div>

      </BrowserRouter>
    </>
  )
}

export default App
