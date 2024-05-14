// After install the supabase-js module
import { createClient } from
'https://esm.sh/@supabase/supabase-js@2';
// Create a single supabase client for interacting with your database
const supabaseUrl = 'https://zkeqajgzydydzlxruujq.supabase.co'; // Replace with your project's URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZXFhamd6eWR5ZHpseHJ1dWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1MzczNDgsImV4cCI6MjAzMTExMzM0OH0.M7f-1vQvuNBcBUk4sz6ldNOhXd4DzJYDfHpeFBH01tU'; // Replace with your project's anon key
const supabase = createClient(supabaseUrl, supabaseKey);


document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('searchForm');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        console.log(document.getElementById('searchQuery'));
        const query = document.getElementById('searchQuery').value;
        await searchPeople(query);
    });
});

async function searchPeople(query) {
    const { data, error } = await supabase
        .from('people')
        .select('PersonID, Name, Address, DOB, LicenseNumber, ExpiryDate')
        .or(`Name.ilike.%${query}%,LicenseNumber.ilike.%${query}%`);

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
            `<li>${person.Name} - License: ${person.LicenseNumber}, Address: ${person.Address}, DOB: ${person.DOB}, Expiry: ${person.ExpiryDate}</li>`
        ).join('');
        resultsContainer.innerHTML = `<ul>${resultList}</ul>`;
    }
}