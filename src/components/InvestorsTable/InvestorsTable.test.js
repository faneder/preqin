import React from 'react';
import {fireEvent, render, screen, waitForElementToBeRemoved} from '@testing-library/react';
import {getInvestors} from '../../api/investorApi';
import InvestorsTable from './InvestorsTable';
import {MemoryRouter} from 'react-router-dom';

jest.mock('../../api/investorApi');

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

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
        getInvestors.mockRejectedValue(new Error('connection failed'));

        renderWithRouter(<InvestorsTable/>);
        expect(screen.getByText('Loading...')).toBeInTheDocument();

        await screen.findByText('Error: connection failed');
    });

    it('displays a message when no investors are found', async () => {
        getInvestors.mockResolvedValue({data: []});

        renderWithRouter(<InvestorsTable/>);

        const loading = await screen.findByText('Loading...');
        await waitForElementToBeRemoved(loading);

        expect(screen.getByText('No investors found')).toBeInTheDocument();
    });

    it('navigates to investor details when clicks row', async () => {
        mockGetInvestorsResponse();

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

    getInvestors.mockResolvedValue({data: response});

    return response;
};