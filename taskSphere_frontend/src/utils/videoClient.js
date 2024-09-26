import { StreamVideoClient, User } from '@stream-io/video-react-sdk';

const apiKey = 'your-api-key';  // Add your Stream API key here
const userId = 'user-id';       // Use the current user ID from authentication state
const token = 'authentication-token';  // This should be generated on the server-side

const user = {
  id: userId,
};

// Initialize the client
const client = new StreamVideoClient({ apiKey, token, user });

export default client;
