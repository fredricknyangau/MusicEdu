require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const authRoutes = require('./routes/authRoute');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/db');
const crypto = require('crypto');
const instrumentRoutes = require('./routes/instrumentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');


const app = express();
const PORT = process.env.PORT || 3000;

// Function to generate a new secret key
const generateSecretKey = (keyName) => {
    const secret = crypto.randomBytes(64).toString('hex');
    console.log(`Generated ${keyName}:`, secret);
    
    // Save the secret to .env file if it doesn't already exist
    const envPath = path.join(__dirname, '.env');
    
    if (!fs.existsSync(envPath)) {
        fs.writeFileSync(envPath, `${keyName}=${secret}\n`);
    } else {
        // Append the secret to .env file only if it doesn't exist
        const envContent = fs.readFileSync(envPath, 'utf-8');
        if (!envContent.includes(keyName)) {
            fs.appendFileSync(envPath, `${keyName}=${secret}\n`);
        }
    }

    return secret; // Return the generated secret
};

// Check for SESSION_SECRET and JWT_SECRET
const sessionSecret = process.env.SESSION_SECRET || generateSecretKey('SESSION_SECRET');
const jwtSecret = process.env.JWT_SECRET || generateSecretKey('JWT_SECRET');

// Log secrets to verify they're being read correctly
console.log('Using SESSION_SECRET:', sessionSecret);
console.log('Using JWT_SECRET:', jwtSecret);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Path to serve static files
app.use(express.urlencoded({ extended: true })); // To support URL-encoded bodies

// Session middleware
const session = require('express-session');
app.use(session({
    secret: sessionSecret, // Use the session secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// API Routes
app.use('/auth', authRoutes); // Use the authentication routes
app.use('/api/instruments', instrumentRoutes);
app.use('/api/categories', categoryRoutes);

// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Musical Instruments API',
            version: '1.0.0',
            description: 'API documentation for musical instruments project',
        },
        servers: [{ url: `http://localhost:${PORT}` }],
    },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Home Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve the home page
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
