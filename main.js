// After install the supabase-js module
import { createClient } from
'https://esm.sh/@supabase/supabase-js@2';
// Create a single supabase client for interacting with your database
const supabaseUrl = 'https://zkeqajgzydydzlxruujq.supabase.co'; // Replace with your project's URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZXFhamd6eWR5ZHpseHJ1dWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1MzczNDgsImV4cCI6MjAzMTExMzM0OH0.M7f-1vQvuNBcBUk4sz6ldNOhXd4DzJYDfHpeFBH01tU'; // Replace with your project's anon key
const supabase = createClient(supabaseUrl, supabaseKey);


document.addEventListener('DOMContentLoaded', function() {
    const peopleForm = document.getElementById('peopleSearchForm');
    const vehicleForm = document.getElementById('vehicleSearchForm');
    const resultsDiv = document.getElementById('results');
    const messageDiv = document.getElementById('message');

    peopleForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value.trim();
        const license = document.getElementById('license').value.trim();

        // Validate input
        if (!name && !license) {
            messageDiv.textContent = 'Error: Both fields are empty';
            resultsDiv.innerHTML = '';
            return;
        }
        if (name && license) {
            messageDiv.textContent = 'Error: Please fill only one field';
            resultsDiv.innerHTML = '';
            return;
        }

        // Perform search (assuming searchPeople is an async function)
        searchPeople(name || license);
    });

    vehicleForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const rego = document.getElementById('rego').value.trim();

        if (!rego) {
            messageDiv.textContent = 'Error: Registration number field is empty';
            resultsDiv.innerHTML = '';
            return;
        }

        // Perform search (assuming searchVehicle is an async function)
        searchVehicle(rego);
    });
});

async function searchPeople(query) {
    // Simulated API call
    const results = await fakeApiCall(query);
    displayResults(results);
}

async function searchVehicle(rego) {
    // Simulated API call
    const results = await fakeApiCall(rego);
    displayResults(results);
}

function displayResults(results) {
    if (results.length === 0) {
        messageDiv.textContent = 'No result found';
        resultsDiv.innerHTML = '';
    } else {
        resultsDiv.innerHTML = results.map(result => `<div>${result}</div>`).join('');
        messageDiv.textContent = 'Search successful';
    }
}

async function fakeApiCall(query) {
    // Simulate fetching data
    return new Promise(resolve => setTimeout(() => resolve([query]), 1000));
}