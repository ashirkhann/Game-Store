import React from 'react'
import GameCard from '../../../components/gameCard/GameCard'
//react-toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Listing = ({ games }) => {

  return (
    <>
      {/* Toast container */}
      <ToastContainer />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mx-auto">
        {games.map(game => (
          <div key={game._id} className="game-card">
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </>

  )
}

export default Listing
