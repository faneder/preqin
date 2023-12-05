import axios from 'axios';
import AuthService from './authService';

jest.mock('axios');

const BASE_URL = 'https://api.test.com'
const USERNAME = 'username';
const TOKEN_URL = 'https://api.test.com/token';
const API_KEY = 'apikey';

describe('AuthService', () => {
    let authService;
    let mockAxios;
    let setItemMock;

    beforeEach(() => {
        mockAxios = {
            post: jest.fn(),
        };
        axios.create = jest.fn(() => mockAxios);

        setItemMock = jest.spyOn(window.localStorage.__proto__, 'setItem');
        setItemMock.mockImplementation(jest.fn());

        authService = new AuthService(BASE_URL);
    });


    it('should call a POST request to get access token', async () => {
        const expectedAccessToken = 'token123';
        const response = {data: {access_token: expectedAccessToken}};
        mockAxios.post.mockResolvedValueOnce(response);

        const actual = await authService.getAccessToken(USERNAME, API_KEY, TOKEN_URL);

        expect(actual).toBe(expectedAccessToken)
        expect(mockAxios.post).toHaveBeenCalledWith(TOKEN_URL, {
            username: USERNAME,
            apikey: API_KEY,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
    });

    it('should throw an error if API call fails', async () => {
        const error = new Error('Request failed');
        mockAxios.post.mockRejectedValueOnce(error);

        await expect(authService.getAccessToken(USERNAME, API_KEY, TOKEN_URL)).rejects.toThrow('Request failed');
    });

    afterEach(() => {
        jest.clearAllMocks();
        setItemMock.mockRestore();
    });
});