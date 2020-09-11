
describe("Appointments", () => {

  beforeEach(() => {
    cy.request("GET", "http://localhost:8001/api/debug/reset")
    cy.visit("/"); // visit the root of the webserver.
    cy.contains('Monday'); //confirms that the DOM contains Monday
  });
  
  it("should book an interview", () => {

    //command that clicks on the add button for the empty appointment
    cy.get("[alt=Add]")
      .first()
      .click();

    //command that adds the student name in the input field
    cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");  

    //command that selects interviewer with name "Sylvia Palmer"
    cy.get("[alt='Sylvia Palmer']").click();

    //command that clicks the save button
    cy.contains("Save").click();

    // shows name after save
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");

  });

  it("show edit an interview", () => {
    //command that clicks on the edit button for an existing appointment
    cy.get("[alt=Edit]")
      .first()
      .click({ force: true });


    //command that adds the student name in the input field
    cy.get("[data-testid=student-name-input]")
      .clear()
      .type("Ryan");  

    //command that selects interviewer with name "Tori Malcolm" 
    cy.get("[alt='Tori Malcolm']").click();

    //command that clicks the save button
    cy.contains("Save").click();

    // shows name after save
    cy.contains(".appointment__card--show", "Ryan");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  });

  it("should cancel the interview", () => {
    cy.get("[alt=Delete]")
      .click({ force: true });

    cy.contains("Confirm").click();

    cy.contains("Deleting").should("exist");
    cy.contains("Deleting").should("not.exist");

    cy.contains(".appointment__card--show", "Archie Cohen")
      .should("not.exist");

  })

});