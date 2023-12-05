import axios from 'axios';
import {getInvestorsByFirmIds} from './investorApi';
import AuthService from '../services/AuthService';
import {INVESTOR_URL} from "../config/config";

jest.mock('axios');
jest.mock('../services/AuthService');

const ACCESS_TOKEN = 'test-token';

describe('Investor API', () => {
    it('fetches investors by firm IDs successfully', async () => {
        const firmIds = [1, 2, 3];
        const expectedData = {
            data: [{
                "firmID": "2670",
                "firmName": "Fund",
                "firmType": "Private",
                "address": "address"
            }]
        };
        mockAuthService(ACCESS_TOKEN);
        axios.get.mockResolvedValue({data: expectedData});

        const actual = await getInvestorsByFirmIds(firmIds);

        expect(actual).toEqual(expectedData);
        expect(axios.get).toHaveBeenCalledWith(INVESTOR_URL, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
            },
            params: {
                firmId: '1,2,3'
            }
        });
    });

    it('throws error on request failure', async () => {
        const error = new Error('Request failed');
        const firmIds = [1, 2, 3];
        mockAuthService('test token');

        axios.get.mockRejectedValue(error);

        await expect(getInvestorsByFirmIds(firmIds)).rejects.toThrow('Request failed');
    });
});

const mockAuthService = (accessToken) => {
    AuthService.mockImplementation(() => {
        return {
            getAccessToken: jest.fn().mockResolvedValue(accessToken),
        };
    });
}