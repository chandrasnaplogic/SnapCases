import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./App.css"


export const UpdateIsCompletedForm = () => {
  const [testrunId, setTestrunId] = useState("");
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false); // State for dark mode
  const [showPopup, setShowPopup] = useState(false);


  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`http://localhost:4000/updateIsCompleted?testrun_id=${testrunId}`);
      setMessage(response.data.message);
      setShowPopup(true);
      
    } catch (error) {
      setMessage("Error updating is_completed");
    }
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setTestrunId(parseInt(inputValue));
  };

  const closePopup = () => {
    setShowPopup(false);
  };    

  
  return (
    <div>

      <div>
        <img src='https://content.energage.com/company-images/SE95252/SE95252_logo_orig.png' alt='Snaplogic' className='Snaplogic-logo'  style={{ width: '200px', height: 'auto', marginTop:'10px'}}></img>
        
        <div style={{ display: "flex", justifyContent: "flex-end" }}>

        <div>
            <Link to="/" className="button-link">HOME</Link>
          </div>
          <div style={{ marginRight: "10px" }}>
          <img
          src="https://www.vectorlogo.zone/logos/snaplogic/snaplogic-icon.svg"
          alt="Toggle Dark Mode"
          style={{ width: "30px", height: "30px", cursor: "pointer" }}
          onClick={toggleDarkMode}
        /> 
            
        </div>
          
      </div>

     <h2>Update The IsCompleted Field</h2>
      <form onSubmit={handleSubmit} className="update-form">
    <label htmlFor="testrunId">Testrun ID </label>
  <input
    type="number"
    id="testrunId"
    value={testrunId}
    onChange={handleInputChange}
    required
  />
  <button type="submit" style={{marginLeft:"10px"}}>UPDATE</button>
</form>
</div>

{showPopup && (
        <div className="popup">
          <span className="popup-close" onClick={closePopup}>&times;</span>
          <p className="popup-message">{message}</p>
        </div>
      )}
      
    </div>
  );
};
