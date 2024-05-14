// After install the supabase-js module
import { createClient } from
'https://esm.sh/@supabase/supabase-js@2';
// Create a single supabase client for interacting with your database
const supabaseUrl = 'https://zkeqajgzydydzlxruujq.supabase.co'; // Replace with your project's URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZXFhamd6eWR5ZHpseHJ1dWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1MzczNDgsImV4cCI6MjAzMTExMzM0OH0.M7f-1vQvuNBcBUk4sz6ldNOhXd4DzJYDfHpeFBH01tU'; // Replace with your project's anon key
const supabase = createClient(supabaseUrl, supabaseKey);


document.addEventListener('DOMContentLoaded', () => {
    const peopleForm = document.getElementById('peopleSearchForm');
    const vehicleForm = document.getElementById('vehicleSearchForm');
    const addVehicleForm = document.getElementById('addVehicleForm'); // Ensure this ID matches your form


    if (peopleForm){
        peopleForm.addEventListener('submit', async (event) => {
             event.preventDefault();
             await searchPeople();
        });
    }

    if(vehicleForm){
        vehicleForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            await searchVehicle();
         });
    }

    if(addVehicleForm){
        addVehicleForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            await addVehicle();
        });
    }

});

async function searchPeople() {
    const name = document.getElementById('name').value.trim();
    const license = document.getElementById('license').value.trim();
    const resultsContainer = document.getElementById('results');
    const messageDiv = document.getElementById('message');

    // Validate input
    if ((!name && !license) || (name && license)) {
        messageDiv.textContent = 'Error: Please fill exactly one field.';
        resultsContainer.innerHTML = '';
        return;
    }

    const queryField = name ? 'Name' : 'LicenseNumber';
    const queryValue = name || license;

    const { data, error } = await supabase
        .from('people')
        .select('*')
        .ilike(queryField, `%${queryValue}%`);

    if (error) {
        messageDiv.textContent = 'Error: ' + error.message;
        resultsContainer.innerHTML = '';
        return;
    }

    if (data.length === 0) {
        messageDiv.textContent = 'No result found';
        resultsContainer.innerHTML = '';
    } else {
        messageDiv.textContent = 'Search successful';
        resultsContainer.innerHTML = data.map(person =>
            `<div>${person.Name} - ${person.Address}, DOB: ${person.DOB}, License: ${person.LicenseNumber}, Expiry: ${person.ExpiryDate}</div>`
        ).join('');
    }
}

async function searchVehicle() {
    const rego = document.getElementById('rego').value.trim();
    const resultsContainer = document.getElementById('results');
    const messageDiv = document.getElementById('message');

    if (!rego) {
        messageDiv.textContent = 'Error: Registration number field is empty';
        resultsContainer.innerHTML = '';
        return;
    }

    const { data, error } = await supabase
        .from('vehicles')
        .select(`
            VehicleID,
            Make,
            Model,
            Colour,
            OwnerID,
            people:OwnerID (Name, LicenseNumber)
        `) // This join operation fetches the owner's name and license number using the foreign key relationship.
        .eq('VehicleID', rego)
        .single();

    if (error) {
        messageDiv.textContent = 'Error: ' + error.message;
        resultsContainer.innerHTML = '';
        return;
    }

    if (!data) {
        messageDiv.textContent = 'No result found';
        resultsContainer.innerHTML = '';
    } else {
        messageDiv.textContent = 'Search successful';
        const ownerInfo = data.people || { Name: 'Unknown', LicenseNumber: 'Unknown' };
        resultsContainer.innerHTML = `
            <div>
                <p>Make: ${data.Make}</p>
                <p>Model: ${data.Model}</p>
                <p>Colour: ${data.Colour}</p>
                <p>Owner: ${ownerInfo.Name}</p>
                <p>License Number: ${ownerInfo.LicenseNumber}</p>
            </div>
        `;
    }
}

async function addVehicle() {
    const vehicleIDElement = document.getElementById('vehicleID');
    if (!vehicleIDElement) {
        console.error('Vehicle ID input not found!');
        return;
    }
    const vehicleID = document.getElementById('vehicleID').value.trim();
    const make = document.getElementById('make').value.trim();
    const model = document.getElementById('model').value.trim();
    const colour = document.getElementById('colour').value.trim();
    const ownerID = document.getElementById('ownerID').value.trim();
    const resultsContainer = document.getElementById('results');
    const messageDiv = document.getElementById('message');

    if (!vehicleID || !make || !model || !colour) {
        messageDiv.textContent = 'Error: All fields must be filled out.';
        resultsContainer.innerHTML = '';
        return;
    }

    const { data, error } = await supabase
        .from('vehicles')
        .insert([{
            VehicleID: vehicleID,
            Make: make,
            Model: model,
            Colour: colour,
            OwnerID: ownerID || null // Allows null if no ownerID is provided
        }]);

    if (error) {
        messageDiv.textContent = 'Error adding vehicle: ' + error.message;
        resultsContainer.innerHTML = '';
    } else {
        messageDiv.textContent = 'Vehicle added successfully.';
        resultsContainer.innerHTML = `
            <div>
                <p>Vehicle ID: ${data[0].VehicleID}</p>
                <p>Make: ${data[0].Make}</p>
                <p>Model: ${data[0].Model}</p>
                <p>Colour: ${data[0].Colour}</p>
                <p>Owner ID: ${data[0].OwnerID || "No owner assigned"}</p>
            </div>
        `;
    }
}