let travelData = null;

fetch('travel_recommendation_api.json')
  .then(response => response.json())
  .then(data => {
    travelData = data;
    console.log('Data loaded successfully');
  })
  .catch(error => console.error('Error loading data:', error));

document.addEventListener('DOMContentLoaded', function() {
  
  document.getElementById('searchBtn').onclick = function() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase().trim();
    
    if (!searchTerm) {
      alert('Please enter a search term');
      return;
    }
    
    if (!travelData) {
      alert('Data is loading, please wait and try again');
      return;
    }
    
    const results = [];
    const term = searchTerm.replace(/es$/i, '').replace(/s$/i, '');
    
    if (term.includes('beach')) {
      results.push(...travelData.beaches);
    }
    
    if (term.includes('temple')) {
      results.push(...travelData.temples);
    }
    
    if (term.includes('countr') || term.includes('cit')) {
      travelData.countries.forEach(country => {
        country.cities.forEach(city => results.push(city));
      });
    }
    
    showResults(results);
  };
  
  document.getElementById('resetBtn').onclick = function() {
    document.getElementById('searchBar').value = '';
    document.getElementById('results').innerHTML = '';
  };
  
});

function showResults(results) {
  const resultsDiv = document.getElementById('results');
  console.log('Showing results:', results.length, 'items');
  console.log('Results div found:', resultsDiv);
  
  if (results.length === 0) {
    resultsDiv.innerHTML = '<p style="text-align:center;color:white;padding:20px;">No results found. Try searching for: beach, temple, or country</p>';
    return;
  }
  
  let html = '';
  results.forEach(item => {
    const localTime = getLocalTime(item.name);
    html += `
      <div class="result-card">
        <img src="${item.imageUrl}" alt="${item.name}">
        <div>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <p style="color:#007bff;font-weight:bold;margin-top:10px;">Local Time: ${localTime}</p>
        </div>
      </div>
    `;
  });
  
  resultsDiv.innerHTML = html;
  console.log('Results HTML set');
  resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function getLocalTime(locationName) {
  const timeZones = {
    'Sydney, Australia': 'Australia/Sydney',
    'Melbourne, Australia': 'Australia/Melbourne',
    'Tokyo, Japan': 'Asia/Tokyo',
    'Kyoto, Japan': 'Asia/Tokyo',
    'Rio de Janeiro, Brazil': 'America/Sao_Paulo',
    'São Paulo, Brazil': 'America/Sao_Paulo',
    'Angkor Wat, Cambodia': 'Asia/Phnom_Penh',
    'Taj Mahal, India': 'Asia/Kolkata',
    'Bora Bora, French Polynesia': 'Pacific/Tahiti',
    'Copacabana Beach, Brazil': 'America/Sao_Paulo'
  };
  
  const timeZone = timeZones[locationName] || 'UTC';
  const options = { timeZone: timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return new Date().toLocaleTimeString('en-US', options);
}
