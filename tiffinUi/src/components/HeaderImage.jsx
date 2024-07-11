import React from 'react'
import image from '../assets/headerImage.jpg'

const HeaderImage = () => {

    const myStyle ={
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '70vh',
        fontSize: '50px',
        
    }

  return (
    <>
    <div className='flex mt-10 justify-end items-center' style={myStyle}>
      <h1 className='text-white mr-10'>The Kwality Kitchen Meal Service</h1>
    </div>
    
    </>
  )
}

export default HeaderImage
