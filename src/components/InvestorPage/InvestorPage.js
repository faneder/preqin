import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {getInvestorCommitments} from '../../api/investorApi';

const InvestorPage = () => {
    const {investorId} = useParams();
    const [assetClasses] = useState([
        {label: 'Private Equity', value: 'pe'},
        {label: 'Private Debt', value: 'pd'},
        {label: 'Real Estate', value: 're'},
        {label: 'Infrastructure', value: 'inf'},
        {label: 'Natural Resources', value: 'nr'},
        {label: 'Hedge Funds', value: 'hf'}
    ]);
    const [selectedAssetClass, setSelectedAssetClass] = useState(assetClasses[0]);
    const [commitments, setCommitments] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (selectedAssetClass && investorId) {
                try {
                    const response = await getInvestorCommitments(selectedAssetClass.value, investorId);
                    setCommitments(response.data);
                } catch (error) {
                    setError(error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchData();
    }, [selectedAssetClass, investorId]);

    const handleAssetClassChange = (event) => {
        setSelectedAssetClass(
            assetClasses.find(a => a.value === event.target.value)
        );
    }

    if (isLoading) {
        return <div data-testid="loader" className="loader"></div>;
    }

    if (error) return <p>{error.message}</p>;

    return (
        <div>
            <h3 className="title">Commitments for {selectedAssetClass.label}</h3>
            <b>Select an asset class:</b>
            <select role="combobox" onChange={handleAssetClassChange} value={selectedAssetClass.value}>
                {assetClasses.map((assetClass) => (
                    <option key={assetClass.value} value={assetClass.value}>
                        {assetClass.label}
                    </option>
                ))}
            </select>

            <table className="investors-table">
                <thead>
                <tr>
                    <th>Investor Name</th>
                    <th>Fun ID</th>
                    <th>Fund Name</th>
                    <th>Fund Manager Name</th>
                    <th>FUND SIZE MN</th>
                    <th>Currency</th>
                    <th>Vintage</th>
                    <th>Fund Type</th>
                    <th>Core Industries</th>
                    <th>Industry Verticals</th>
                    <th>Benchmark Locations</th>
                    <th>Manager Experience</th>
                </tr>
                </thead>
                <tbody>
                {commitments.length > 0 ? (commitments.map((commitment, index) => (
                        <tr role="row" key={index} data-testid="investor-row">
                            <td data-testid="investor-name">{commitment.investorName}</td>
                            <td data-testid="fund-id">{commitment.fundId}</td>
                            <td data-testid="fund-name">{commitment.fundName}</td>
                            <td data-testid="fund-manager-name">{commitment.fundManagerName}</td>
                            <td data-testid="fund-size">{commitment.fundSizeMn}</td>
                            <td data-testid="fund-currency">{commitment.fundCurrency}</td>
                            <td data-testid="vintage">{commitment.vintage}</td>
                            <td data-testid="fund-type">{commitment.fundType}</td>
                            <td data-testid="core-industries">{commitment.coreIndustries}</td>
                            <td data-testid="industry-verticals">{commitment.industryVerticals}</td>
                            <td data-testid="benchmark-locations">{commitment.benchmarkLocations}</td>
                            <td data-testid="manager-experience">{commitment.managerExperience}</td>
                        </tr>
                    ))
                ) : 'No commitments found'}
                </tbody>
            </table>
        </div>
    );
}

export default InvestorPage;