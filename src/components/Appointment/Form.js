import React, { useState } from "react";
import InterviewerList from "components/InterviewerList"
import Button from "components/Button"
export default function Form(props) {

  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);

  const reset = function() {
    setInterviewer(null);
    setName("");
    props.onCancel()
  }

  const create = function() {
    if (name && interviewer) {
      props.onSave(name, interviewer);
    } else {
      window.alert("You must fill out the name and interviewer!")
    }
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off">
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </form>
        <InterviewerList interviewers={props.interviewers} value={interviewer} onChange={setInterviewer} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={reset}>Cancel</Button>
          <Button confirm onClick={create}>Save</Button>
        </section>
      </section>
    </main>    
  )

}