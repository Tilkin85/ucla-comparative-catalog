// Main JavaScript file

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
    
    // Add event listeners
    addEventListeners();
});

/**
 * Initialize the application
 */
function initApp() {
    // Load and process data
    /**
 * Initialize the application
 */
function initApp() {
    // Load and process data
    loadData()
        .then(data => {
            // Store data in window object for other components to use
            window.appData = data;
            
            // Update overview statistics
            updateOverviewStats(data);
            
            // Initialize geographic distribution
            initGeographicDistribution(data);
            
            // Initialize taxonomic distribution
            initTaxonomicDistribution(data);
            
            // Add fallback to simple charts if React visualization fails
            try {
              // Create simple charts for the overview section
              createSimpleOverviewCharts(data);
              
              // Add event handlers for tab navigation
              document.querySelectorAll('nav a').forEach(link => {
                link.addEventListener('click', function(e) {
                  const viewId = this.getAttribute('data-view');
                  if (viewId === 'geographic') {
                    createSimpleGeographicView(data);
                  } else if (viewId === 'taxonomic') {
                    createSimpleTaxonomicView(data);
                  }
                });
              });
            } catch (error) {
              console.error('Error initializing simple charts:', error);
            }
        })
        .catch(error => {
            console.error('Error initializing app:', error);
            alert('Error loading data. Please check the console for details.');
        });
}

/**
 * Add event listeners for navigation and other interactions
 */
function addEventListeners() {
    // Navigation links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show the correct view
            const viewId = this.getAttribute('data-view');
            showView(viewId);
        });
    });
    
    // Database update form
    const updateForm = document.getElementById('update-form');
    if (updateForm) {
        updateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateDatabase();
        });
    }
}

/**
 * Load data from CSV file
 * @returns {Promise} Promise that resolves with the parsed data
 */
function loadData() {
    return new Promise((resolve, reject) => {
        // Check if we have data in localStorage first (for updates)
        const cachedData = localStorage.getItem('uclaSpecimenData');
        if (cachedData) {
            try {
                const data = JSON.parse(cachedData);
                // Check if data has an expiry time and it's not expired
                if (data.expiry && data.expiry > Date.now()) {
                    console.log('Using cached data');
                    resolve(data.specimens);
                    return;
                } else {
                    // Data expired, remove it
                    localStorage.removeItem('uclaSpecimenData');
                }
            } catch (e) {
                console.error('Error parsing cached data:', e);
                localStorage.removeItem('uclaSpecimenData');
            }
        }
        
        // Fetch data from CSV file
        Papa.parse('./data/UCLA Comparative Catalog updated locality info.xlsx  Combined colls 5 26 23.csv', {
            download: true,
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: function(results) {
                if (results.errors.length > 0) {
                    console.warn('CSV parsing had errors:', results.errors);
                }
                
                // Cache the data in localStorage for future use
                const cacheData = {
                    specimens: results.data,
                    expiry: Date.now() + (24 * 60 * 60 * 1000) // Expires in 24 hours
                };
                localStorage.setItem('uclaSpecimenData', JSON.stringify(cacheData));
                
                resolve(results.data);
            },
            error: function(error) {
                reject(error);
            }
        });
    });
}

/**
 * Update overview statistics based on data
 * @param {Array} data - The specimen data
 */
function updateOverviewStats(data) {
    // Total specimens
    document.getElementById('total-specimens').textContent = data.length;
    
    // Count unique countries
    const countries = new Set();
    data.forEach(row => {
        if (row.Country && typeof row.Country === 'string' && row.Country.trim() !== '') {
            countries.add(row.Country.trim());
        }
    });
    document.getElementById('countries-count').textContent = countries.size;
    
    // Count unique taxonomic classes
    const classes = new Set();
    data.forEach(row => {
        if (row.Class && row.Class !== 'Class' && row.Class !== 'Coll. #') {
            // Map numeric class codes to taxonomic names if needed
            const classMapping = {
                '1': 'Chondrichthyes', // Cartilaginous fish
                '2': 'Actinopterygii', // Ray-finned fish
                '3': 'Amphibia',       // Amphibians
                '4': 'Reptilia',       // Reptiles
                '5': 'Aves',           // Birds
                '6': 'Mammalia'        // Mammals
            };
            
            const className = classMapping[row.Class] || row.Class;
            classes.add(className);
        }
    });
    document.getElementById('classes-count').textContent = classes.size;
    
    // Set last updated date
    const lastUpdated = localStorage.getItem('lastDataUpdate') || new Date().toLocaleString();
    document.getElementById('last-updated').textContent = lastUpdated;
    
    // Initialize overview charts
    initOverviewCharts(data);
}

/**
 * Initialize overview charts with highlights
 * @param {Array} data - The specimen data
 */
function initOverviewCharts(data) {
    // Geographic highlight chart (top 5 countries)
    initGeoHighlightChart(data);
    
    // Taxonomic highlight chart (class distribution)
    initTaxHighlightChart(data);
}

/**
 * Initialize geographic highlight chart
 * @param {Array} data - The specimen data
 */
function initGeoHighlightChart(data) {
    const geoChart = document.getElementById('geo-highlight-chart');
    
    // Count specimens by country
    const countryCounts = {};
    data.forEach(row => {
        if (row.Country && row.Country.trim() !== '' && 
            row.Country !== 'Country' && row.Country !== 'Species') {
            const country = row.Country.trim();
            countryCounts[country] = (countryCounts[country] || 0) + 1;
        }
    });
    
    // Convert to array and sort
    const countryArray = Object.entries(countryCounts).map(([country, count]) => ({
        country,
        count
    }));
    
    countryArray.sort((a, b) => b.count - a.count);
    
    // Take top 5
    const top5Countries = countryArray.slice(0, 5);
    
    // Create simple bar chart for now (will be replaced with React component)
    let html = '<div class="simple-chart">';
    top5Countries.forEach(item => {
        const percentage = Math.round((item.count / data.length) * 100);
        html += `
            <div class="chart-item">
                <div class="chart-label">${item.country}</div>
                <div class="chart-bar">
                    <div class="chart-bar-fill" style="width: ${percentage}%; background-color: #3498db;"></div>
                </div>
                <div class="chart-value">${item.count} (${percentage}%)</div>
            </div>
        `;
    });
    html += '</div>';
    
    geoChart.innerHTML = html;
}

/**
 * Initialize taxonomic highlight chart
 * @param {Array} data - The specimen data
 */
function initTaxHighlightChart(data) {
    const taxChart = document.getElementById('tax-highlight-chart');
    
    // Process Class data
    const classCounts = {};
    data.forEach(row => {
        let className = row.Class;
        if (className !== null && className !== undefined) {
            className = String(className).trim();
            if (className !== '' && className !== 'Class' && className !== 'Coll. #') {
                // Map numeric class codes to taxonomic names
                const classMapping = {
                    '1': 'Chondrichthyes', // Cartilaginous fish
                    '2': 'Actinopterygii', // Ray-finned fish
                    '3': 'Amphibia',       // Amphibians
                    '4': 'Reptilia',       // Reptiles
                    '5': 'Aves',           // Birds
                    '6': 'Mammalia'        // Mammals
                };
                
                const mappedName = classMapping[className] || className;
                classCounts[mappedName] = (classCounts[mappedName] || 0) + 1;
            }
        }
    });
    
    // Convert to array and sort
    const classArray = Object.entries(classCounts).map(([name, count]) => ({
        name,
        count
    }));
    
    classArray.sort((a, b) => b.count - a.count);
    
    // Create simple bar chart for now (will be replaced with React component)
    let html = '<div class="simple-chart">';
    classArray.forEach(item => {
        const percentage = Math.round((item.count / data.length) * 100);
        html += `
            <div class="chart-item">
                <div class="chart-label">${item.name}</div>
                <div class="chart-bar">
                    <div class="chart-bar-fill" style="width: ${percentage}%; background-color: #2ecc71;"></div>
                </div>
                <div class="chart-value">${item.count} (${percentage}%)</div>
            </div>
        `;
    });
    html += '</div>';
    
    taxChart.innerHTML = html;
}

/**
 * Show the selected view and hide others
 * @param {string} viewId - The ID of the view to show
 */
function showView(viewId) {
    // Hide all views
    const views = document.querySelectorAll('.view');
    views.forEach(view => {
        view.classList.remove('active');
    });
    
    // Show selected view
    const selectedView = document.getElementById(viewId);
    if (selectedView) {
        selectedView.classList.add('active');
    }
}

/**
 * Update the database with new CSV file
 */
function updateDatabase() {
    const fileInput = document.getElementById('csv-file');
    const statusDiv = document.getElementById('update-status');
    
    if (!fileInput.files || fileInput.files.length === 0) {
        statusDiv.textContent = 'Please select a CSV file to upload.';
        statusDiv.className = 'error';
        statusDiv.style.display = 'block';
        return;
    }
    
    const file = fileInput.files[0];
    
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        statusDiv.textContent = 'Please upload a valid CSV file.';
        statusDiv.className = 'error';
        statusDiv.style.display = 'block';
        return;
    }
    
    // Show loading status
    statusDiv.textContent = 'Processing file...';
    statusDiv.className = '';
    statusDiv.style.display = 'block';
    
    // Parse the CSV file
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: function(results) {
            if (results.errors.length > 0) {
                statusDiv.textContent = 'Error parsing CSV: ' + results.errors[0].message;
                statusDiv.className = 'error';
                return;
            }
            
            // Validate the data structure
            if (!validateCsvStructure(results.data)) {
                statusDiv.textContent = 'CSV structure is invalid. Please make sure it has the required columns.';
                statusDiv.className = 'error';
                return;
            }
            
            // Store the data
            const cacheData = {
                specimens: results.data,
                expiry: Date.now() + (24 * 60 * 60 * 1000) // Expires in 24 hours
            };
            localStorage.setItem('uclaSpecimenData', JSON.stringify(cacheData));
            localStorage.setItem('lastDataUpdate', new Date().toLocaleString());
            
            // Update status
            statusDiv.textContent = 'Database updated successfully! Refreshing data...';
            statusDiv.className = 'success';
            
            // Refresh the application after a short delay
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        },
        error: function(error) {
            statusDiv.textContent = 'Error processing file: ' + error;
            statusDiv.className = 'error';
        }
    });
}

/**
 * Validate the CSV structure to ensure it has the required columns
 * @param {Array} data - The parsed CSV data
 * @returns {boolean} - Whether the data structure is valid
 */
function validateCsvStructure(data) {
    if (!data || data.length === 0) {
        return false;
    }
    
    // Check for required columns
    const requiredColumns = ['Country', 'Class', 'Order', 'Family'];
    const firstRow = data[0];
    
    return requiredColumns.every(column => {
        return Object.prototype.hasOwnProperty.call(firstRow, column);
    });
}
