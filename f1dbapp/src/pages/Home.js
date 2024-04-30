import React from 'react'
import Video from '../components/Video'
import Standings from '../components/Standings'


function Home(props) {

  return (
    <div className='container-fluid'>
        <Video />
        <Standings seasons={props.seasons || []}/>
    </div>
  )
}

export default Home