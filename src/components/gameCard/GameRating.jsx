import React, { useEffect, useState } from 'react'
import { IoStarSharp } from "react-icons/io5";

const GameRating = ({ rating }) => {
    const [stars, setStars] = useState([])

    const generateStars = () => {
        let stars = [];
        for (let i = 0; i < rating; i++) {
            stars.push(i)
        }
        return stars;
    }

    useEffect(() => {
        setStars(generateStars());
    }, [])


    return (
        <div className='flex items-center'>
            {stars.map((star, index) => (
                <span key={index}>
                    < IoStarSharp color='orange' size={16}/>
                </span>
            ))}
        </div>
    )
}

export default GameRating
