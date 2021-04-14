import React from 'react'
import './Map.css';

class Map extends React.Component {
  render() {
    return (
        <div>
            <img alt = "campus-map" src="./CampusMap.png" className="mapStyle" />
            <img alt = "map-index" src="./MapIndex.png"className="mapStyle" />
        </div>
    );
  } 
}

export default Map;