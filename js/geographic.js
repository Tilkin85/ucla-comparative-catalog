// Geographic Distribution JavaScript

/**
 * Initialize the geographic distribution visualization
 * @param {Array} data - The specimen data
 */
function initGeographicDistribution(data) {
    const container = document.getElementById('geographic-distribution');
    if (!container) return;
    
    // First clear the container
    container.innerHTML = '';
    
    // Create loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    container.appendChild(loadingDiv);
    
    // Process data asynchronously to avoid blocking the UI
    setTimeout(() => {
        try {
            // Render the component using ReactDOM
            renderGeographicComponent(container, data);
        } catch (error) {
            console.error('Error rendering geographic distribution:', error);
            container.innerHTML = `
                <div class="error-message">
                    Error loading geographic distribution. Please try again.
                </div>
            `;
        }
    }, 100);
}

/**
 * Render the Geographic Distribution React component
 * @param {HTMLElement} container - The container element
 * @param {Array} data - The specimen data
 */
function renderGeographicComponent(container, data) {
    // Create a React component based on your existing TSX
    const GeographicDistribution = React.createElement(() => {
        const [countryData, setCountryData] = React.useState({});
        const [totalSpecimens, setTotalSpecimens] = React.useState(0);
        const [missingGeoInfo, setMissingGeoInfo] = React.useState(0);
        
        React.useEffect(() => {
            // Process the data
            const countries = {};
            let missing = 0;
            
            data.forEach(row => {
                if (row.Country && typeof row.Country === 'string' && 
                    row.Country.trim() !== '' && 
                    row.Country !== 'Country' && row.Country !== 'Species') {
                    const country = row.Country.trim();
                    countries[country] = (countries[country] || 0) + 1;
                } else if ((!row.Country || row.Country.trim() === '') && 
                           (!row.State || row.State.trim() === '')) {
                    missing++;
                }
            });
            
            setCountryData(countries);
            setMissingGeoInfo(missing);
            setTotalSpecimens(data.length);
        }, [data]);
        
        // Color scale for the map
        const getColor = (count) => {
            if (!count) return '#f0f0f0';
            if (count < 10) return '#EDF8FB';
            if (count < 50) return '#B3CDE3';
            if (count < 100) return '#8C96C6';
            if (count < 200) return '#8856A7';
            if (count < 500) return '#810F7C';
            return '#4D004B';
        };
        
        // Sort countries by specimen count in descending order
        const sortedCountries = Object.entries(countryData)
            .sort((a, b) => b[1] - a[1])
            .filter(([country]) => 
                country !== 'Pacific Ocean' && 
                country !== 'Eastern Pacific Ocean' && 
                country !== 'Pacific' && 
                country !== 'IndoPac'
            );
        
        return React.createElement('div', { className: 'bg-white p-4 rounded-lg shadow-md' },
            React.createElement('h2', { className: 'text-xl font-bold mb-4' }, 'Geographic Distribution of Specimens'),
            
            React.createElement('div', { className: 'mb-4' },
                React.createElement('p', null, `Total specimens: ${totalSpecimens}`),
                React.createElement('p', null, `Specimens with missing geographic information: ${missingGeoInfo} (${((missingGeoInfo/totalSpecimens)*100).toFixed(1)}%)`)
            ),
            
            React.createElement('div', { className: 'border-t border-gray-200 pt-4' },
                React.createElement('h3', { className: 'text-lg font-semibold mb-2' }, 'Specimen Count by Country'),
                React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                    // Left column - Table
                    React.createElement('div', { className: 'bg-gray-50 p-4 rounded' },
                        React.createElement('table', { className: 'w-full' },
                            React.createElement('thead', null,
                                React.createElement('tr', { className: 'bg-gray-100' },
                                    React.createElement('th', { className: 'text-left p-2' }, 'Country'),
                                    React.createElement('th', { className: 'text-right p-2' }, 'Count'),
                                    React.createElement('th', { className: 'text-right p-2' }, 'Percentage')
                                )
                            ),
                            React.createElement('tbody', null,
                                sortedCountries.map(([country, count]) => 
                                    React.createElement('tr', { key: country, className: 'border-b border-gray-200' },
                                        React.createElement('td', { className: 'p-2' }, country),
                                        React.createElement('td', { className: 'text-right p-2' }, count),
                                        React.createElement('td', { className: 'text-right p-2' }, `${((count/totalSpecimens)*100).toFixed(1)}%`)
                                    )
                                )
                            )
                        )
                    ),
                    
                    // Right column - Legend and top countries
                    React.createElement('div', null,
                        // Color legend
                        React.createElement('div', { className: 'mb-4' },
                            React.createElement('h4', { className: 'font-semibold mb-2' }, 'Color Legend'),
                            React.createElement('div', { className: 'flex flex-wrap gap-2' },
                                React.createElement('div', { className: 'flex items-center' },
                                    React.createElement('div', { className: 'w-4 h-4 mr-1', style: {backgroundColor: '#EDF8FB'} }),
                                    React.createElement('span', { className: 'text-sm' }, '1-9')
                                ),
                                React.createElement('div', { className: 'flex items-center' },
                                    React.createElement('div', { className: 'w-4 h-4 mr-1', style: {backgroundColor: '#B3CDE3'} }),
                                    React.createElement('span', { className: 'text-sm' }, '10-49')
                                ),
                                React.createElement('div', { className: 'flex items-center' },
                                    React.createElement('div', { className: 'w-4 h-4 mr-1', style: {backgroundColor: '#8C96C6'} }),
                                    React.createElement('span', { className: 'text-sm' }, '50-99')
                                ),
                                React.createElement('div', { className: 'flex items-center' },
                                    React.createElement('div', { className: 'w-4 h-4 mr-1', style: {backgroundColor: '#8856A7'} }),
                                    React.createElement('span', { className: 'text-sm' }, '100-199')
                                ),
                                React.createElement('div', { className: 'flex items-center' },
                                    React.createElement('div', { className: 'w-4 h-4 mr-1', style: {backgroundColor: '#810F7C'} }),
                                    React.createElement('span', { className: 'text-sm' }, '200-499')
                                ),
                                React.createElement('div', { className: 'flex items-center' },
                                    React.createElement('div', { className: 'w-4 h-4 mr-1', style: {backgroundColor: '#4D004B'} }),
                                    React.createElement('span', { className: 'text-sm' }, '500+')
                                )
                            )
                        ),
                        
                        // Top 5 countries
                        React.createElement('div', null,
                            React.createElement('h4', { className: 'font-semibold mb-2' }, 'Top 5 Countries'),
                            React.createElement('div', { className: 'space-y-2' },
                                sortedCountries.slice(0, 5).map(([country, count]) => 
                                    React.createElement('div', { key: country, className: 'flex items-center' },
                                        React.createElement('div', { className: 'w-full bg-gray-200 rounded-full h-4 mr-2' },
                                            React.createElement('div', { 
                                                className: 'h-4 rounded-full', 
                                                style: {
                                                    backgroundColor: getColor(count),
                                                    width: `${Math.min(100, (count / Math.max(...sortedCountries.map(c => c[1]))) * 100)}%`
                                                } 
                                            })
                                        ),
                                        React.createElement('span', { className: 'text-sm font-medium' }, `${country}: ${count}`)
                                    )
                                )
                            )
                        )
                    )
                )
            ),
            
            // World Map Section
            React.createElement('div', { className: 'mt-6' },
                React.createElement('h3', { className: 'text-lg font-semibold mb-4' }, 'World Map of Specimen Distribution'),
                React.createElement('div', { className: 'border border-gray-300 rounded p-4' },
                    React.createElement('div', { className: 'text-center italic text-gray-600' },
                        'Simple world map representation - Countries are colored based on specimen count'
                    ),
                    React.createElement('div', { className: 'overflow-x-auto mt-2' },
                        React.createElement('svg', { viewBox: '0 0 1000 500', className: 'w-full' },
                            // Background
                            React.createElement('rect', { x: 0, y: 0, width: 1000, height: 500, fill: '#f0f0f0' }),
                            
                            // Simplified continent outlines
                            // North America
                            React.createElement('path', { 
                                d: 'M 150,120 L 250,120 L 300,200 L 250,280 L 150,280 Z',
                                fill: getColor(countryData['USA'] || 0),
                                stroke: '#fff',
                                strokeWidth: 2
                            }),
                            React.createElement('text', { x: 200, y: 200, textAnchor: 'middle', fontSize: 12 }, 'USA'),
                            
                            // Central America
                            React.createElement('path', { 
                                d: 'M 250,280 L 270,300 L 290,330 L 250,360 L 230,340 Z',
                                fill: getColor(countryData['Mexico'] || 0),
                                stroke: '#fff',
                                strokeWidth: 2
                            }),
                            React.createElement('text', { x: 260, y: 320, textAnchor: 'middle', fontSize: 10 }, 'Mexico'),
                            
                            // South America
                            React.createElement('path', { 
                                d: 'M 290,330 L 310,380 L 350,450 L 250,450 L 230,380 Z',
                                fill: getColor(countryData['Peru'] || 0),
                                stroke: '#fff',
                                strokeWidth: 2
                            }),
                            React.createElement('text', { x: 290, y: 410, textAnchor: 'middle', fontSize: 12 }, 'Peru'),
                            
                            // Europe
                            React.createElement('path', { 
                                d: 'M 470,120 L 550,120 L 550,180 L 470,180 Z',
                                fill: getColor(countryData['Poland'] || 0),
                                stroke: '#fff',
                                strokeWidth: 2
                            }),
                            React.createElement('text', { x: 510, y: 150, textAnchor: 'middle', fontSize: 10 }, 'Europe'),
                            
                            // Africa
                            React.createElement('path', { 
                                d: 'M 470,200 L 550,200 L 550,350 L 470,350 Z',
                                fill: getColor(countryData['Egypt'] || 0),
                                stroke: '#fff',
                                strokeWidth: 2
                            }),
                            React.createElement('text', { x: 510, y: 275, textAnchor: 'middle', fontSize: 12 }, 'Africa'),
                            
                            // Asia
                            React.createElement('path', { 
                                d: 'M 600,120 L 750,120 L 750,280 L 600,280 Z',
                                fill: getColor(countryData['Japan'] || 0),
                                stroke: '#fff',
                                strokeWidth: 2
                            }),
                            React.createElement('text', { x: 675, y: 200, textAnchor: 'middle', fontSize: 12 }, 'Asia'),
                            
                            // Australia
                            React.createElement('path', { 
                                d: 'M 750,350 L 850,350 L 850,450 L 750,450 Z',
                                fill: getColor(countryData['Australia'] || 0),
                                stroke: '#fff',
                                strokeWidth: 2
                            }),
                            React.createElement('text', { x: 800, y: 400, textAnchor: 'middle', fontSize: 12 }, 'Australia'),
                            
                            // Panama - Central America highlight
                            React.createElement('circle', { 
                                cx: 280, cy: 340, r: 10,
                                fill: getColor(countryData['Panama'] || 0),
                                stroke: '#fff',
                                strokeWidth: 1
                            }),
                            React.createElement('text', { x: 280, y: 340, textAnchor: 'middle', fontSize: 8, fill: '#fff' }, 'Panama')
                        )
                    ),
                    React.createElement('div', { className: 'mt-4 text-sm text-gray-600' },
                        React.createElement('p', null, 'Note: This is a simplified representation. The actual geographic distribution would require a more detailed map.'),
                        React.createElement('p', null, 'Ocean specimens (Pacific, Eastern Pacific, IndoPac) are not shown on this map.')
                    )
                )
            )
        );
    });
    
    // Render the component to the container
    ReactDOM.render(React.createElement(GeographicDistribution), container);
}
