import React from 'react'
import { NavLink } from 'react-router-dom'

function Navigation(props) {
    return (
        <div className="navbar-fixed">
            <nav className="transparent z-depth-0 navbar-right-padding">
                <div className="nav-wrapper">
                    <div className="row">
                        <div className="col s12">
                            <ul className="right hide-on-med-and-down">
                                <li><NavLink to="/">HOME</NavLink></li>
                                <li><NavLink to="/results">RESULTS</NavLink></li>
                                <li><NavLink to="/circuits">CIRCUITS</NavLink></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navigation