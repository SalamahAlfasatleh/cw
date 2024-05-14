// After install the supabase-js module
import { createClient } from
'https://esm.sh/@supabase/supabase-js@2';
// Create a single supabase client for interacting with your database
const supabaseUrl = 'https://zkeqajgzydydzlxruujq.supabase.co'; // Replace with your project's URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZXFhamd6eWR5ZHpseHJ1dWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1MzczNDgsImV4cCI6MjAzMTExMzM0OH0.M7f-1vQvuNBcBUk4sz6ldNOhXd4DzJYDfHpeFBH01tU'; // Replace with your project's anon key
const supabase = createClient(supabaseUrl, supabaseKey);


document.addEventListener('DOMContentLoaded', function() {
    const peopleForm = document.getElementById('searchForm');
    const vehicleForm = document.getElementById('vehicleSearchForm');
    const messageDiv = document.getElementById('message');
    const resultsDiv = document.getElementById('results');

    peopleForm.addEventListener('submit', async event => {
        event.preventDefault();
        const name = document.getElementById('name').value.trim();
        const license = document.getElementById('license').value.trim();

        // Validation for people search
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

        const query = name || license;
        await searchPeople(query);
    });

    vehicleForm.addEventListener('submit', async event => {
        event.preventDefault();
        const rego = document.getElementById('rego').value.trim();

        // Validation for vehicle search
        if (!rego) {
            messageDiv.textContent = 'Error: Registration number field is empty';
            resultsDiv.innerHTML = '';
            return;
        }

        await searchVehicle(rego);
    });
});

async function searchPeople(query) {
    const { data, error } = await supabase
        .from('people')
        .select('PersonID, Name, Address, DOB, LicenseNumber, ExpiryDate')
        .or(`Name.ilike.%${query}%, LicenseNumber.ilike.%${query}%`);

    handleResponse(data, error);
}

async function searchVehicle(rego) {
    const { data, error } = await supabase
        .from('vehicles')
        .select('VehicleID, Make, Model, Colour, people (Name, LicenseNumber)')
        .eq('VehicleID', rego)
        .single();

    handleResponse([data], error); // Wrap data in array for consistency
}

function handleResponse(data, error) {
    if (error) {
        console.error('Error:', error);
        messageDiv.textContent = `Error: ${error.message}`;
        resultsDiv.innerHTML = '';
        return;
    }

    if (!data || data.length === 0) {
        messageDiv.textContent = 'No result found';
        resultsDiv.innerHTML = '';
    } else {
        const resultsHTML = data.map(person => `<div>${person.Name} - License: ${person.LicenseNumber}, Address: ${person.Address}, DOB: ${person.DOB}, Expiry: ${person.ExpiryDate}</div>`).join('');
        resultsDiv.innerHTML = resultsHTML;
        messageDiv.textContent = 'Search successful';
    }
}