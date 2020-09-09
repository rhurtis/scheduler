
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

  //onClose for the error screen
  const onClose = function() {
    back(SHOW);
  }

  // save function used with onSave action and bookInterview
  const save = function (name, interviewer) {
    //console.log('here is the save fcn', props.id);
    const interview = {
      student: name,
      interviewer
    };
    transition(STATUS);//saving animation
    props.bookInterview(props.id, interview)
      .then (() => {
        transition(SHOW);
      })
      .catch((error) => {
        transition(ERROR_SAVE, true);
      })
  }

  // deleteInterview function used to delete interview (onDelete action), uses the cancelInterview function/prop.
  const deleteInterview = function(id) {
    //console.log('delete button was clicked. The ID is: ', props.id);
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
    <article className="appointment">
      <Header time={props.time}/>
      { mode===SHOW ? <Show student={props.interview.student} interviewer={props.interview.interviewer.name} onDelete={() => {transition(CONFIRM)}} onEdit={editInterview}/> : <Empty onAdd={onAdd}/> }
      { mode===CREATE ? <Form interviewers={props.interviewers} onCancel={onCancel} onSave={save} /> : null   }
      {mode===STATUS ? <Status /> :null }
      {mode===CONFIRM ? <Confirm message="Are you sure you want to delete?" id={props.id} onCancel={onCancel} onConfirm={() => {deleteInterview(props.id)}}/>: null}
      {mode===DELETE ? <Status mode={mode} /> : null}
      {mode===EDIT ? <Form interviewers={props.interviewers} onCancel={onCancel} onSave={save}/>: null}
      {mode===ERROR_SAVE ? <Error onClose={onClose} /> : null}
      {mode===ERROR_DELETE ? <Error onClose={onClose} /> : null}
    </article>
  )
}