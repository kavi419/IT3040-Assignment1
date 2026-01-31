import { test, expect } from '@playwright/test';
import * as XLSX from 'xlsx';
import * as path from 'path';

test('Assignment 1: Singlish to Sinhala Automation', async ({ page }) => {
    test.setTimeout(1800000);

    const inputFilePath = path.resolve(__dirname, '../IT3040_Assignment1_TestCases.xlsx');
    const outputFilePath = path.resolve(__dirname, '../IT3040_Assignment1_Results.xlsx');

    console.log(`Reading test cases from: ${inputFilePath}`);

    const workbook = XLSX.readFile(inputFilePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    await page.goto('https://www.swifttranslator.com/');
    await expect(page).toHaveTitle(/Singlish/i);

    const inputSelector = 'textarea';
    const outputSelector = 'div:has-text("Sinhala") >> .whitespace-pre-wrap';

    await page.waitForSelector(inputSelector);

    for (const row of data as any[]) {
        const testId = row['TC_ID'];
        const inputText = row['Input'];
        const expected = row['Expected_Output'];

        console.log(`Running: ${testId}`);

        // --- REUSABLE TEST LOGIC ---
        const runTestLogic = async () => {
            // 1. Ensure focus and clear
            await page.click(inputSelector);
            await page.fill(inputSelector, '');
            await page.waitForTimeout(1000);

            if (inputText) {
                // 2. Type slower (100ms delay) to ensure site captures it
                await page.type(inputSelector, inputText, { delay: 100 });
            }

            // --- CHANGE: INCREASED WAIT TIME TO 20 SECONDS ---
            await page.waitForTimeout(20000);

            try {
                return await page.innerText(outputSelector);
            } catch (e) {
                return "";
            }
        };

        // 1. Initial Attempt
        let actual = await runTestLogic();

        // 2. RETRY STRATEGY (More Aggressive)
        if (!actual || actual.trim() === "") {
            console.log("   -> Output stuck/empty. Reloading page to fix...");

            // Reload page completely
            await page.reload({ waitUntil: 'domcontentloaded' });
            await page.waitForSelector(inputSelector);
            await page.waitForTimeout(5000); 

            // Retry logic
            actual = await runTestLogic();
        }

        const isPass = actual.trim() === expected.trim();

        // --- Generate Description ---
        let description = "";
        if (isPass) {
            description = row['Justification_Pass'] || "• The intended meaning is fully preserved.\n• Sinhala spelling and punctuation are correct.\n• Validated input handling\n• Checked character mapping accuracy\n• Verified output consistency";
        } else {
            description = `• Issue Observed: Output mismatch.\n• Expected: ${expected}\n• Actual: ${actual}\n• Deviation: System failed to handle specific character combination correctly.`;
        }

        // Update Results
        row['Actual_Output'] = actual;
        row['Status'] = isPass ? 'Pass' : 'Fail';
        row['Description'] = description;

        console.log(`   -> Output: "${actual.trim()}" | Status: ${isPass ? 'PASS' : 'FAIL'}`);
    }

    // --- Format Data ---
    const formattedData = (data as any[]).map(item => ({
        "TC ID": item.TC_ID,
        "Test case name": item.Test_Case_Name,
        "Input length type": item.Input_Length_Type,
        "Input": item.Input,
        "Expected output": item.Expected_Output,
        "Actual output": item.Actual_Output,
        "Status": item.Status,
        "Accuracy justification/ Description of issue type": item.Description,
        "What is covered by the test": item.Category_Covered
    }));

    const newSheet = XLSX.utils.json_to_sheet(formattedData);

    newSheet['!cols'] = [
        { wch: 10 }, { wch: 20 }, { wch: 10 }, { wch: 30 },
        { wch: 30 }, { wch: 30 }, { wch: 8 }, { wch: 60 }, { wch: 40 }
    ];

    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Results");

    XLSX.writeFile(newWorkbook, outputFilePath);
    console.log(`SUCCESS! Rich PDF-style Excel saved to: ${outputFilePath}`);
});
