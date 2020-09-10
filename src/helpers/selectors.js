// getAppointmentsForDay function

export function getAppointmentsForDay(state, day) {
  console.log('you are in the getAppointmentsForDay fcn');
  const dayFound = state.days.find(dayObj => dayObj.name === day)
  if (!dayFound) {
    return [];
  }
  // convert the appointments Ids from dayFound.appointments into the actual appointments objects

  const appointments = dayFound.appointments.map(appointId => state.appointments[appointId]);
  return appointments;
}


export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  const interviewerID = interview.interviewer;
  const studentObj = interview.student;
  const interviewerObj = state.interviewers[interviewerID];
 
  return (
    {
      "student": studentObj,
      "interviewer": interviewerObj
    }
  ) 
}

// getInterviewerForDay selector
export function getInterviewersForDay(state, day) {
  
  // const dayFound = state.days.find(dayObj => {
  //   return dayObj.name === day
  // })
  
  // if (!dayFound) {
  //   return [];
  // }

  // const appointmentsID = dayFound.appointments;
  // const interviewers = [];
  
  // for (let appID of appointmentsID){
  //   const appointment = state.appointments[appID];
  //   const interview = appointment.interview;
    
  //   if (interview !== null) {
  //     const interviewerID = interview.interviewer;
  //     interviewers.push(state.interviewers[interviewerID]);
  //   }
  // }

  const dayFound = state.days.find(d => day === d.name)

  if (state.days.length === 0 || dayFound === undefined || dayFound.interviewers === undefined) return []

  let interviewers = dayFound.interviewers.map( id => state.interviewers[id])

  console.log(`helper interviewyrs: ${JSON.stringify(interviewers)}`)
  return interviewers;
}


    