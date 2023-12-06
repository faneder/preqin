# Investor Portal Setup Guide

This guide provides detailed steps for setting up and running the Preqin Investor Portal application, a React-based web application that displays investor information and their commitments based on selected asset classes.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- Node.js (v12 or later)
- npm

## Installation

1. Clone the repository to your local machine using the following command:

```sh
git clone git@github.com:faneder/preqin.git
cd preqin
```

2. Install the project dependencies by running:

```sh
npm install
```

## Configuration

The application requires connection to an API with authentication. You'll need to configure the following environment variables:
- `USERNAME`: The username for API authentication.
- `APIKEY`: The API key for API authentication.

Create a `.env` file in the root directory and fill in the values for the environment variables:

```
USERNAME=your-username
APIKEY=your-apikey
```

## Running the Application

To start the application, run:

```sh
npm start
```

This command will start the application and open it in your default web browser. If it doesn’t automatically open, you can manually visit [http://localhost:3000](http://localhost:3000).

## Application Structure

- `App.js`: This is the entry file for our React application. It sets up the router and defines the routes.
- `components/InvestorsTable/InvestorsTable.js`: This component displays a list of investors fetched from the API.
- `components/InvestorPage/InvestorPage.js`: This component displays the commitment information for a selected investor and asset class.
- `api/investorApi.js`: Contains the API calls to fetch investors and their commitments.
- `services/authService.js`: Contains the authentication service used to get an access token.

## Testing

The application comes with a set of unit tests. To run these tests, execute:

```sh
npm test
```

## Deployment

```sh
npm run build
```
Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Troubleshooting

If you encounter any issues with the API calls, ensure your `.env` file is correctly set up with the right API endpoints and credentials.

For other issues, check the console for any error messages that might provide more insight into the problem.

## Contributing

We welcome contributions to the Investor Portal application. Please read our contribution guide for more information on how to submit pull requests.

## Support

If you need assistance, please send an email to support@preqin.com with a description of your problem.

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.

