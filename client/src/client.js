import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import axios from "axios";
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-alpine.css"; // Theme

// Create new Grid component
export const DataGrid = () => {
  const [data, setData] = useState([]); // State to hold the rows
  const [keys, setKeys] = useState([]); // State to hold the keys
  const [selectedDays, setSelectedDays] = useState(15); // State to hold the selected number of days
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/data?days=${selectedDays}`); // Updated API call to use selectedDays
        const fetchedData = response.data;
        setData(fetchedData); // Assigning data to data variable
        // Extract keys from the first data item
        if (fetchedData.length > 0) {
          const firstItemKeys = Object.keys(fetchedData[0]);
          setKeys(firstItemKeys); // Assigning data to keys
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedDays]); // useEffect will re-run whenever selectedDays changes

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
    if (key === "id") {
      column.checkboxSelection = true;
    }

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
     <div style={{ display: "flex", justifyContent: "flex-end" }}>
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


      <div className="ag-theme-alpine" style={{ height: 560 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colData}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
           suppressRowClickSelection={true}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50, 100, 200]}
        />
      </div>
    </div>
  );
};
