import React, { useEffect, useState } from 'react'

function Circuits() {

    const [circuits, setCircuits] = useState([])
    const [selectedCircuit, setSelectedCircuit] = useState(null)
    const [circuitRaces, setCircuitRaces] = useState([])
    const [topConstructors, setTopConstructors] = useState([])

    useEffect(() => {
        const fetchCircuitsData = async () => {
            try {
                const response = await fetch('http://localhost:3001/circuits');
                const jsonData = await response.json();
                setCircuits(jsonData);
                setSelectedCircuit(null)
                setCircuitRaces([])
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchCircuitsData();

    }, []);

    useEffect(() => {
        const fetchCircuitRaces = async () => {
            try {
                const response = await fetch('http://localhost:3001/races/'+selectedCircuit.circuitid);
                const jsonData = await response.json();
                setCircuitRaces(jsonData)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        if (selectedCircuit && selectedCircuit.circuitid){
            fetchCircuitRaces();
        }
    }, [selectedCircuit])
    
    useEffect(() => {
        const fetchCircuitRaces = async () => {
            try {
                const response = await fetch('http://localhost:3001/topconstructors/'+selectedCircuit.circuitid);
                const jsonData = await response.json();
                setTopConstructors(jsonData)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        if (selectedCircuit && selectedCircuit.circuitid){
            fetchCircuitRaces();
        }
    }, [selectedCircuit])
    


    return (
        <div className='black' style={{ 'padding': '20px', 'background-color': '#2E2836' }}>
            <div className='container'>
                <h2 className='white-text font-400'><i>CIRCUITS</i></h2>
                {!selectedCircuit ?
                    <div>
                        <div className='row'>
                            <h3 className='teal-text text-accent-2 font-400'>List of International Circuits</h3>
                        </div>
                        <div class="collection">
                            {circuits.map(circuit =>
                                <a href="#!" class="collection-item center-align teal-text text-accent-4" onClick={() => setSelectedCircuit(circuit)}>{circuit.circuitname}</a>
                            )}
                        </div>
                    </div>
                    :
                    <div>
                        <div className='row'>
                            <h3 className='padding-10 teal-text text-accent-2 font-400'>{selectedCircuit.circuitname}</h3>
                        </div>
                        <div className='row'>
                            <div className='col s4'>
                                <div class="card-panel teal accent-1">
                                    <span class="card-title"><b>Last Race</b></span>
                                    <div class="card-content">
                                        {circuitRaces.length == 0 ? <p>No races held</p>:<p>{circuitRaces[0]?.racename}</p>}
                                        {circuitRaces && <p>{circuitRaces[0]?.season}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className='col s4'>
                                <div class="card-panel teal accent-1">
                                    <span class="card-title"><b>First Race</b></span>
                                    <div class="card-content">
                                        {circuitRaces.length == 0 ? <p>No races held</p>:<p>{circuitRaces[circuitRaces.length-1]?.racename}</p>}
                                        {circuitRaces && <p>{circuitRaces[circuitRaces.length-1]?.season}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col s6'>
                                <div className='row' style={{ padding: '0px 10px' }}>
                                    <h4 className='white-text'>Most wins</h4>
                                </div>
                                <table class="responsive-table striped grey lighten-5 z-depth-1 centered">
                                    <thead>
                                        <tr>
                                            <th>CONSTRUCTORS</th>
                                            <th>NATIONALITY</th>
                                            <th>TOTAL POINTS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {circuitRaces.length > 0 && topConstructors.map(constructor=>
                                        <tr>
                                            <td>{constructor.constructorname}</td>
                                            <td>{constructor.nationality}</td>
                                            <td>{constructor.total_points}</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                                {circuitRaces.length == 0 ?<div className='center-align red lighten-4' style={{padding: '12px 0px'}}>No races held</div>:""}
                            </div>
                            <div className='col s6'>
                                <div className='row' style={{ padding: '0px 10px' }}>
                                    <h4 className='white-text'>Races</h4>
                                </div>
                                <table class="responsive-table striped grey lighten-5 z-depth-1 centered">
                                    <thead>
                                        <tr>
                                            <th>SEASON</th>
                                            <th>CIRCUIT NAME</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {circuitRaces.map(race=>
                                            <tr>
                                            <td>{race.season}</td>
                                            <td>{race.racename}</td>
                                        </tr>
                                        )}
                                    </tbody>
                                </table>
                                {circuitRaces.length == 0 ?<div className='center-align red lighten-4' style={{padding: '12px 0px'}}>No races held</div>:""}
                            </div>
                        </div>
                        <div className='row' style={{ padding: '10px' }}>
                            <a className='btn red' onClick={() => setSelectedCircuit(null)}>Go Back to list</a>
                        </div>
                    </div>}
            </div>
        </div>
    )
}

export default Circuits