import React, { useState, useEffect } from 'react'
import firebase from "../firebase";
export default function TempProfile() {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    // colectia mea din baza de date se numeste profiles
    const ref = firebase.firestore().collection("profiles");

    function getProfiles() {
        setLoading(true);
        ref.onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });
            console.log("Buna seara");
            console.log(items);
            setProfiles(items);
            setLoading(false);
        })
    }
    
    useEffect(() => {
        console.log("Am intrat");
        getProfiles();
    }, []);

    if (loading)
    {
        return <h1>Loading...</h1>
    }
    return (
        <div>
            <h2>Profiles</h2>
            {
                profiles.map((profile) => (
                    <div key={profile.id}>
                        <h2>{profile.firstName}</h2>
                        <p>{profile.age}</p>
                        <p>{profile.address}</p>
                    </div>
                ))
            }
        </div>
    )
}
