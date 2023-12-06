import {render, screen, waitForElementToBeRemoved} from '@testing-library/react';
import App from './App';
import React from "react";
import {getInvestors} from "./api/investorApi";

jest.mock('./api/investorApi');

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const investorsResponse = {
    "data": [
        {
            firmID: '1111',
            firmName: 'Firm 1',
            firmType: 'Firm Type 1',
            address: 'Address 1',
        },
    ]
};

test('renders investor component as default page', async () => {
    getInvestors.mockResolvedValue(investorsResponse);

    render(<App/>);

    const loader = await screen.findByTestId('loader');
    expect(loader).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.queryByTestId('loader'));

    const errorMessage = await screen.findByText('Investors');
    expect(errorMessage).toBeInTheDocument();
});
