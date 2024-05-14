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
    const addVehicleForm = document.getElementById('addVehicleForm');



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
            await checkAndAddVehicle();
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

async function checkAndAddVehicle() {
    const rego = document.getElementById('rego').value.trim();
    const make = document.getElementById('make').value.trim();
    const model = document.getElementById('model').value.trim();
    const colour = document.getElementById('colour').value.trim();
    const ownerName = document.getElementById('owner').value.trim();
    const messageDiv = document.getElementById('message');

    // Fetch all potential matching owners
    let { data: owners, error } = await supabase
        .from('people')
        .select('PersonID')
        .ilike('Name', `%${ownerName}%`);

    if (error) {
        messageDiv.textContent = `Error: ${error.message}`;
        return;
    }

    // Handle the results based on the number of matches found
    if (owners.length === 1) {
        // Exactly one owner found, proceed with adding the vehicle
        await addVehicle(rego, make, model, colour, owners[0].PersonID, messageDiv);
    } else if (owners.length > 1) {
        // Multiple owners found, handle accordingly
        messageDiv.textContent = 'Multiple owners found. Please refine your search.';
    } else {
        // No owners found, display the form to add a new owner
        document.getElementById('newOwnerForm').style.display = 'block';
        messageDiv.textContent = 'Owner not found. Please add new owner using the form below.';
    }
}

async function addVehicle(rego, make, model, colour, ownerID, messageDiv) {
    const { error } = await supabase
        .from('vehicles')
        .insert([{ VehicleID: rego, Make: make, Model: model, Colour: colour, OwnerID: ownerID }]);
    if (error) {
        messageDiv.textContent = `Error adding vehicle: ${error.message}`;
    } else {
        messageDiv.textContent = 'Vehicle added successfully';
    }
}

window.addOwner = async () => {
    const personId = document.getElementById('personid').value.trim();
    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    const dob = document.getElementById('dob').value;
    const license = document.getElementById('license').value.trim();
    const expire = document.getElementById('expire').value;
    const messageDiv = document.getElementById('message');

    const { data, error } = await supabase
        .from('people')
        .insert([{ PersonID: personId, Name: name, Address: address, DOB: dob, LicenseNumber: license, ExpiryDate: expire }]);

    if (error) {
        messageDiv.textContent = `Error adding owner: ${error.message}`;
        return;
    }

    // Assuming that the owner's ID is needed for the vehicle form, and that data includes the new owner's ID.
    if (data && data.length > 0) {
        const newOwnerId = data[0].PersonID; // Example, adjust based on actual data structure
        // Set owner ID in vehicle form if necessary
        document.getElementById('ownerId').value = newOwnerId; // Make sure this input exists in your vehicle form

        // Now submit the vehicle form
        document.getElementById('addVehicleForm').submit();
        messageDiv.textContent = 'Owner added successfully. Submitting vehicle information...';
    } else {
        messageDiv.textContent = 'Failed to add owner. No data returned.';
    }
};