import React, {useRef} from 'react'

const Navbar = () => {

  const navRef = useRef();

  return (
      <nav className='nav' ref={navRef}>
        <a href="http://localhost:3000/indexAppPage" className='siteTitle'>The Kwality kitchen</a>
        
        <ul>
            <li>
                <a href="http://localhost:3000/cart">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.8rem" height="1.8rem" fill="currentColor" className="bi bi-cart4" viewBox="0 0 16 16">
                                    <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l.5 2H5V5zM6 5v2h2V5zm3 0v2h2V5zm3 0v2h1.36l.5-2zm1.11 3H12v2h.61zM11 8H9v2h2zM8 8H6v2h2zM5 8H3.89l.5 2H5zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0"/>
                                  </svg>
                </a>
            </li>
            <li>
            <a href="http://localhost:3000/indexAppPage">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.8rem" height="1.8rem" fill="currentColor" className="bi bi-house-fill" viewBox="0 0 16 16">
                                    <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/>
                                    <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z"/>
                                  </svg>
            </a>
            </li>

        </ul>

        
    </nav>
    
  )
}

export default Navbar
