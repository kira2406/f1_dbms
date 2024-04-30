import React, { useEffect, useState } from 'react'
import M from 'materialize-css';

function Results(props) {

    const [races, setRaces] = useState([])
    const [selectedSeason, setSelectedSeason] = useState('2019')
    const [selectedRound, setSelectedRound] = useState(null)
    const [raceInfo, setraceInfo] = useState([])

    useEffect(() => {
        const elems = document.querySelectorAll('.dropdown-trigger');
        M.Dropdown.init(elems, {});
    }, []);

    useEffect(() => {
        const fetchRaces = async () => {
            try {
                const response = await fetch('http://localhost:3001/getRaces/' + selectedSeason);
                const jsonData = await response.json();
                setRaces(jsonData)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchRaces();
    }, [selectedSeason])

    useEffect(() => {
        const fetchRaceInfo = async () => {
            try {
                const response = await fetch(`http://localhost:3001/getRaceInfo/${selectedSeason}/${selectedRound.round}`);
                const jsonData = await response.json();
                setraceInfo(jsonData)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        if (selectedSeason && selectedRound) {

            fetchRaceInfo();
        }
    }, [selectedRound])

    return (
        <div className='black' style={{ 'padding': '20px', 'background-color': '#2E2836' }}>
            <div className='container'>
                <h2 className='white-text font-400'><i>RESULTS</i></h2>
                {raceInfo.length <= 0 ? <div>

                    <div className='row'>
                        <h3 className='white-text font-400'>{`Races held in ${selectedSeason} season`}</h3>
                    </div>
                    <div className="col s6">
                        <div className="col s8"></div>
                        <button className='dropdown-trigger btn col s4 teal accent-4' data-target='dropdown1' >{selectedSeason}</button>
                        <ul id='dropdown1' className='dropdown-content'>
                            {props && props.seasons.map(season => {
                                if (season.season >= 1996) {
                                    return <li><a onClick={() => setSelectedSeason(season.season)} key={season.season}>{season.season}</a></li>
                                }
                            }
                            )}
                        </ul>
                    </div>
                    <div class="collection">
                        {races.map(race =>
                            <a href="#!" class="collection-item center-align teal-text text-accent-4" onClick={() => setSelectedRound(race)}>{race.racename}</a>
                        )}
                    </div>
                </div>
                    : <div>
                        <div className='row'>
                            <h3 className='teal-text text-accent-2 font-400'>{selectedRound.racename}</h3>
                        </div>
                        <div className='row'>
                            <table class="responsive-table striped grey lighten-5 z-depth-1 centered">
                                <thead>
                                    <tr>
                                        <th>POS</th>
                                        <th>DRIVER</th>
                                        <th>NATIONALITY</th>
                                        <th>STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {raceInfo.map((race, index) =>
                                        <tr>
                                            <td>{race.position}</td>
                                            <td>{race.fullname}</td>
                                            <td>{race.nationality}</td>
                                            <td>{race.resultstatus}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className='row' style={{ padding: '10px' }}>
                            <button className='btn red' onClick={() => setraceInfo([])}>Go Back to list</button>
                        </div>

                    </div>}
            </div>
        </div>
    )
}

export default Results