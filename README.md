# IT3040 - Assignment 01: Test Automation

This project contains the automation test suite for the **Singlish to Sinhala** translation feature on `swifttranslator.com`, developed using **Playwright**.

## Student Details
* **Name:** Kavindu
* **Registration Number:** IT23833098
* **Subject:** IT3040

## Project Overview
The automation script verifies the functionality of the translator with **35 Test Cases**:
* **25 Positive Cases** (PASS) - Verifies correct translation and UI updates.
* **10 Negative Cases** (FAIL) - Verifies system behavior on invalid inputs.

## Key Features
* **Excel Report Generation:** Automatically generates a detailed Excel report matching the assignment template.
* **Auto-Retry Logic:** Includes robustness logic to reload the page if the output gets stuck due to network lag.
* **Real-time UI Testing:** Verifies the real-time conversion feature.

## Prerequisites
* Node.js installed.
* VS Code (Recommended).

## How to Run

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Generate Test Data (Input Excel):**
    ```bash
    node generate_excel.js
    ```

3.  **Run the Automation Script:**
    ```bash
    npx playwright test tests/assignment.spec.ts --headed
    ```

## Output
After the execution is complete, a formatted Excel file named **`IT3040_Assignment1_Results.xlsx`** will be generated in the project root folder.
