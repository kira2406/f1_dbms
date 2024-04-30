import React from 'react'

const ConstructorStandings = props => {
  return (
    <table class="striped centered responsive-table grey lighten-5 z-depth-1">
                    <thead>
                        <tr>
                            <th>POS</th>
                            <th>CONSTRUCTOR</th>
                            <th>NATIONALITY</th>
                            <th>POINTS</th>
                        </tr>
                    </thead>

                    <tbody>
                    {props.pointsTable.map((row, index)=>
                        <tr className={`teal lighten-${5-index}`} key={row.constructorname}>
                            <td>{index+1}</td>
                            <td>{row.constructorname}</td>
                            <td>{row.nationality}</td>
                            <td>{row.total_points}</td>
                        </tr>
                        )}
                    </tbody>
                </table>
  )
}

ConstructorStandings.propTypes = {}

export default ConstructorStandings