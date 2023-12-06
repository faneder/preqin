import React from 'react';
import {fireEvent, render, screen, within} from '@testing-library/react';
import {useParams} from 'react-router-dom';
import {getInvestorCommitments} from '../../api/investorApi';
import InvestorDetails from './InvestorPage';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}));

jest.mock('../../api/investorApi');

const commitmentsResponse = {
    "data": [{
        "investorId": "2670",
        "investorName": "1199SEIU National Benefit Fund",
        "fundId": "2124",
        "fundName": "American Securities Partners II",
        "fundManagerId": "44",
        "fundManagerName": "American Securities",
        "fundCurrency": "USD",
        "fundSizeMn": "350.00",
        "committedMn": "",
        "vintage": "1998",
        "fundType": "Buyout",
        "coreIndustries": "Consumer Discretionary",
        "industryVerticals": "Manufacturing",
        "domicile": "",
        "benchmarkLocations": "North America",
        "managerExperience": "2nd Fund"
    }]
}

describe('InvestorPage', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('displays investor commitment are fetched in table when calls API', async () => {
        mockUseParams(777);
        getInvestorCommitments.mockResolvedValue(commitmentsResponse);

        render(<InvestorDetails/>);

        const table = await screen.findByRole('table');
        expect(table).toBeInTheDocument();

        const rows = screen.getAllByTestId('investor-row');

        rows.forEach((row) => {
            const name = within(row).getByTestId('investor-name');
            const id = within(row).getByTestId('fund-id');
            const fundName = within(row).getByTestId('fund-name');
            const fundManagerName = within(row).getByTestId('fund-manager-name');
            const fundSize = within(row).getByTestId('fund-size');
            const fundCurrency = within(row).getByTestId('fund-currency');
            const vintage = within(row).getByTestId('vintage');
            const fundType = within(row).getByTestId('fund-type');
            const coreIndustries = within(row).getByTestId('core-industries');
            const industryVerticals = within(row).getByTestId('industry-verticals');
            const benchmarkLocations = within(row).getByTestId('benchmark-locations');
            const managerExperience = within(row).getByTestId('manager-experience');

            expect(name).toHaveTextContent('1199SEIU National Benefit Fund');
            expect(id).toHaveTextContent('2124');
            expect(fundName).toHaveTextContent('American Securities Partners II');
            expect(fundManagerName).toHaveTextContent('American Securities');
            expect(fundSize).toHaveTextContent('350.00');
            expect(fundCurrency).toHaveTextContent('USD');
            expect(vintage).toHaveTextContent('1998');
            expect(fundType).toHaveTextContent('Buyout');
            expect(coreIndustries).toHaveTextContent('Consumer Discretionary');
            expect(industryVerticals).toHaveTextContent('Manufacturing');
            expect(benchmarkLocations).toHaveTextContent('North America');
            expect(managerExperience).toHaveTextContent('2nd Fund');
        });
    });

    it('displays loader when rendering a table', async () => {
        mockUseParams(777);
        getInvestorCommitments.mockResolvedValue(commitmentsResponse);

        render(<InvestorDetails/>);

        const loader = await screen.findByTestId('loader');
        expect(loader).toBeInTheDocument();
    });
        
    it('displays errors when the API call fails', async () => {
        mockUseParams(777);
        getInvestorCommitments.mockRejectedValue(new Error('An error occurred'));

        render(<InvestorDetails/>);

        const errorMessage = await screen.findByText('An error occurred');
        expect(errorMessage).toBeInTheDocument();
    });

    it('updates data when selected asset class changes', async () => {
        mockUseParams(777);
        getInvestorCommitments
            .mockResolvedValueOnce({data: [{investorId: '1111'}]})
            .mockResolvedValueOnce({data: [{investorId: '2222'}]});

        render(<InvestorDetails/>);

        const table1 = await screen.findByRole('table');
        expect(table1).toBeInTheDocument();

        fireEvent.change(screen.getByDisplayValue('Private Equity'), {target: {value: 'pd'}});

        const table2 = await screen.findByRole('table');
        expect(table2).toBeInTheDocument();
    });

    it('displays message when no commitments found', async () => {
        mockUseParams(777);
        getInvestorCommitments.mockResolvedValue({"data": []});

        render(<InvestorDetails/>);

        const noCommitments = await screen.findByText('No commitments found');
        expect(noCommitments).toBeInTheDocument();
    });

    it('does not fetch commitments when no investorId is provided', async () => {
        mockUseParams(null);

        render(<InvestorDetails/>);

        await new Promise(r => setTimeout(r, 100));

        expect(getInvestorCommitments).not.toHaveBeenCalled();
    });
});

const mockUseParams = (investorId = null) => {
    useParams.mockReturnValue({investorId});
}