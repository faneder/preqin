import axios from 'axios';

class AuthService {
    constructor(baseUrl) {
        this.api = axios.create({
            baseURL: baseUrl
        });
    }

    async getAccessToken(username, apikey, tokenUrl) {
        try {
            const response = await this.api.post(tokenUrl, {
                username,
                apikey
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })

            return response.data.access_token;
        } catch (error) {
            console.error(`Could not get access token: ${error}`)
            throw error;
        }
    }
}

export default AuthService;