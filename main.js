// After install the supabase-js module
import { createClient } from
'https://esm.sh/@supabase/supabase-js@2';
// Create a single supabase client for interacting with your database
const supabase = createClient('https://your-project-url.supabase.co', 'https://zkeqajgzydydzlxruujq.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZXFhamd6eWR5ZHpseHJ1dWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1MzczNDgsImV4cCI6MjAzMTExMzM0OH0.M7f-1vQvuNBcBUk4sz6ldNOhXd4DzJYDfHpeFBH01tU')

async function searchPeople(query) {
  query = query.trim();  // Trim whitespace

  if (!query) {
      alert('Please enter a search term.');
      return;
  }

  // Using ilike for case-insensitive partial matching
  const { data, error } = await supabase
      .from('people')
      .select('PersonID, Name, Address, DOB, LicenseNumber, ExpiryDate')
      .or(`Name.ilike.%${query}%,LicenseNumber.ilike.%${query}%`);

  if (error) {
      console.error('Error searching for people:', error);
      alert('Error searching for people: ' + error.message);
      return;
  }

  // Handle the display of search results
  const resultsContainer = document.getElementById('searchResults');
  resultsContainer.innerHTML = ''; // Clear previous results

  if (data.length === 0) {
      resultsContainer.innerHTML = '<p>No matching records found.</p>';
  } else {
      const resultList = data.map(person =>
          `<li>${person.Name} - License: ${person.LicenseNumber}, Address: ${person.Address}, DOB: ${person.DOB}, Expiry: ${person.ExpiryDate}</li>`
      ).join('');
      resultsContainer.innerHTML = `<ul>${resultList}</ul>`;
  }
}

document.getElementById('searchForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const searchQuery = document.getElementById('searchName').value || document.getElementById('searchLicense').value;
  searchPeople(searchQuery);
});