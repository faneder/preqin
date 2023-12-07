import './App.css';
import InvestorsList from "./components/InvestorsList/InvestorsList";
import InvestorDetails from "./components/InvestorDetails/InvestorDetails";
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InvestorsList />} />
          <Route path="/investors/:investorId" element={<InvestorDetails/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
