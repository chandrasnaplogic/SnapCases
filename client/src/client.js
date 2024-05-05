import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import './App.css';

export const DataGrid = () => { // Receive darkMode as a prop
  const [data, setData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [selectedDays, setSelectedDays] = useState(15);
  const [darkMode, setDarkMode] = useState(false); // State for dark mode

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/data?days=${selectedDays}`
        );
        const fetchedData = response.data;
        setData(fetchedData);
        if (fetchedData.length > 0) {
          const firstItemKeys = Object.keys(fetchedData[0]);
          setKeys(firstItemKeys);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedDays]);

  // Rest of the code remains unchanged


  /* Custom Cell Renderer (Display tick / cross in 'Successful' column) */
  const MissionResultRenderer = ({ value }) => (
    <span
      style={{
        display: "flex",
        justifyContent: "center",
        height: "100%",
        alignItems: "center",
      }}
    >
      {
        <img
          alt={`${value}`}
          src={`https://www.ag-grid.com/example-assets/icons/${
            value ? "tick-in-circle" : "cross-in-circle"
          }.png`}
          style={{ width: "auto", height: "auto" }}
        />
      }
    </span>
  );

  var currentYear = new Date().getFullYear();
  //Date custom filter
  var filterParams = {
    comparator: (filterLocalDateAtMidnight, cellValue) => {
      if (!cellValue) return -1; // Check if cellValue is null or undefined

      // Parse the cellValue string into a Date object and set time to midnight
      var cellDate = new Date(cellValue);
      cellDate.setHours(0, 0, 0, 0); // Set time to midnight (00:00:00)

      // Check if the parsed date is valid
      if (isNaN(cellDate.getTime())) return -1;

      // Create a copy of filterLocalDateAtMidnight and set time to midnight
      var filterDateMidnight = new Date(filterLocalDateAtMidnight);
      filterDateMidnight.setHours(0, 0, 0, 0); // Set time to midnight (00:00:00)

      // Compare the dates without considering time
      if (filterDateMidnight.getTime() === cellDate.getTime()) {
        return 0;
      }
      if (cellDate < filterDateMidnight) {
        return -1;
      }
      if (cellDate > filterDateMidnight) {
        return 1;
      }
      return 0;
    },
    minValidYear: 2000,
    maxValidYear: currentYear,
    inRangeFloatingFilterDateFormat: "Do MMM YYYY",
  };


  const rowData = data;
  const colData = keys.map((key) => {
    const column = {
      headerName: key.toUpperCase(), // Use key as headerName
      field: key, // Use key as field
    };

    // Add checkboxSelection: true if key is 'id'
    // if (key === "id") {
    //   column.checkboxSelection = true;
    // }

    // Add cellRenderer: true if key is 'boolean'
    if (key === "boolean") {
      column.cellRenderer = MissionResultRenderer;
    }

    if(key==='creation_datetime'){
      column.filter='agDateColumnFilter';
      column.filterParams = filterParams;
    }

    return column;
  });

  const defaultColDef = {//adding column field properties
    sortable: true,
    filter: true,
    floatingFilter: true,
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
     flex: 1,//flexiable column
     minWidth: 50,
  };

  return (
    <div>
      <div  className={`App ${darkMode ? 'dark' : ''}`}> 
        <img src='https://content.energage.com/company-images/SE95252/SE95252_logo_orig.png' alt='Snaplogic' className='Snaplogic-logo'  style={{ width: '200px', height: 'auto', marginTop:'10px'}}></img>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
         <div style={{ marginRight: "10px" }}>
          <img
          src="https://www.vectorlogo.zone/logos/snaplogic/snaplogic-icon.svg"
          alt="Toggle Dark Mode"
          style={{ width: "30px", height: "30px", cursor: "pointer" }}
          onClick={toggleDarkMode}
        /> 
        </div>
        <div>
          <label htmlFor="daysInput" style={{ fontFamily: "Arial, sans-serif", fontSize: "16px" }}>
            Days :
          </label>
          <input
            type="number"
            id="daysInput"
            value={selectedDays}
            onChange={(e) => setSelectedDays(parseInt(e.target.value))}
            style={{ width: "40px", marginBottom: "5px", marginLeft: "5px", marginRight: "10px" }}
          />
        </div>
      </div>
      </div>

      

      <div className={`ag-theme-quartz${darkMode ? '-dark' : ''}`} style={{ height: 560 }}> {/* Conditional class for dark mode */}
        <AgGridReact
          rowData={rowData}
          columnDefs={colData}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          pagination={true}
          paginationPageSize={10}
          enableCellTextSelection={true}
          enableRangeSelection={true} 
          paginationPageSizeSelector={[10, 25, 50, 100, 200]}
        />
      </div>
    </div>
  );
};
