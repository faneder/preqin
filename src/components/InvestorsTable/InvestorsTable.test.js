import React from 'react';
import {fireEvent, render, screen, waitForElementToBeRemoved, within} from '@testing-library/react';
import {getInvestors} from '../../api/investorApi';
import InvestorsTable from './InvestorsTable';
import {MemoryRouter} from 'react-router-dom';

jest.mock('../../api/investorApi');

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const investorsResponse = {"data": [
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
]};

describe('InvestorsTable', () => {
    it('displays investors are fetched when calls API', async () => {
        getInvestors.mockResolvedValue(investorsResponse);

        renderWithRouter(<InvestorsTable/>);

        const loading = screen.getByText('Loading...');
        expect(loading).toBeInTheDocument();

        await waitForElementToBeRemoved(loading);

        const rows = screen.getAllByTestId('investor-row');

        expect(rows.length).toBe(2);

        rows.forEach((row) => {
            const firmID = within(row).getByTestId('firmID');
            const firmName = within(row).getByTestId('firmName');
            const firmType = within(row).getByTestId('firmType');
            const address = within(row).getByTestId('address');
            expect(firmID).toBeInTheDocument();
            expect(firmName).toBeInTheDocument();
            expect(firmType).toBeInTheDocument();
            expect(address).toBeInTheDocument();
        });
    });

    it('displays an error message when the API call fails', async () => {
        getInvestors.mockRejectedValue(new Error('connection failed'));

        renderWithRouter(<InvestorsTable/>);

        const errorMessage = await screen.findByText('Error: connection failed');
        expect(errorMessage).toBeInTheDocument();

    });

    it('displays a message when no investors are found', async () => {
        getInvestors.mockResolvedValue({data: []});

        renderWithRouter(<InvestorsTable/>);

        const noInvestors = await screen.findByText('No investors found');
        expect(noInvestors).toBeInTheDocument();
    });

    it('navigates to investor details when clicks row', async () => {
        getInvestors.mockResolvedValue(investorsResponse);

        renderWithRouter(<InvestorsTable/>);

        const loading = await screen.findByText('Loading...');
        await waitForElementToBeRemoved(loading);

        const firstRow = screen.getAllByRole('row')[1];

        fireEvent.click(firstRow);

        expect(mockNavigate).toHaveBeenCalledWith('/investors/1111');
    });
});

const renderWithRouter = (component) => {
    render(
        <MemoryRouter>{component}</MemoryRouter>
    );
}