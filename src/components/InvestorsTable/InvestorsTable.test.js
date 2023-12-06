import React from 'react';
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react';
import {getInvestorsByFirmIds} from '../../api/investorApi';
import InvestorsTable from './InvestorsTable';
import {MemoryRouter} from 'react-router-dom';

jest.mock('../../api/investorApi');

describe('InvestorsTable', () => {
    it('displays investors are fetched when calls API', async () => {
        const response = mockGetInvestorsResponse();

        renderWithRouter(<InvestorsTable/>);

        const loading = screen.getByText('Loading...');
        expect(loading).toBeInTheDocument();

        await waitForElementToBeRemoved(loading);

        response.forEach(investor => {
            expect(screen.getByText(investor.firmID)).toBeInTheDocument();
            expect(screen.getByText(investor.firmName)).toBeInTheDocument();
            expect(screen.getByText(investor.firmType)).toBeInTheDocument();
            expect(screen.getByText(investor.address)).toBeInTheDocument();
        });
    });

    it('displays an error message when the API call fails', async () => {
        getInvestorsByFirmIds.mockRejectedValue(new Error('connection failed'));

        renderWithRouter(<InvestorsTable/>);
        expect(screen.getByText('Loading...')).toBeInTheDocument();

        await screen.findByText('Error: connection failed');
    });
});

const renderWithRouter = (component) => {
    render(
        <MemoryRouter>{component}</MemoryRouter>
    );
}

const mockGetInvestorsResponse = () => {
    const response = [
        {
            firmID: '1111',
            firmName: 'Firm 1',
            firmType: 'Firm Type 1',
            address: 'Address 1',
        },
        {
            firmID: '2222',
            firmName: 'Firm 2',
            firmType: 'Firm Type 2',
            address: 'Address 2',
        },
    ];

    getInvestorsByFirmIds.mockResolvedValue({data: response});

    return response;
};