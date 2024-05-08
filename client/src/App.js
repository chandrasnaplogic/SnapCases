
import './App.css';
import { DataGrid } from "./client";
import { UpdateIsCompletedForm } from './client2';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  

  return (
    <Router>
       <div className="App">   
        <Routes>
           <Route path="/" element ={<DataGrid/>}/>
           <Route path="/TestRun" element ={<UpdateIsCompletedForm/>}/>
        </Routes>
     </div>
    </Router>
   
  );
}

export default App;
