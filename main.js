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

    peopleForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value.trim();
        const license = document.getElementById('license').value.trim();

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

        const queryField = name ? 'name' : 'licenseNumber';
        const queryValue = name || license;
        const results = await searchPeople(queryField, queryValue);
        displayResults(results);
    });

    vehicleForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const rego = document.getElementById('rego').value.trim();

        if (!rego) {
            messageDiv.textContent = 'Error: Registration number field is empty';
            resultsDiv.innerHTML = '';
            return;
        }

        const results = await searchVehicle(rego);
        displayResults(results, 'vehicle');
    });
});

async function searchPeople(field, query) {
    const { data, error } = await supabase
        .from('people')
        .select('*')
        .ilike(field, `%${query}%`);

    if (error) {
        console.error('Error fetching data:', error);
        messageDiv.textContent = 'Error fetching data';
        resultsDiv.innerHTML = '';
        return [];
    }
    return data;
}

async function searchVehicle(rego) {
    const { data, error } = await supabase
        .from('vehicles')
        .select('*, people (*)') // Join to fetch owner details
        .eq('vehicleID', rego);

    if (error) {
        console.error('Error fetching data:', error);
        messageDiv.textContent = 'Error fetching data';
        resultsDiv.innerHTML = '';
        return [];
    }
    return data;
}

function displayResults(results, type = 'people') {
    resultsDiv.innerHTML = ''; // Clear previous results
    if (results.length === 0) {
        messageDiv.textContent = 'No result found';
    } else {
        results.forEach(result => {
            if (type === 'vehicle') {
                const vehicleDetails = `
                    <div>
                        <p>Make: ${result.make}</p>
                        <p>Model: ${result.model}</p>
                        <p>Colour: ${result.colour}</p>
                        <p>Owner Name: ${result.people?.name || 'Unknown'}</p>
                        <p>Owner License Number: ${result.people?.licenseNumber || 'Unknown'}</p>
                    </div>
                `;
                resultsDiv.innerHTML += vehicleDetails;
            } else {
                const personDetails = `
                    <div>
                        <p>Name: ${result.name}</p>
                        <p>Address: ${result.address}</p>
                        <p>DOB: ${result.dob}</p>
                        <p>License Number: ${result.licenseNumber}</p>
                        <p>Expiry Date: ${result.expiryDate}</p>
                    </div>
                `;
                resultsDiv.innerHTML += personDetails;
            }
        });
        messageDiv.textContent = 'Search successful';
    }
}