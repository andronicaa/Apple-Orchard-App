import React from 'react';
import { useLocation } from 'react-router';

export default function Task() {
    // console.log(data);
    const location = useLocation();
    const weatherData  = location.state.data;
    // console.log("location", location.state.data);
    // console.log("Datele primite ca parametru sunt: ", weatherData);
    return (
        <div>
            Buna ziua
        </div>
    )
}
