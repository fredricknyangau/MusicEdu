const fs = require('fs');
const crypto = require('crypto');
require('dotenv').config();

const envFilePath = '.env';
const jwtSecretKey = 'JWT_SECRET';

// Check if JWT_SECRET is already present in the .env file
if (!process.env[jwtSecretKey]) {
    // Generate a new JWT secret using a random 256-bit key
    const newSecret = crypto.randomBytes(32).toString('hex');
    
    // Append the JWT secret to the .env file
    const envContent = `${jwtSecretKey}=${newSecret}\n`;
    fs.appendFileSync(envFilePath, envContent);

    console.log(`JWT secret generated and stored in .env file: ${newSecret}`);
} else {
    console.log(`JWT secret already exists in .env file: ${process.env[jwtSecretKey]}`);
}
