
import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";
import useVisualMode from "hooks/useVisualMode.js";
import Form from "./Form";


const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const STATUS = "STATUS"; //SAVING
const CONFIRM="CONFIRM";
const DELETE = "DELETE";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const onAdd = function() {
    transition(CREATE)
  }

  const onCancel = function() {
    if(mode===CREATE) 
      {
        back(EMPTY);
      } else if(mode===EDIT) {
        transition(SHOW, true);
      } else if(mode===CONFIRM) {
        transition(SHOW, true);
      }
  }

  const onClose = function() {
    back(SHOW);
  }

  const save = function (name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(STATUS);
    props.bookInterview(props.id, interview)
      .then (() => {
        transition(SHOW);
      })
      .catch((error) => {
        transition(ERROR_SAVE, true);
      })
  }

  const saveEdit = function (name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    
    transition(STATUS);
    props.bookInterviewEdit(props.id, interview)
      .then (() => {
        transition(SHOW);
      })
      .catch((error) => {
        transition(ERROR_SAVE, true);
      })
  }

  const deleteInterview = function(id) {
    transition(DELETE, true);
    props.cancelInterview(id)
      .then(() => {
        transition(EMPTY);
      })
      .catch((error) => {
        transition(ERROR_DELETE, true);
      })
  }
  const editInterview = function () {
    transition(EDIT, true);
  }
  return(
    <article className="appointment" data-testid="appointment" >
      <Header time={props.time}  />
      { mode===SHOW ? <Show  student={props.interview.student} interviewer={props.interview.interviewer.name} onDelete={() => {transition(CONFIRM)}} onEdit={editInterview}/> : <Empty onAdd={onAdd}/> }
      { mode===CREATE ? <Form  interviewers={props.interviewers} onCancel={onCancel} onSave={save} /> : null   }
      {mode===STATUS ? <Status  message="Saving..." /> :null }
      {mode===CONFIRM ? <Confirm  message="Are you sure you want to delete?" id={props.id} onCancel={onCancel} onConfirm={() => {deleteInterview(props.id)}}/>: null}
      {mode===DELETE ? <Status  mode={mode} message="Deleting" /> : null}
      {mode===EDIT ? <Form  interviewers={props.interviewers} onCancel={onCancel} onSave={saveEdit}/>: null}
      {mode===ERROR_SAVE ? <Error  onClose={onClose} message="Error" /> : null}
      {mode===ERROR_DELETE ? <Error  onClose={onClose} message="Error" /> : null}
    </article>
  )
}