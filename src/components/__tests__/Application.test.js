import React from "react";
import { render, cleanup, waitForElement, fireEvent, prettyDOM, getAllByTestId, getByText, getAllByText, getByAltText, getByPlaceholderText, queryByText, queryByAltText } from "@testing-library/react";
import "@testing-library/react"
import Application from "components/Application";
import "__mocks__/axios.js"
import axios from "axios";



afterEach(cleanup);

// it("renders without crashing", () => {
//   render(<Application />);
// });
describe("Application", () => {
 // cleanup();
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
    //debug() //calling to output current state of DOM
    
    expect(getByText(day, "no spots remaining")).toBeInTheDocument()



  });
 // cleanup();
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
     
    // 1. Render the Application.
      const { container, debug } = render(<Application />);
      
      // 2. Wait until the text "Archie Cohen" is displayed.
      await waitForElement(() => getByText(container, "Archie Cohen"));
      debug();  
      // 3. Click the "Delete" button on the booked appointment.
      const appointment = getAllByTestId(container, "appointment").find(
        appointment => queryByText(appointment, "Archie Cohen")
      );

      fireEvent.click(queryByAltText(appointment, "Delete"));

      // 4. Check that the confirmation message is shown.
      expect(
        getByText(appointment, "Are you sure you want to delete?")
      ).toBeInTheDocument();

      // 5. Click the "Confirm" button on the confirmation.
      fireEvent.click(queryByText(appointment, "Confirm"));

      // 6. Check that the element with the text "Deleting" is displayed.
      expect(getByText(appointment, "Deleting")).toBeInTheDocument();

      // 7. Wait until the element with the "Add" button is displayed.
      await waitForElement(() => getByAltText(appointment, "Add"));

      // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
      
      const day = getAllByTestId(container, "day").find(day =>
        queryByText(day, "Monday")
      );
      console.log('--------------------------------------------------------------------------------------------------------------------------------------')
      expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
     
      debug();
     
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
      
    // 2. Wait until the text "Archie Cohen" is displayed. AKA Find an existing interview.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    
    // 3. Click the "Edit" button on the booked appointment. 
    fireEvent.click(queryByAltText(appointment, "Edit"));

    // 4. Change the name and press the save interview button.
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Ryan Hurtis" }
    });
    fireEvent.click(getByText(appointment, "Save"));
    
    // 5. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();  
  });

  it("shows the save error when failing to save an appointment", async () => {
    // first render the application
    const { container, debug } = render(<Application />);

    // press the add button to book an appointment and save.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[0]
    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    axios.put.mockRejectedValueOnce();
    fireEvent.click(getByText(appointment, "Save"));
    await waitForElement(() => getAllByText(appointment, "Error"));
    

    expect(getAllByText(appointment, "Error")[0]).toBeInTheDocument()

  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    const { container, debug } = render(<Application />);
    
    // load the data and press the delete button
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );


    axios.delete.mockRejectedValueOnce();
    fireEvent.click(queryByAltText(appointment, "Delete"));
    
    fireEvent.click(queryByText(appointment, "Confirm")); //confirm the delete action

    

    await waitForElement(() => getAllByText(appointment, "Error"));
    expect(getAllByText(appointment, "Error")[0]).toBeInTheDocument()

  });
});
