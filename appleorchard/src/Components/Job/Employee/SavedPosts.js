// Ruta pe care poate sa o acceseze doar un angajat
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../Firebase/context/AuthContext';
import firebase from '../../../Firebase/firebase';
import { Card } from 'react-bootstrap';


export default function SavedPosts() {
    const { currentUser } = useAuth();
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const refSavedPosts = firebase.firestore().collection("users").doc(currentUser.uid).collection("savePost");
    function getSavedPost() {
        refSavedPosts.onSnapshot(querySnapshot => {
            const items = [];
            querySnapshot.forEach(doc => {
                // aici iar doar id-urile pentru postari
                items.push({id: doc.id,...doc.data()});
            })
            console.log("Job-urile salvate sunt: ", items);
            setSavedPosts(items);
            setLoading(function() {
                setLoading(false);
            }, 1000);
        })
    }
    useEffect(() => {
        getSavedPost();
    }, []);
    return (
        <div>
            {loading == false ? (
                savedPosts.map(p => (
                    <Card key={p.id}>
                        <div>{p.i.employeerFirstName}</div>
                        <div>{p.employeerFirstName}</div>
                    </Card>
                ))
            )
            :
            (
                <div>...loading</div>
            )
            }
        </div>
    )
}
