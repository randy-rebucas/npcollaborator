import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

interface ConnectionState {
  isConnected: boolean;
}

const state: ConnectionState = {
  isConnected: false,
};

export async function connect(): Promise<void> {
  if (state.isConnected) {
    return;
  }

  try {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    await mongoose.connect(MONGODB_URI as string, opts);
    
    state.isConnected = true;
    console.log('Successfully connected to MongoDB.');

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      state.isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
      state.isConnected = false;
    });

  } catch (error) {
    state.isConnected = false;
    console.error('Error connecting to MongoDB:', error);
    throw new Error(
      `Failed to connect to MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function disconnect(): Promise<void> {
  if (!state.isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    state.isConnected = false;
    console.log('Successfully disconnected from MongoDB.');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw new Error(
      `Failed to disconnect from MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export default connect;