import axios from 'axios';
import {getInvestorCommitments, getInvestors} from './investorApi';
import AuthService from '../services/AuthService';
import {INVESTOR_URL, INVESTOR_COMMITMENTS_URL} from "../config/config";

jest.mock('axios');
jest.mock('../services/AuthService');

const ACCESS_TOKEN = 'test-token';

describe('Investor API', () => {
    describe('getInvestorsByFirmIds', () => {
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

            const actual = await getInvestors(firmIds);

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

            axios.get.mockRejectedValue(error);

            await expect(getInvestors(firmIds)).rejects.toThrow('Request failed');
        });
    });

    describe('getCommitmentByAssetClassAndInvestorId', () => {
        const mockAssetClass = 'pe';
        const mockInvestorId = '777';
        const mockUrl = `${INVESTOR_COMMITMENTS_URL}/${mockAssetClass}/${mockInvestorId}`;
        const mockData = {data: 'mockData'};

        it('fetches data correctly', async () => {
            mockAuthService('test-token');
            axios.get.mockResolvedValue(mockData);

            const data = await getInvestorCommitments(mockAssetClass, mockInvestorId);

            expect(axios.get).toHaveBeenCalledWith(mockUrl, {headers: {Authorization: `Bearer ${ACCESS_TOKEN}`}});
            expect(data).toBe(mockData.data);
        });

        it('throws an error when the request fails', async () => {
            const mockError = new Error('Request failed');
            axios.get.mockRejectedValueOnce(mockError);

            await expect(getInvestorCommitments(mockAssetClass, mockInvestorId)).rejects.toThrow(mockError);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});

const mockAuthService = (accessToken) => {
    AuthService.mockImplementation(() => {
        return {
            getAccessToken: jest.fn().mockResolvedValue(accessToken),
        };
    });
}