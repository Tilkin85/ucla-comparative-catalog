// Taxonomic Distribution JavaScript

/**
 * Initialize the taxonomic distribution visualization
 * @param {Array} data - The specimen data
 */
function initTaxonomicDistribution(data) {
    const container = document.getElementById('taxonomic-distribution');
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
            renderTaxonomicComponent(container, data);
        } catch (error) {
            console.error('Error rendering taxonomic distribution:', error);
            container.innerHTML = `
                <div class="error-message">
                    Error loading taxonomic distribution. Please try again.
                </div>
            `;
        }
    }, 100);
}

/**
 * Render the Taxonomic Distribution React component
 * @param {HTMLElement} container - The container element
 * @param {Array} data - The specimen data
 */
function renderTaxonomicComponent(container, data) {
    // Use Recharts components
    const { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } = Recharts;
    
    // Create a React component based on your existing TSX
    const TaxonomicDistributionCharts = React.createElement(() => {
        // State for our three datasets
        const [classData, setClassData] = React.useState([]);
        const [orderData, setOrderData] = React.useState([]);
        const [familyData, setFamilyData] = React.useState([]);
        
        // Color palette - distinct colors for taxonomy groups
        const COLORS = [
            '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
            '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57', '#83a6ed'
        ];
        
        React.useEffect(() => {
            // Process the data
            processData(data);
        }, [data]);
        
        const processData = (data) => {
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
            const classArray = Object.entries(classCounts).map(([name, value]) => ({
                name,
                value,
                percentage: 0 // Will calculate below
            }));
            
            classArray.sort((a, b) => b.value - a.value);
            const total = classArray.reduce((sum, item) => sum + item.value, 0);
            classArray.forEach(item => {
                item.percentage = ((item.value / total) * 100).toFixed(1);
            });
            
            setClassData(classArray);
            
            // Process Order data - get top 10 and group others
            const orderCounts = {};
            data.forEach(row => {
                const orderName = row.Order;
                if (orderName && typeof orderName === 'string' && orderName.trim() !== '' && 
                    orderName !== 'Order' && !orderName.includes('Spec')) {
                    orderCounts[orderName] = (orderCounts[orderName] || 0) + 1;
                }
            });
            
            let orderArray = Object.entries(orderCounts).map(([name, value]) => ({
                name,
                value,
                percentage: 0
            }));
            
            orderArray.sort((a, b) => b.value - a.value);
            
            // Take top 10 orders and group the rest
            const top10Orders = orderArray.slice(0, 10);
            const otherOrders = orderArray.slice(10);
            const otherOrdersTotal = otherOrders.reduce((sum, item) => sum + item.value, 0);
            
            const finalOrderData = [
                ...top10Orders,
                { name: "Other Orders", value: otherOrdersTotal, percentage: 0 }
            ];
            
            const orderTotal = finalOrderData.reduce((sum, item) => sum + item.value, 0);
            finalOrderData.forEach(item => {
                item.percentage = ((item.value / orderTotal) * 100).toFixed(1);
            });
            
            setOrderData(finalOrderData);
            
            // Process Family data - similar approach
            const familyCounts = {};
            data.forEach(row => {
                const familyName = row.Family;
                if (familyName && typeof familyName === 'string' && familyName.trim() !== '' && 
                    familyName !== 'Family' && !familyName.includes('Class')) {
                    familyCounts[familyName] = (familyCounts[familyName] || 0) + 1;
                }
            });
            
            let familyArray = Object.entries(familyCounts).map(([name, value]) => ({
                name,
                value,
                percentage: 0
            }));
            
            familyArray.sort((a, b) => b.value - a.value);
            
            // Take top 10 families and group the rest
            const top10Families = familyArray.slice(0, 10);
            const otherFamilies = familyArray.slice(10);
            const otherFamiliesTotal = otherFamilies.reduce((sum, item) => sum + item.value, 0);
            
            const finalFamilyData = [
                ...top10Families,
                { name: "Other Families", value: otherFamiliesTotal, percentage: 0 }
            ];
            
            const familyTotal = finalFamilyData.reduce((sum, item) => sum + item.value, 0);
            finalFamilyData.forEach(item => {
                item.percentage = ((item.value / familyTotal) * 100).toFixed(1);
            });
            
            setFamilyData(finalFamilyData);
        };
        
        const renderCustomizedLabel = ({ name, percentage }) => {
            return `${name}: ${percentage}%`;
        };
        
        // Define the formatter function for tooltips
        const tooltipFormatter = (value, name, props) => [
            `${value} specimens (${props.payload.percentage}%)`, 
            name
        ];
        
        return React.createElement('div', { className: 'flex flex-col items-center w-full' },
            React.createElement('h1', { className: 'text-2xl font-bold mb-8' }, 'Taxonomic Distribution of Specimens'),
            
            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-8 w-full' },
                // Class Distribution
                React.createElement('div', { className: 'bg-white p-4 rounded-lg shadow-md' },
                    React.createElement('h2', { className: 'text-xl font-semibold mb-4 text-center' }, 'Class Distribution'),
                    React.createElement('div', { className: 'h-64' },
                        React.createElement(ResponsiveContainer, { width: '100%', height: '100%' },
                            React.createElement(PieChart, null,
                                React.createElement(Pie, {
                                    data: classData,
                                    cx: '50%',
                                    cy: '50%',
                                    labelLine: false,
                                    outerRadius: 80,
                                    fill: '#8884d8',
                                    dataKey: 'value',
                                    nameKey: 'name',
                                    label: renderCustomizedLabel
                                }, classData.map((entry, index) => 
                                    React.createElement(Cell, { 
                                        key: `cell-${index}`,
                                        fill: COLORS[index % COLORS.length]
                                    })
                                )),
                                React.createElement(Tooltip, { formatter: tooltipFormatter }),
                                React.createElement(Legend)
                            )
                        )
                    ),
                    React.createElement('div', { className: 'mt-4' },
                        React.createElement('h3', { className: 'font-medium mb-2' }, 'Class Summary:'),
                        React.createElement('ul', { className: 'text-sm' },
                            classData.map((item, index) => 
                                React.createElement('li', { key: index, className: 'mb-1' },
                                    React.createElement('span', { className: 'font-medium' }, `${item.name}:`),
                                    ` ${item.value} specimens (${item.percentage}%)`
                                )
                            )
                        )
                    )
                ),
                
                // Order Distribution
                React.createElement('div', { className: 'bg-white p-4 rounded-lg shadow-md' },
                    React.createElement('h2', { className: 'text-xl font-semibold mb-4 text-center' }, 'Order Distribution (Top 10)'),
                    React.createElement('div', { className: 'h-64' },
                        React.createElement(ResponsiveContainer, { width: '100%', height: '100%' },
                            React.createElement(PieChart, null,
                                React.createElement(Pie, {
                                    data: orderData,
                                    cx: '50%',
                                    cy: '50%',
                                    labelLine: false,
                                    outerRadius: 80,
                                    fill: '#8884d8',
                                    dataKey: 'value',
                                    nameKey: 'name',
                                    label: ({ name, percentage }) => {
                                        // Only show labels for items with enough percentage to be readable
                                        return parseFloat(percentage) > 3 ? `${name}: ${percentage}%` : '';
                                    }
                                }, orderData.map((entry, index) => 
                                    React.createElement(Cell, { 
                                        key: `cell-${index}`,
                                        fill: COLORS[index % COLORS.length]
                                    })
                                )),
                                React.createElement(Tooltip, { formatter: tooltipFormatter }),
                                React.createElement(Legend)
                            )
                        )
                    ),
                    React.createElement('div', { className: 'mt-4' },
                        React.createElement('h3', { className: 'font-medium mb-2' }, 'Top 10 Orders:'),
                        React.createElement('ul', { className: 'text-sm' },
                            orderData.slice(0, 10).map((item, index) => 
                                React.createElement('li', { key: index, className: 'mb-1' },
                                    React.createElement('span', { className: 'font-medium' }, `${item.name}:`),
                                    ` ${item.value} specimens (${item.percentage}%)`
                                )
                            ),
                            orderData.length > 10 && 
                                React.createElement('li', { className: 'mb-1' },
                                    React.createElement('span', { className: 'font-medium' }, `${orderData[10].name}:`),
                                    ` ${orderData[10].value} specimens (${orderData[10].percentage}%)`
                                )
                        )
                    )
                ),
                
                // Family Distribution
                React.createElement('div', { className: 'bg-white p-4 rounded-lg shadow-md md:col-span-2' },
                    React.createElement('h2', { className: 'text-xl font-semibold mb-4 text-center' }, 'Family Distribution (Top 10)'),
                    React.createElement('div', { className: 'h-64' },
                        React.createElement(ResponsiveContainer, { width: '100%', height: '100%' },
                            React.createElement(PieChart, null,
                                React.createElement(Pie, {
                                    data: familyData,
                                    cx: '50%',
                                    cy: '50%',
                                    labelLine: false,
                                    outerRadius: 80,
                                    fill: '#8884d8',
                                    dataKey: 'value',
                                    nameKey: 'name',
                                    label: ({ name, percentage }) => {
                                        // Only show labels for items with enough percentage to be readable
                                        return parseFloat(percentage) > 2 ? `${name}: ${percentage}%` : '';
                                    }
                                }, familyData.map((entry, index) => 
                                    React.createElement(Cell, { 
                                        key: `cell-${index}`,
                                        fill: COLORS[index % COLORS.length]
                                    })
                                )),
                                React.createElement(Tooltip, { formatter: tooltipFormatter }),
                                React.createElement(Legend)
                            )
                        )
                    ),
                    React.createElement('div', { className: 'mt-4' },
                        React.createElement('h3', { className: 'font-medium mb-2' }, 'Top 10 Families:'),
                        React.createElement('ul', { className: 'grid grid-cols-1 md:grid-cols-2 text-sm' },
                            familyData.slice(0, 10).map((item, index) => 
                                React.createElement('li', { key: index, className: 'mb-1' },
                                    React.createElement('span', { className: 'font-medium' }, `${item.name}:`),
                                    ` ${item.value} specimens (${item.percentage}%)`
                                )
                            ),
                            familyData.length > 10 && 
                                React.createElement('li', { className: 'mb-1 md:col-span-2' },
                                    React.createElement('span', { className: 'font-medium' }, `${familyData[10].name}:`),
                                    ` ${familyData[10].value} specimens (${familyData[10].percentage}%)`
                                )
                        )
                    )
                )
            )
        );
    });
    
    // Render the component to the container
    ReactDOM.render(React.createElement(TaxonomicDistributionCharts), container);
}
