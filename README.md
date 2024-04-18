# MaidsCcApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### The assessment

Project Attachments - Frontend
Angular Quiz: Building a Dynamic User
Dashboard

Goal:
Demonstrate proficiency in Angular (7+) by creating an interactive user dashboard while
employing advanced features like state management frameworks, directives, and observables.
Emphasize proper styling, animations, and caching techniques. Usage of UI libraries like
Angular Material is permitted.

Task Specifications:

Project Setup:
● Create a new Angular 7+ project using Angular CLI as the foundation.

Page Layout:
● Develop a page layout comprising a header and a horizontally centered, paginated users list.

Data Retrieval:
● Utilize the HTTP endpoints:
● Fetch user card data (including avatar image, first_name, last_name, and id) from https://reqres.in/api/users?page={page} for pagination.
● Fetch details for a single user via https://reqres.in/api/users/{id}.

Navigation:
● Enable click functionality on the user cards to navigate to a new page displaying
detailed information about the selected user.

Search Functionality:
● Implement an instant search field within the header to search for users by ID without requiring a separate button. Display search results and allow navigation
to the user details page if the user exists.

User Details Page:
● Include a back button on each individual user's page to navigate back to the main user list.

Caching Implementation:
● Introduce caching mechanisms to avoid redundant HTTP requests, optimizing the application's performance.

User Experience Enhancements:
● Display a loading bar to indicate pending network requests, ensuring a smoother
user experience during data retrieval.

Additional Considerations:
● Employ state management frameworks like NgRx or Redux for efficient state handling.
● Implement custom directives for improved UI interactions or functionalities.
● Utilize observables from RxJS to manage asynchronous operations.
● Apply proper styling and animations to enhance the user interface.
● Ensure a well-documented and structured project codebase.
Submission Requirements:
● Share the project via a Github/Gitlab link or provide a zipped project file that includes all
necessary files.

This Angular project aims to showcase your proficiency in utilizing advanced Angular features,
best practices, and creating a dynamic user interface while focusing on clarity, performance, and
usability.
