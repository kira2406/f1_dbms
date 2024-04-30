const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./database.js")

const PORT = process.env.PORT || 3001;

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {

  // Preventing CORS error
  res.header('Access-Control-Allow-Origin', '*') // Defining access to client
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization') // Define which kind of headers we want to accept

  if (req.method === "OPTIONS") {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
      return res.status(200).json({})
  }

  next();
})

connection.query(`CREATE OR REPLACE FUNCTION GetDriverWithMostPointsEachSeason11()
RETURNS TABLE (season INT, driverid VARCHAR(40), givenName VARCHAR(255), familyName VARCHAR(255), total_points INT
) AS
$$
BEGIN
    RETURN QUERY
    SELECT ds.season, ds.driverid, d.givenName, d.familyName, CAST(SUM(ds.points) AS INT) AS total_points
    FROM driver_standings ds
    JOIN Drivers d ON ds.driverid = d.driverid
    GROUP BY ds.season, ds.driverid, d.givenName, d.familyName
    HAVING
        SUM(ds.points) = (
            SELECT MAX(total_points_season)
            FROM (
                SELECT ds2.season, ds2.driverid, SUM(points) AS total_points_season
                FROM driver_standings ds2
                GROUP BY ds2.season, ds2.driverid
            ) AS season_totals
            WHERE season_totals.season = ds.season
        )
    ORDER BY ds.season;
END;
$$ LANGUAGE plpgsql;`)

app.get('/constructors', (req, res)=>{
  connection.query(`Select * from constructors`, (err, result)=>{
      if(!err){
          res.send(result.rows);
      }
  });
  connection.end;
})

app.get('/circuits', (req, res)=>{
  connection.query(`Select * from circuits`, (err, result)=>{
      if(!err){
          res.send(result.rows);
      }
  });
})

app.get('/races/:circuitId', (req, res) => {
  connection.query(`SELECT * from raceinfo where circuitId = '${req.params.circuitId}' ORDER BY SEASON DESC`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
});

app.get('/driverStandings/:season', (req, res) => {
  connection.query(`SELECT d.driverid,
  CONCAT(d.givenName, ' ', d.familyName) AS fullname,
  SUM(ds.points) AS total_points
  FROM driver_standings ds
  JOIN drivers d ON ds.driverid = d.driverid
  WHERE ds.season = '${req.params.season}'
  GROUP BY d.driverid, d.givenName, d.familyName ORDER BY total_points DESC;`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
});

app.get('/constStandings/:season', (req, res) => {
  connection.query(`SELECT c.constructorName, c.nationality, SUM(ds.points) AS total_points
  FROM driver_standings ds
  JOIN driver_teams dt ON ds.season = dt.season AND ds.driverId = dt.driverId
  JOIN constructors c ON dt.constructorId = c.constructorId
  WHERE ds.season = '${req.params.season}'
  GROUP BY c.constructorId, c.constructorName, c.nationality ORDER BY total_points DESC;`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
});

app.get('/getSeasons', (req, res)=>{
  connection.query(`SELECT DISTINCT season from results ORDER BY season DESC;`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
})
app.get('/getRaces/:season', (req, res)=>{
  connection.query(`SELECT * from raceinfo where season = '${req.params.season}';`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
})
app.get('/getTopDrivers', (req, res)=>{
  connection.query(`WITH driver_season_points AS (
    SELECT * FROM GetDriverWithMostPointsEachSeason11()
)
SELECT driverId,
CONCAT(givenname,' ', familyname) as fullname,
COUNT(*) AS season_count
FROM driver_season_points
GROUP BY driverId, givenname, familyname
ORDER BY season_count DESC
LIMIT 5;`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
})
app.get('/getRaceInfo/:season/:round', (req, res)=>{
  connection.query(`SELECT ri.racetime, CONCAT(d.givenname, ' ', d.familyname) AS fullname, d.nationality,
  ds.position, ds.points, r.resultstatus
  FROM raceinfo ri
  JOIN driver_standings ds ON ri.season=ds.season AND ri.round=ds.round
  JOIN drivers d ON d.driverid = ds.driverid
  JOIN results r ON r.season = ri.season AND r.round = ri.round AND r.driverid = d.driverid
  WHERE ri.season= '${req.params.season}' and ri.round='${req.params.round}' ORDER BY ds.position;`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
})

app.get('/topconstructors/:circuitId', (req, res) => {
  connection.query(`SELECT c.constructorId, c.constructorName, c.nationality, SUM(ds.points) AS total_points
  FROM driver_standings ds
  JOIN driver_teams dt ON ds.season = dt.season AND ds.driverId = dt.driverId
  JOIN constructors c ON dt.constructorId = c.constructorId
  JOIN results r ON ds.season = r.season AND ds.round = r.round AND ds.driverId = r.driverId
  JOIN raceinfo ri ON r.season=ri.season AND r.round=ri.round
  WHERE ri.circuitId = '${req.params.circuitId}'
  GROUP BY c.constructorId, c.constructorName, c.nationality ORDER BY total_points DESC LIMIT 10;`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
});


connection.connect();

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});