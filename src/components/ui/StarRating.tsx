import NextImage from 'next/image'
import React, { useState } from 'react'
import starlight from '../../../public/star-light.svg'
import starsolid from '../../../public/star-solid.svg'

type Props = {
  rating: number
  setRating: (rating: number) => void
}

const StarRating = ({ rating, setRating } : Props) => {
  const [hover, setHover] = useState(0)
  return (
    <div className='grid grid-cols-[repeat(5,max-content)]'>
      {[1, 2, 3, 4, 5].map((star, index) => {
        index += 1
        return index <= ((rating && hover) || hover) ? (
          <div
            key={index}
            onClick={() => setRating(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
            style={{cursor: 'pointer'}}
          >
            <NextImage src={starsolid as string} height={25} width={25} alt="" />
          </div>
        ) : (
          <div
            key={index}
            onClick={() => setRating(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
            style={{cursor: 'pointer'}}
          >
            <NextImage src={starlight as string} alt="" height={25} width={25} />
          </div>
        )
      })}
    </div>
  )
}

export default StarRating
