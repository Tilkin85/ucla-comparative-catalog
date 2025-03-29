// Database Updater JavaScript

/**
 * Handle the updating of the database through file upload
 */
document.addEventListener('DOMContentLoaded', function() {
    const updateForm = document.getElementById('update-form');
    if (updateForm) {
        updateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateDatabase();
        });
    }
});

/**
 * Update the database with new CSV file
 */
function updateDatabase() {
    const fileInput = document.getElementById('csv-file');
    const statusDiv = document.getElementById('update-status');
    
    if (!fileInput.files || fileInput.files.length === 0) {
        showUpdateStatus('Please select a CSV file to upload.', 'error');
        return;
    }
    
    const file = fileInput.files[0];
    
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        showUpdateStatus('Please upload a valid CSV file.', 'error');
        return;
    }
    
    // Show loading status
    showUpdateStatus('Processing file...', '');
    
    // Parse the CSV file
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: function(results) {
            if (results.errors.length > 0) {
                showUpdateStatus('Error parsing CSV: ' + results.errors[0].message, 'error');
                return;
            }
            
            // Validate the data structure
            if (!validateCsvStructure(results.data)) {
                showUpdateStatus('CSV structure is invalid. Please make sure it has the required columns.', 'error');
                return;
            }
            
            // Store the data
            storeData(results.data);
            
            // Also save the file to the server if we're in a server environment
            // This would require server-side code
            // For a static GitHub Pages deployment, we'll just use localStorage
            
            // Update status
            showUpdateStatus('Database updated successfully! Refreshing data...', 'success');
            
            // Create a downloadable version of the file
            createDownloadableFile(file);
            
            // Refresh the application after a short delay
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        },
        error: function(error) {
            showUpdateStatus('Error processing file: ' + error, 'error');
        }
    });
}

/**
 * Store the parsed data in localStorage
 * @param {Array} data - The parsed CSV data
 */
function storeData(data) {
    // Store the data in localStorage
    const cacheData = {
        specimens: data,
        expiry: Date.now() + (365 * 24 * 60 * 60 * 1000) // Expires in 1 year
    };
    localStorage.setItem('uclaSpecimenData', JSON.stringify(cacheData));
    localStorage.setItem('lastDataUpdate', new Date().toLocaleString());
}

/**
 * Create a downloadable version of the file
 * @param {File} file - The uploaded file
 */
function createDownloadableFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        // Create a downloadable link
        const blob = new Blob([e.target.result], {type: 'text/csv'});
        const url = URL.createObjectURL(blob);
        
        // Update the download link in the instructions
        const downloadLink = document.querySelector('.instructions a');
        if (downloadLink) {
            downloadLink.href = url;
            downloadLink.download = 'current-database.csv';
        }
    };
    reader.readAsText(file);
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

/**
 * Show update status message
 * @param {string} message - The message to display
 * @param {string} type - The type of message (success, error, or empty for info)
 */
function showUpdateStatus(message, type) {
    const statusDiv = document.getElementById('update-status');
    if (statusDiv) {
        statusDiv.textContent = message;
        statusDiv.className = type;
        statusDiv.style.display = 'block';
    }
}