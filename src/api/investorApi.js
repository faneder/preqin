import axios from 'axios';
import AuthService from '../services/authService';
import {
    BASE_URL,
    INVESTOR_URL,
    AUTH_CONNECT_TOKEN_URL,
    USERNAME,
    APIKEY,
    INVESTOR_COMMITMENTS_URL
} from "../config/config";

export const getInvestors = async (firmIds) => {
    try {
        const token = await new AuthService(BASE_URL).getAccessToken(USERNAME, APIKEY, AUTH_CONNECT_TOKEN_URL);
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            params: {
                firmId: firmIds.join(',')
            }
        };
        const response = await axios.get(INVESTOR_URL, config);

        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getInvestorCommitments = async (assetClass, investorId) => {
    try {
        const token = await new AuthService(BASE_URL).getAccessToken(USERNAME, APIKEY, AUTH_CONNECT_TOKEN_URL);
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };

        const url = `${INVESTOR_COMMITMENTS_URL}/${assetClass}/${investorId}`;

        const response = await axios.get(url, config);

        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};