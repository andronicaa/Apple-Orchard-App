import React, { useEffect, useState } from 'react';
import firebase from '../../Firebase/firebase';
import { useAuth } from '../../Firebase/context/AuthContext';
import {Bar} from 'react-chartjs-2';
import { monthlyAnnual } from './UtilityFunctions';

export default function Annual({type, year}) {
    // console.log(type, year);
    const { currentUser } = useAuth();
    const [receipt, setReceipt] = useState([]);
    const [loading, setLoading] = useState(true);
    if(type === 'substante') 
        var refReceipt = firebase.firestore().collection("users").doc(currentUser.uid).collection("receipt");
    if(type === 'utilaje')
        var refReceipt = firebase.firestore().collection("users").doc(currentUser.uid).collection("receiptEquipment");
    if(type === 'pomi')
        var refReceipt = firebase.firestore().collection("users").doc(currentUser.uid).collection("receiptTrees");
    function getReceipt() {
        refReceipt.onSnapshot(querySnapshot => {
            const items = [];
            querySnapshot.forEach(doc => {
                // console.log("Anul este: ", doc.data().year);
                if(doc.data().year == year) {
                    console.log(doc.data().year, year, doc.data().year == year)
                    items.push({id: doc.id,...doc.data()});
                }
                // console.log(items);
                setReceipt(items);
                setTimeout(function() {
                    setLoading(false);
                }, 1000);
            })
        })
    }

    
    function getBarData(data, year) {
        return {
            labels: ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'],
            datasets: [
              {
                label: 'Cheltuieli (lei) ' + type,
                backgroundColor: 'rgba(226, 137, 52, 1)',
                borderColor: 'rgba(194,82,68, 1)',
                borderWidth: 2,
                data: [monthlyAnnual(data, 'Ianuarie', year), monthlyAnnual(data, 'Februarie', year), monthlyAnnual(data, 'Martie', year), monthlyAnnual(data, 'Aprilie', year), monthlyAnnual(data, 'Mai', year), monthlyAnnual(data, 'Iunie', year), monthlyAnnual(data, 'Iulie', year), monthlyAnnual(data, 'August', year), monthlyAnnual(data, 'Septembrie', year), monthlyAnnual(data, 'Octombrie', year), monthlyAnnual(data, 'Noiembrie', year), monthlyAnnual(data, 'Decembrie', year)]
              }
            ]
          }
    }
    useEffect(() => {
        getReceipt();
    }, [year]);
    return (
        <div>
            {
                loading == false ?
                (
                    <Bar
                        data={getBarData(receipt, year)}
                        options={{
                            title:{
                            display:true,
                            fontSize:20
                            },
                            legend:{
                            display:true,
                            position:'right'
                            }
                        }}
                    />
                )
                :
                (
                    <p>Nu exista date despre achizitiile din acest an</p>
                )
            }
        </div>
    )
}
