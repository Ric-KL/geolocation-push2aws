import { useState , useEffect } from 'react'
import './App.css'
import AWS from 'aws-sdk';

AWS.config.update({
  region: import.meta.env.VITE_AWS_REGION,
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY
});

// Create a DynamoDB document client
const docClient = new AWS.DynamoDB.DocumentClient();

// Define the table name
const tableName = import.meta.env.VITE_AWS_TABLE_NAME;

// Function to save data to DynamoDB
function saveDataToDynamoDB(data) {
  const params = {
    TableName: tableName,
    Item: data
  };

  return docClient.put(params).promise();
}

// Function to fetch data from DynamoDB
function fetchDataFromDynamoDB(key) {
  const params = {
    TableName: tableName,
    Key: {
      // Define the primary key for the item you want to fetch
      primaryKey: key
    }
  };

  return docClient.get(params).promise().then(data => {
    return data.Item;
  });
}

function App() {

const mapsKey = import.meta.env.VITE_MAPS_KEY

const [sessionID , setSessionID] = useState(Array.from(Array(254), () => Math.floor(Math.random() * 36).toString(36)).join(""))

let [coordList , setCoordList] = useState([])

const [lat, setLat] = useState("")
const [lon, setLon] = useState("")
const [URL , setURL] = useState("")

//initialized position watch
useEffect(() => {
  function updateCoords(position) {
    console.log("updating coordinates...")
    setLat(`${position.coords.latitude}`);
    setLon(`${position.coords.longitude}`);
    setCoordList((prevObj) => {
      return [{lat : position.coords.latitude , lon : position.coords.longitude , time : new Date} , ...prevObj]
    })
    let databaseObj = {
      "sessionID" : `${sessionID}`,
      "timestamp" : `${new Date}`,
      "latitude" : position.coords.latitude,
      "longitude" : position.coords.longitude
    }
    saveDataToDynamoDB(databaseObj)
  }

  let options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0,
  };

  function error(err) {
    console.error(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.watchPosition(
    updateCoords , error , options
  );
},[]);

useEffect(() => {
  setURL(`https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${lat},${lon}`)
},
[lat , lon])

  return (
    <>
      <div style={{border : "5px solid white"}}>
        <iframe
          width="600"
          height="450"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={URL}>
        </iframe>
      </div>
      <h1>My Coordinates</h1>
      <div className="card">
          {`coordinates: ${lat} / ${lon}`}
      </div>
      <div style={{display : "flex" , height : "150px" , width : "100%" , flexDirection : "column" , overflowY : "scroll" , border : "5px solid white"}}>
          {coordList.map(
            (entry) => {
              return <p key={Array.from(Array(254), () => Math.floor(Math.random() * 36).toString(36)).join('')}>{`${entry.time} : ${entry.lat} / ${entry.lon}`}</p>
            }
          )}
      </div>
    </>
  )
}

export default App
