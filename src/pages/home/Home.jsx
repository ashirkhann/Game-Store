import React, { useState, useEffect } from 'react';
//components
import Listing from './listing/Listing'
import Authentication from '../authentication/Authentication';
//store + firebase
import { useSelector } from 'react-redux'
import { isLoading, selectUser } from '../../store/slices/authSlice'
import Loader from '../../components/loader/Loader';



const Home = () => {
  const user = useSelector(selectUser)
  const loading = useSelector(isLoading)
  const [games, setGames] = useState([]);

  // fetchGameData
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('../../api/gamesData.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data!');
        }
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  return (
    <>
      {loading ? (
        <Loader />
      ) : user ? (
        <Listing games={games} />
      ) : (
        <Authentication />
      )}
    </>
  );
};

export default Home;
