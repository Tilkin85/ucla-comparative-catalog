// Data Processor JavaScript

/**
 * Process and clean specimen data
 * @param {Array} data - Raw specimen data
 * @returns {Array} - Processed data
 */
function processSpecimenData(data) {
    if (!data || !Array.isArray(data)) {
        console.error('Invalid data format');
        return [];
    }
    
    return data.map(row => {
        // Create a new object to avoid modifying the original
        const processedRow = { ...row };
        
        // Process country data
        if (processedRow.Country) {
            processedRow.Country = cleanCountryName(processedRow.Country);
        }
        
        // Process taxonomic data
        if (processedRow.Class) {
            processedRow.Class = processTaxonomicClass(processedRow.Class);
        }
        
        if (processedRow.Order) {
            processedRow.Order = cleanTaxonomicName(processedRow.Order);
        }
        
        if (processedRow.Family) {
            processedRow.Family = cleanTaxonomicName(processedRow.Family);
        }
        
        return processedRow;
    });
}

/**
 * Clean and standardize country names
 * @param {string} countryName - Raw country name
 * @returns {string} - Cleaned country name
 */
function cleanCountryName(countryName) {
    if (!countryName || typeof countryName !== 'string') {
        return '';
    }
    
    // Trim whitespace
    let cleaned = countryName.trim();
    
    // Skip if empty or placeholder text
    if (cleaned === '' || cleaned === 'Country' || cleaned === 'Species') {
        return '';
    }
    
    // Map common abbreviations and variants
    const countryMap = {
        'USA': 'United States',
        'U.S.A.': 'United States',
        'US': 'United States',
        'U.S.': 'United States',
        'United States of America': 'United States',
        'UK': 'United Kingdom',
        'U.K.': 'United Kingdom',
        'Great Britain': 'United Kingdom',
        // Add more mappings as needed
    };
    
    return countryMap[cleaned] || cleaned;
}

/**
 * Process taxonomic class value, including mapping numeric codes to names
 * @param {string|number} classValue - Raw class value
 * @returns {string} - Processed class name
 */
function processTaxonomicClass(classValue) {
    if (classValue === null || classValue === undefined) {
        return '';
    }
    
    // Convert to string
    const classStr = String(classValue).trim();
    
    // Skip if empty or placeholder text
    if (classStr === '' || classStr === 'Class' || classStr === 'Coll. #') {
        return '';
    }
    
    // Map numeric class codes to taxonomic names
    const classMapping = {
        '1': 'Chondrichthyes', // Cartilaginous fish
        '2': 'Actinopterygii', // Ray-finned fish
        '3': 'Amphibia',       // Amphibians
        '4': 'Reptilia',       // Reptiles
        '5': 'Aves',           // Birds
        '6': 'Mammalia'        // Mammals
    };
    
    return classMapping[classStr] || classStr;
}

/**
 * Clean and standardize taxonomic names
 * @param {string} name - Raw taxonomic name
 * @returns {string} - Cleaned taxonomic name
 */
function cleanTaxonomicName(name) {
    if (!name || typeof name !== 'string') {
        return '';
    }
    
    // Trim whitespace
    let cleaned = name.trim();
    
    // Skip if empty or placeholder text
    if (cleaned === '' || cleaned === 'Order' || cleaned === 'Family' || 
        cleaned.includes('Class') || cleaned.includes('Spec')) {
        return '';
    }
    
    // Capitalize first letter
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    
    return cleaned;
}

/**
 * Get statistics about missing data
 * @param {Array} data - Specimen data
 * @returns {Object} - Statistics about missing data
 */
function getMissingDataStats(data) {
    if (!data || !Array.isArray(data)) {
        return {};
    }
    
    const stats = {
        totalSpecimens: data.length,
        missingCountry: 0,
        missingState: 0,
        missingGeographic: 0,
        missingClass: 0,
        missingOrder: 0,
        missingFamily: 0,
        missingTaxonomic: 0
    };
    
    data.forEach(row => {
        // Geographic information
        if (!row.Country || row.Country.trim() === '') {
            stats.missingCountry++;
        }
        
        if (!row.State || row.State.trim() === '') {
            stats.missingState++;
        }
        
        if ((!row.Country || row.Country.trim() === '') && 
            (!row.State || row.State.trim() === '')) {
            stats.missingGeographic++;
        }
        
        // Taxonomic information
        if (!row.Class || row.Class === '' || row.Class === 'Class' || row.Class === 'Coll. #') {
            stats.missingClass++;
        }
        
        if (!row.Order || row.Order === '' || row.Order === 'Order') {
            stats.missingOrder++;
        }
        
        if (!row.Family || row.Family === '' || row.Family === 'Family') {
            stats.missingFamily++;
        }
        
        if ((!row.Class || row.Class === '' || row.Class === 'Class' || row.Class === 'Coll. #') && 
            (!row.Order || row.Order === '' || row.Order === 'Order') && 
            (!row.Family || row.Family === '' || row.Family === 'Family')) {
            stats.missingTaxonomic++;
        }
    });
    
    return stats;
}

/**
 * Export data as CSV
 * @param {Array} data - The data to export
 * @returns {string} - CSV content as string
 */
function exportDataAsCsv(data) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return '';
    }
    
    return Papa.unparse(data, {
        quotes: true,
        header: true
    });
}
