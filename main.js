// After install the supabase-js module
import { createClient } from
'https://esm.sh/@supabase/supabase-js@2';
// Create a single supabase client for interacting with your database
const supabaseUrl = 'https://zkeqajgzydydzlxruujq.supabase.co'; // Replace with your project's URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZXFhamd6eWR5ZHpseHJ1dWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1MzczNDgsImV4cCI6MjAzMTExMzM0OH0.M7f-1vQvuNBcBUk4sz6ldNOhXd4DzJYDfHpeFBH01tU'; // Replace with your project's anon key
const supabase = createClient(supabaseUrl, supabaseKey);


document.addEventListener('DOMContentLoaded', function() {
    const peopleForm = document.getElementById('searchForm');
    const vehicleForm = document.getElementById('vehicleSearchForm'); // New ID for vehicle search form

    // Event listener for people search
    if (peopleForm) {
        peopleForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const query = document.getElementById('name').value;
            await searchPeople(query);
        });
    }
    
    // Event listener for vehicle search
    if (vehicleForm) {
        vehicleForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const rego = document.getElementById('rego').value;
            await searchVehicle(rego);
        });
    }
});

async function searchPeople(query) {
    const { data, error } = await supabase
        .from('people')
        .select('PersonID, "Name", "Address", "DOB", "LicenseNumber", "ExpiryDate"')
        .or(`"Name".ilike.%${query}%, "LicenseNumber".ilike.%${query}%`);

    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (error) {
        console.error('Error searching for people:', error);
        resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
        return;
    }

    if (data.length === 0) {
        resultsContainer.innerHTML = '<p>No matching records found.</p>';
    } else {
        const resultList = data.map(person => 
            `<div>${person["Name"]} - License: ${person["LicenseNumber"]}, Address: ${person["Address"]}, DOB: ${person["DOB"]}, Expiry: ${person["ExpiryDate"]}</div>`
        ).join('');
        resultsContainer.innerHTML = resultList;
        document.getElementById('message').textContent = 'Search successful';
    }
}

async function searchVehicle(rego) {
    const { data, error } = await supabase
        .from('vehicles')
        .select('PlateNumber, Type, Color, OwnerName, OwnerLicenseNumber')
        .eq('PlateNumber', rego);

    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (error) {
        console.error('Error searching for vehicles:', error);
        resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
        return;
    }

    if (data.length === 0) {
        resultsContainer.innerHTML = '<p>No matching vehicle found.</p>';
    } else {
        const resultList = data.map(vehicle => 
            `<div>Plate: ${vehicle.PlateNumber}, Type: ${vehicle.Type}, Color: ${vehicle.Color}, Owner: ${vehicle.OwnerName}, License: ${vehicle.OwnerLicenseNumber}</div>`
        ).join('');
        resultsContainer.innerHTML = resultList;
        document.getElementById('message').textContent = 'Search successful';
    }
}