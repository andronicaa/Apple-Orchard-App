import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  WeekView,
  EditRecurrenceMenu,
  AllDayPanel,
  ConfirmationDialog,
} from '@devexpress/dx-react-scheduler-material-ui';
import firebase from '../../../Firebase/firebase';
import { useAuth } from '../../../Firebase/context/AuthContext';
import { v4 as uuidv4 } from "uuid";
const appointments = [{
    id: 0,
    title: 'Website Re-Design Plan',
    startDate: new Date(2021, 6, 1, 9, 30),
    endDate: new Date(2021, 6, 1, 11, 30),
  }, {
    id: 1,
    title: 'Book Flights to San Fran for Sales Trip',
    startDate: new Date(2021, 6, 2, 12, 0),
    endDate: new Date(2021, 6, 2, 13, 0),
  }]
var currentDate = new Date();
var monthDate = currentDate.getMonth() + 1;
var formattedDate = currentDate.getFullYear().toString() + '-' + monthDate.toString() + '-' + currentDate.getDate().toString();

export default function FunctionalProgramTreatment() {

    const [currentDate, setCurrentDate] = useState(formattedDate);
    const [data, setData] = useState([]);
    const [addedAppointments, setAddedAppointments] = useState({});
    const [appointmentChanges, setAppointmentChanges] = useState({});
    const [editingAppointment, setEditingAppointment] = useState(undefined);
    const { currentUser } = useAuth();
    
    const refCurrentUser = firebase.firestore().collection("users").doc(currentUser.uid).collection("treatment_program");
    const changeAddedAppointment = (addedAppointment) => setAddedAppointments(addedAppointment);
    const changeAppointmentChanges = (appointmentChanges) => setAppointmentChanges(appointmentChanges);
    const changeEditingAppointment = (editingAppointment) => setEditingAppointment(editingAppointment);

    function getAllEvents() {
        refCurrentUser.onSnapshot((querySnapshot) => {
            const events = [];
            querySnapshot.forEach((doc) => {
                console.log(doc.data().endDate);
                events.push(doc.data());
            });
            setData(events);
            console.log("Evenimentele sunt:", events);
        })
    }
    function handleChanges({added, changed, deleted}) {
        if (added) {
            // console.log("Am intrat aici");
            // console.log(data.length);
            // console.log(data[data.length - 1]);
            // console.log("Id-ul este: ", startingAddedId);
            // console.log("Datele pe care le am pana acum sunt: ", data)
            // console.log("Obiectul care se doreste a fi adaugat este:", tempData);
            // console.log("Formatul datei este", typeof added.endDate);
            refCurrentUser.
            add(
                {
                    id: uuidv4(),
                    title: added.title,
                    startDate: added.startDate.toString(),
                    endDate: added.endDate.toString(),
                    allDay: added.allDay
                    
                }
            )
            .catch((err) => {
                console.log(err);
            });
            // setData(tempData);
            // console.log(tempData);
        }
        /*
        if (changed) {
            // console.log("Am intrat la changed", changed);
            var idModif;
            var changedElement = {};
            data.forEach(element => {
                // console.log(data[element.id].id);
                if(changed[element.id])
                {
                    // console.log("id-ul este:", data[element.id].id);
                    idModif = data[element.id].id;
                    changedElement = data[element.id];
                }
                    
            });
            // console.log("Id-ul modificarii este: ", idModif);
            var changedData = data.map(appointment => (
              changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment)); 
            //   console.log("Evenimentele modificate sunt: ", changedElement);
              // trebuie sa modific si in baza de date
            //   console.log("Id-ul este: ", changedElement.id);
              refCurrentUser
              .doc(changedElement.id)
              .update(changedElement)
              .catch((err) => {
                  console.log(err);
              })
              setData(changedData);
              setEditingAppointment(changedData);
          }
          */
        if (deleted !== undefined) {
            console.log("Am intrat la deleted", deleted);
            var deletedElement;
            console.log(data);
            data.forEach(element => {
                console.log(element.id);
                
                if (element.id=== deleted)
                {
                    // console.log(data[element.id]);
                    deletedElement = element;
                }
                
            });
            console.log("Elementul de sters este:", deletedElement);
            console.log("Id-ul elementului de sters este: ", deletedElement.id);
            
            refCurrentUser
            .doc(deletedElement.id)
            .delete()
            .then(() => {
                setData((prev) =>
                prev.filter((element) => element.id !== deletedElement.id)
                );
            })
            .catch((err) => {
                console.error(err);
            });
            // setData(data.filter(appointment => appointment.id !== deleted))
        }

        // console.log("Datele finale sunt:", data);
        // return { data };
    }

    useEffect(() => {
        getAllEvents();
    }, []);

    return (
        <>
        <Paper>
            <Scheduler
                data={data}
                height={660}
            >
                <ViewState
                    currentDate={currentDate}
                />
                <EditingState 
                    onCommitChanges={handleChanges}
                    addedAppointment = {addedAppointments}
                    onAddedAppointmentChange={changeAddedAppointment}
                    // appointmentChanges={appointmentChanges}
                    // onAppointmentChangesChange={changeAppointmentChanges}
                    // editingAppointment={editingAppointment}
                    // onEditingAppointmentChange={changeEditingAppointment}
                />
                <WeekView 
                    startDayHour={8}
                    endDayHour={19}
                />
                <AllDayPanel />
                <EditRecurrenceMenu />
                <ConfirmationDialog />
                <Appointments />
                <AppointmentTooltip 
                    showOpenButton
                    showDeleteButton
                />
                <AppointmentForm />
            </Scheduler>
        </Paper>
        </>
    )
}