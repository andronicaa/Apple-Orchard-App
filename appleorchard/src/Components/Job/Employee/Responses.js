import React, { useRef, useState, useEffect } from 'react';
import firebase from '../../../Firebase/firebase';
import { useAuth } from '../../../Firebase/context/AuthContext';

export default function Responses() {
    const { currentUser } = useAuth();
    const refUsers = firebase.firestore().collection("users");
    const [usersId, setUsersId] = useState([]);
    const [reqResp, setReqResp] = useState([]);
    function getUsersId() {
        const items = [];
        refUsers.onSnapshot(querySnapshot => {
            querySnapshot.forEach((doc) => {
                items.push(doc.id);
            })
            // console.log(items[0]);
        

        items.map(p => {
            console.log("AICIIII");
            var refPosts = firebase.firestore().collection("users").doc(p).collection("onHold").where('status', '!=', 'In asteptare');
            refPosts.onSnapshot(querySnapshot => {
                const posts = [];
                querySnapshot.forEach(doc => {
                    if(doc.data().employeeId == currentUser.uid)
                        posts.push(doc.data());
                })
                console.log("sunt: ", posts.length);
                setReqResp(posts);

            })
        })
    })
    }

   

    useEffect(() => {
        getUsersId();
    }, [])
    return (
        <div>
            
        </div>
    )
}
