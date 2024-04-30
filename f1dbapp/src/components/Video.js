import React from 'react'


function Video() {
  return (
    <div className="video-container">
    <video autoPlay muted loop>
    <source src={process.env.PUBLIC_URL + '/header.mp4'} type="video/mp4"/>
    Your browser does not support the video tag.
    </video>
    <div className="overlay"></div>
    <div className="container content">
        <h1>FORMULA <span>ONE</span></h1>
        <p className='red-text'>ENTER THE RACING WORLD</p>
    </div>
</div>
  )
}

export default Video