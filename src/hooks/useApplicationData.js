/*
  A custom hook for the separation of concerns.
*/

import { useState, useEffect } from "react";
import "components/Application.scss";
import axios from 'axios';

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  //creating a setDay function that updates the state with the new day.
  const setDay = (day) => {
    setState(prev => ({ ...prev, day })) 
  }
  
  
  useEffect(() => {
    const URL1 = "http://localhost:8001/api/days"
    const URL2 = "http://localhost:8001/api/appointments"
    const URL3 = "http://localhost:8001/api/interviewers"
    const daysRequest = axios.get(URL1);
    const appointmentsRequest = axios.get(URL2);
    const interviewersRequest = axios.get(URL3);

    Promise
      .all([daysRequest, appointmentsRequest, interviewersRequest])
      .then(function(resp) {
       
        setState(prev => (
          {
            ...prev,
            days: resp[0].data,
            appointments: resp[1].data,
            interviewers: resp[2].data
          }
        ))
      })
      .catch((error) => {
        console.log('There was an error with the axios get request:',error);
      });
  },[]); 

  
  function bookInterview(id, interview) {
    const getDay = (appointment)=>{
      return state.days.filter(day => day.appointments.includes(appointment))[0]
    }
    let day = getDay(id)
    let new_day = {
      ...day,
      spots: day.spots -1
    }

    let new_days = [...state.days]
    for(let i =0; i < state.days.length; i++){
      if(state.days[i].id === new_day.id){
        new_days.splice(i, 1, new_day)
      }
    }

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    //making a put request with axios to update the database with the appointment data.
    return (
    axios.put(`http://localhost:8001/api/appointments/${id}`, {id,interview} )
      .then(() => {
        setState({
          ...state,
          appointments,
          days: new_days
        });    
      })
    )  
  };
  
  // This function doesn't change the spots remaining.
  function bookInterviewEdit(id, interview) {
    const getDay = (appointment)=>{
      return state.days.filter(day => day.appointments.includes(appointment))[0]
    }
    let day = getDay(id)
    let new_day = {
      ...day,
      spots: day.spots
    }

    let new_days = [...state.days]
    for(let i =0; i < state.days.length; i++){
      if(state.days[i].id === new_day.id){
        new_days.splice(i, 1, new_day)
      }
    }

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    //making a put request with axios to update the database with the appointment data.
    return (
    axios.put(`http://localhost:8001/api/appointments/${id}`, {id,interview} )
      .then(() => {
        setState({
          ...state,
          appointments,
          days: new_days
        });    
      })
    )  
  };

  
  function cancelInterview(id) {
    const getDay = (appointment)=>{
      return state.days.filter(day => day.appointments.includes(appointment))[0]
    }
    let day = getDay(id)
    let new_day = {
      ...day,
      spots: day.spots +1
    }

    let new_days = [...state.days]
    for(let i =0; i < state.days.length; i++){
      if(state.days[i].id === new_day.id){
        new_days.splice(i, 1, new_day)
      }
    }
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    return(
      axios.delete(`http://localhost:8001/api/appointments/${id}`)
        .then(() => {
          setState({
          ...state,
          appointments,
          days: new_days
          })
        })
    )
  };

  return(
    {
      state: state,
      setDay: setDay,
      bookInterview: bookInterview,
      bookInterviewEdit: bookInterviewEdit,
      cancelInterview: cancelInterview
    }
  )
}