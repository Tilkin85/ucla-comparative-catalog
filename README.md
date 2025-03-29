# UCLA Comparative Catalog Visualization

This repository contains a web-based visualization tool for the UCLA Comparative Catalog database of wildlife specimens. The website provides interactive visualizations for geographic and taxonomic distributions of specimens.

## Features

- **Overview Dashboard**: Quick summary statistics and highlights
- **Geographic Distribution**: Interactive visualization of specimen locations worldwide
- **Taxonomic Distribution**: Pie charts showing class, order, and family distributions
- **Database Updates**: Easy upload of updated CSV files to refresh the database

## Getting Started

### Prerequisites

- A web browser (Chrome, Firefox, Safari, Edge)
- Git (for cloning the repository)
- A local web server (optional but recommended)

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/your-username/ucla-comparative-catalog.git
   ```

2. Navigate to the project directory:
   ```
   cd ucla-comparative-catalog
   ```

3. Set up a local server:
   - You can use Python's built-in HTTP server:
     ```
     python -m http.server
     ```
   - Or use an extension like Live Server in VS Code

4. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

### File Structure

```
ucla-comparative-catalog/
│
├── index.html                 # Main HTML file
├── css/
│   └── styles.css             # Main stylesheet
├── js/
│   ├── main.js                # Main JavaScript file
│   ├── dataProcessor.js       # Data processing functions
│   ├── geographicDistribution.js  # Geographic visualization
│   ├── taxonomicDistribution.js   # Taxonomic visualization
│   └── databaseUpdater.js     # Database update functions
├── data/
│   └── UCLA Comparative Catalog updated locality info.xlsx  Combined colls 5 26 23.csv  # Main data file
└── README.md                  # This file
```

## Updating the Database

1. Download the current database by clicking the download link on the "Update Database" page
2. Open the CSV file in Excel or another spreadsheet program
3. Make your changes to the data (add locations, fix data, etc.)
4. Save the file as a CSV
5. Upload the updated CSV file using the form on the "Update Database" page
6. The website will automatically update with the new data

## Important Notes

- The database includes taxonomic information mapped from numeric codes:
  - 1: Chondrichthyes (Cartilaginous fish)
  - 2: Actinopterygii (Ray-finned fish)
  - 3: Amphibia (Amphibians)
  - 4: Reptilia (Reptiles)
  - 5: Aves (Birds)
  - 6: Mammalia (Mammals)

- When updating the database, make sure to maintain the same column structure in your CSV file.
- The site uses local storage to persist the data between sessions.

## Converting Your TSX Files

The repository includes JavaScript versions of the TSX files you provided:

- `geographic-distribution.tsx` → `geographicDistribution.js`
- `taxonomic-pie-charts.tsx` → `taxonomicDistribution.js`

These have been converted to use vanilla JavaScript and React without requiring a build step.

## Deployment

### GitHub Pages Deployment

1. Go to your GitHub repository
2. Click on "Settings"
3. Scroll down to "GitHub Pages"
4. Select the main branch as the source
5. Click "Save"
6. Your site will be available at `https://your-username.github.io/ucla-comparative-catalog/`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- UCLA for providing the comparative catalog data
- Original dataset contributors
