import React, { useEffect, useState } from 'react'
import M from 'materialize-css';
import DriverStandings from './DriverStandings';
import ConstructorStandings from './ConstructorStandings';

function Standings(props) {

    const [driverStands, setDriverStands] = useState([])
    const [constStands, setConstStands] = useState([])
    const [topDrivers, setTopDrivers] = useState([])
    const [selectedSeason, setSelectedSeason] = useState(2019)


    useEffect(() => {
        const elems = document.querySelectorAll('.tabs');
        M.Tabs.init(elems, {});
    }, []);

    useEffect(() => {
        const elems = document.querySelectorAll('.dropdown-trigger');
        M.Dropdown.init(elems, {});
    }, []);

    useEffect(() => {
        const fetchTopDrivers = async () => {
            try {
                const response = await fetch(`http://localhost:3001/getTopDrivers`);
                const jsonData = await response.json();
                setTopDrivers(jsonData)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchTopDrivers();

    }, []);
    useEffect(() => {
        const fetchDriverStands = async () => {
            try {
                const response = await fetch(`http://localhost:3001/driverStandings/${selectedSeason}`);
                const jsonData = await response.json();
                setDriverStands(jsonData)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchDriverStands();

    }, [selectedSeason]);
    useEffect(() => {
        const fetchConstStands = async () => {
            try {
                const response = await fetch(`http://localhost:3001/constStandings/${selectedSeason}`);
                const jsonData = await response.json();
                setConstStands(jsonData)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchConstStands();

    }, [selectedSeason]);

    return (
        <div className='black' style={{ minHeight: '100vh' }}>
            <div className='container' style={{ paddingTop: '20px' }}>
                <div className='row'>
                    <h2 className='white-text font-400 col s12'><i>STANDINGS</i></h2>
                </div>
                <div className="row">
                    <div className="col s6">
                        <ul className="tabs white-text red darken-1" id="standings">
                            <li className="tab col s6"><a className="white-text active" href="#test1">DRIVERS</a></li>
                            <li className="tab col s6"><a href="#test2" className='white-text'>constructors</a></li>
                        </ul>
                    </div>
                    <div className="col s6">
                        <div className="col s8"></div>
                        <button className='dropdown-trigger btn col s4 teal accent-4' data-target='dropdown1' >{selectedSeason}</button>
                        <ul id='dropdown1' className='dropdown-content'>
                            {props && props.seasons.map(season=>
                                <li><span onClick={()=>setSelectedSeason(season.season)} key={season.season}>{season.season}</span></li>
                            )}
                        </ul>
                    </div>
                    <div id="test1" class="col s12">
                        <DriverStandings pointsTable={driverStands}/>
                    </div>
                    <div id="test2" class="col s12">
                        <ConstructorStandings pointsTable={constStands}/>
                    </div>
                </div>
                <div style={{ padding: '20px 0px' }}>
                    <div className='row'>
                    <div className="col s4 black-text">
                    <ul class="collection with-header">
                            <li class="collection-header"><h5>Driver Championships</h5></li>
                            {topDrivers.map(driver=><li class="collection-item"><div>{driver.fullname}<span class="badge">{driver.season_count}</span></div></li>
                        )}
                        </ul>
                    </div>
                    <div className="col s4 black-text">
                    </div>
                    <div className="col s4 black-text">
                    </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Standings