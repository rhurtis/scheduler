import React from "react";
import { render, cleanup, waitForElement, fireEvent, prettyDOM, getAllByTestId, getByText, getByAltText, getByPlaceholderText, queryByText } from "@testing-library/react";
import "@testing-library/react"
import Application from "components/Application";
import "__mocks__/axios.js"



afterEach(cleanup);

// it("renders without crashing", () => {
//   render(<Application />);
// });
describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
  
    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });
  
  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
   // SAVE = SAVING *****
    const { container, debug } = render(<Application />);
    // console.log(prettyDOM(container));
  

    // const appointments = getAllByTestId(container, "appointment");
    // console.log(prettyDOM(appointments));


    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[0]
    //console.log(prettyDOM(appointment));
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    
    fireEvent.click(getByText(appointment, "Save"));
    //console.log('pretty dom app',prettyDOM(appointment))

    // confirmation for showing students name after save.-----------------------------------------------------
    //await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));
    
    
    expect(getByText(appointment, "Saving...")).toBeInTheDocument()
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    debug() //calling to output current state of DOM
    
    expect(getByText(day, "no spots remaining")).toBeInTheDocument()



  });
});
