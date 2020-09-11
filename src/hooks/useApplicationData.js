/*
  A custom hook for the separation of concerns.

  Create a new file hooks/useApplicationData.js and move the logic used to manage the state from the components/Application.js into it.

  Our useApplicationData Hook will return an object with four keys.
    -The state object will maintain the same structure.
    -The setDay action can be used to set the current day.
    -The bookInterview action makes an HTTP request and updates the local state.
    -The cancelInterview action makes an HTTP request and updates the local state.

*/

import { useState, useEffect } from "react";
import "components/Application.scss";
import axios from 'axios';

export default function useApplicationData() {
  // refactoring to combine states
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  //creating a setDay function that updates the state with the new day.
  const setDay = (day) => {
    console.log("setDay was called. Here is the day selected: ", day)
    setState(prev => ({ ...prev, day }))
    
  }
  console.log('As a result of the setDay fcn here is the new state: ', state.day)
  
  // const [results, setResults] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");

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
       // console.log('here is the resp data', resp[0].data)
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

   
  },[]/*[state.days[].spots] [state.days]*/); //commented out dep. arr works for updating spots w/o refreshing page.

  //bookInterview function
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

    // console.log(`new day: ${JSON.stringify(new_day)}`)
    // console.log(`state.days: ${JSON.stringify(state.days)}`)


    //console.log(id, interview);
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

  //the cancelInterview function
  function cancelInterview(id) {
    //console.log('The cancelInterview fcn has beel called. The appointment ID is: ', id);
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
      cancelInterview: cancelInterview
    }
  )

}