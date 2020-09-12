

export function getAppointmentsForDay(state, day) {
  const dayFound = state.days.find(dayObj => dayObj.name === day)
  if (!dayFound) {
    return [];
  }
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


export function getInterviewersForDay(state, day) {
  const dayFound = state.days.find(d => day === d.name)

  if (state.days.length === 0 || dayFound === undefined || dayFound.interviewers === undefined) return []

  let interviewers = dayFound.interviewers.map( id => state.interviewers[id])

  return interviewers;
}


    