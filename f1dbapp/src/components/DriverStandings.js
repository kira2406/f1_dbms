import React from 'react'

const DriverStandings = props => {
  return (
    <table class="striped centered responsive-table grey lighten-5 z-depth-1">
                    <thead>
                        <tr>
                            <th>POS</th>
                            <th>DRIVER</th>
                            <th>NATIONALITY</th>
                            <th>CAR</th>
                            <th>POINTS</th>
                        </tr>
                    </thead>

                    <tbody>
                        {props.pointsTable.map((row, index)=>
                        <tr className={`teal lighten-${5-index}`} key={row.fullname}>
                            <td>{index+1}</td>
                            <td>{row.fullname}</td>
                            <td>{row.nationality}</td>
                            <td>{row.constructorname}</td>
                            <td>{row.total_points}</td>
                        </tr>
                        )}
                    </tbody>
                </table>
  )
}

DriverStandings.propTypes = {}

export default DriverStandings