// After install the supabase-js module
import { createClient } from
'https://esm.sh/@supabase/supabase-js@2';
// Create a single supabase client for interacting with your database
const supabase = createClient('https://zkeqajgzydydzlxruujq.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZXFhamd6eWR5ZHpseHJ1dWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1MzczNDgsImV4cCI6MjAzMTExMzM0OH0.M7f-1vQvuNBcBUk4sz6ldNOhXd4DzJYDfHpeFBH01tU')

async function searchPeople(query) {
  // Ensure the query is not case-sensitive and allows partial matches
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .or(`name.ilike.%${query}%,license_number.ilike.%${query}%`);

  if (error) {
    console.error('Error searching for people:', error);
    return;
  }

  // Display the results or a message if no results found
  const resultsContainer = document.getElementById('searchResults');
  resultsContainer.innerHTML = ''; // Clear previous results

  if (data.length === 0) {
    resultsContainer.innerHTML = '<p>No people found.</p>';
  } else {
    const resultList = data.map(person =>
      `<li>${person.name} - License: ${person.license_number}</li>`
    ).join('');
    resultsContainer.innerHTML = `<ul>${resultList}</ul>`;
  }
}

// Add event listener to the form submission
document.getElementById('searchForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const searchQuery = document.getElementById('searchName').value || document.getElementById('searchLicense').value;
  searchPeople(searchQuery);
});