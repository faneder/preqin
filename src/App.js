import './App.css';
import InvestorsTable from "./components/InvestorsTable/InvestorsTable";
import InvestorPage from "./components/InvestorPage/InvestorPage";
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InvestorsTable />} />
          <Route path="/investors/:investorId" element={<InvestorPage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
