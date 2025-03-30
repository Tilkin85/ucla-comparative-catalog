// Simple charts for overview
function createSimpleOverviewCharts(data) {
  // Generate geographic highlights
  const geoChart = document.getElementById('geo-highlight-chart');
  if (geoChart) {
    // Count specimens by country
    const countries = {};
    data.forEach(row => {
      if (row.Country && row.Country.trim()) {
        countries[row.Country.trim()] = (countries[row.Country.trim()] || 0) + 1;
      }
    });
    
    // Convert to array and sort
    const countryData = Object.entries(countries)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Top 5
    
    let html = '<table class="simple-table"><tr><th>Country</th><th>Count</th></tr>';
    countryData.forEach(([country, count]) => {
      html += `<tr><td>${country}</td><td>${count}</td></tr>`;
    });
    html += '</table>';
    
    geoChart.innerHTML = html;
  }
  
  // Generate taxonomic highlights
  const taxChart = document.getElementById('tax-highlight-chart');
  if (taxChart) {
    // Count specimens by class
    const classes = {};
    data.forEach(row => {
      if (row.Class && row.Class !== 'Class' && row.Class !== 'Coll. #') {
        // Map numeric codes
        let className = String(row.Class).trim();
        const classMap = {
          '1': 'Chondrichthyes',
          '2': 'Actinopterygii',
          '3': 'Amphibia',
          '4': 'Reptilia',
          '5': 'Aves',
          '6': 'Mammalia'
        };
        
        className = classMap[className] || className;
        classes[className] = (classes[className] || 0) + 1;
      }
    });
    
    // Convert to array and sort
    const classData = Object.entries(classes)
      .sort((a, b) => b[1] - a[1]);
    
    let html = '<table class="simple-table"><tr><th>Class</th><th>Count</th></tr>';
    classData.forEach(([className, count]) => {
      html += `<tr><td>${className}</td><td>${count}</td></tr>`;
    });
    html += '</table>';
    
    taxChart.innerHTML = html;
  }
}

// Replace the geographic distribution visualization
function createSimpleGeographicView(data) {
  const container = document.getElementById('geographic-distribution');
  if (!container) return;
  
  // Count specimens by country
  const countries = {};
  let total = 0;
  let missing = 0;
  
  data.forEach(row => {
    if (row.Country && row.Country.trim() !== '') {
      countries[row.Country.trim()] = (countries[row.Country.trim()] || 0) + 1;
      total++;
    } else {
      missing++;
      total++;
    }
  });
  
  // Convert to array and sort
  const countryData = Object.entries(countries)
    .sort((a, b) => b[1] - a[1]);
  
  // Create the HTML
  let html = `
    <div class="card">
      <h3>Geographic Distribution Summary</h3>
      <p>Total specimens: ${total}</p>
      <p>Missing location data: ${missing} (${((missing/total)*100).toFixed(1)}%)</p>
      
      <h4>Top 10 Countries:</h4>
      <table class="simple-table">
        <tr>
          <th>Country</th>
          <th>Count</th>
          <th>Percentage</th>
        </tr>
  `;
  
  countryData.slice(0, 10).forEach(([country, count]) => {
    const percentage = ((count/total)*100).toFixed(1);
    html += `
      <tr>
        <td>${country}</td>
        <td>${count}</td>
        <td>${percentage}%</td>
      </tr>
    `;
  });
  
  html += `
      </table>
    </div>
  `;
  
  container.innerHTML = html;
}

// Replace the taxonomic distribution visualization
function createSimpleTaxonomicView(data) {
  const container = document.getElementById('taxonomic-distribution');
  if (!container) return;
  
  // Process Class data
  const classCounts = {};
  const orderCounts = {};
  const familyCounts = {};
  
  data.forEach(row => {
    // Process Class
    if (row.Class && row.Class !== 'Class' && row.Class !== 'Coll. #') {
      let className = String(row.Class).trim();
      const classMap = {
        '1': 'Chondrichthyes',
        '2': 'Actinopterygii',
        '3': 'Amphibia',
        '4': 'Reptilia',
        '5': 'Aves',
        '6': 'Mammalia'
      };
      
      className = classMap[className] || className;
      classCounts[className] = (classCounts[className] || 0) + 1;
    }
    
    // Process Order
    if (row.Order && row.Order !== 'Order') {
      orderCounts[row.Order] = (orderCounts[row.Order] || 0) + 1;
    }
    
    // Process Family
    if (row.Family && row.Family !== 'Family') {
      familyCounts[row.Family] = (familyCounts[row.Family] || 0) + 1;
    }
  });
  
  // Convert to arrays and sort
  const classData = Object.entries(classCounts)
    .sort((a, b) => b[1] - a[1]);
  
  const orderData = Object.entries(orderCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
    
  const familyData = Object.entries(familyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  // Create HTML
  let html = `
    <div class="taxonomic-container">
      <div class="card">
        <h3>Class Distribution</h3>
        <table class="simple-table">
          <tr>
            <th>Class</th>
            <th>Count</th>
          </tr>
  `;
  
  classData.forEach(([className, count]) => {
    html += `
      <tr>
        <td>${className}</td>
        <td>${count}</td>
      </tr>
    `;
  });
  
  html += `
        </table>
      </div>
      
      <div class="card">
        <h3>Top 10 Orders</h3>
        <table class="simple-table">
          <tr>
            <th>Order</th>
            <th>Count</th>
          </tr>
  `;
  
  orderData.forEach(([orderName, count]) => {
    html += `
      <tr>
        <td>${orderName}</td>
        <td>${count}</td>
      </tr>
    `;
  });
  
  html += `
        </table>
      </div>
      
      <div class="card">
        <h3>Top 10 Families</h3>
        <table class="simple-table">
          <tr>
            <th>Family</th>
            <th>Count</th>
          </tr>
  `;
  
  familyData.forEach(([familyName, count]) => {
    html += `
      <tr>
        <td>${familyName}</td>
        <td>${count}</td>
      </tr>
    `;
  });
  
  html += `
        </table>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}