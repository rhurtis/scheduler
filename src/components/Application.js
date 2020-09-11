import React from "react";
import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment";
import {getInterview, getInterviewersForDay, getAppointmentsForDay} from "helpers/selectors"
import useApplicationData from "hooks/useApplicationData"
import Header from "components/Appointment/Header"


export default function Application(props) {
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  //using the getInterviewByDay selector
  const interviewers = getInterviewersForDay(state, state.day) //returns the interviewers for a specific day.
  const appointments = getAppointmentsForDay(state, state.day) //returns the appointments for a specific day.
  
  const schedule = Object.values(/*state.appointments*/appointments).map((appointment) => {
    const interview = getInterview(state, appointment.interview);

    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

  /*
   TESTING FOR UPDATING SPOTS ASSIGNMENT
  //trying to get the appointments per day as a value.
  //testing appointments
  console.log('showing appointments per day',state.appointments)
  console.log('the output from the getAppointmentsForDay function',getAppointmentsForDay(state, "Monday"))

  */

  return (
    <main className="layout">
      <section className="sidebar">
      <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
      />
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu">
        <DayList
          days={state.days}
          day={state.day}
          setDay={setDay}
        />
      </nav>
      <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs"
      />
      </section>
      <section className="schedule">
        {schedule}
        <article className="appointment" data-testid="appointment" >
          <Header time=/*'5pm'*/{props.time}  />
        </article>

      </section>
    </main>
  );
}


