require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const session = require('express-session');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoute');
const instrumentRoutes = require('./routes/instrumentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const sessionStatusRoute = require('./routes/sessionStatus');

const app = express();
const PORT = process.env.PORT || 3000;

// Utility function to generate and save a secret key in .env if not already present
const generateSecretKey = (keyName) => {
    const secret = crypto.randomBytes(64).toString('hex');
    const envPath = path.join(__dirname, '.env');

    if (!fs.existsSync(envPath) || !fs.readFileSync(envPath, 'utf-8').includes(keyName)) {
        fs.appendFileSync(envPath, `${keyName}=${secret}\n`);
    }

    return secret;
};

// Set session and JWT secrets
const sessionSecret = process.env.SESSION_SECRET || generateSecretKey('SESSION_SECRET');
const jwtSecret = process.env.JWT_SECRET || generateSecretKey('JWT_SECRET');
console.log('Using SESSION_SECRET:', sessionSecret);
console.log('Using JWT_SECRET:', jwtSecret);

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));

// API Routes
app.use('/api', sessionStatusRoute);
app.use('/auth', authRoutes);
app.use('/api/instruments', instrumentRoutes);
app.use('/api/categories', categoryRoutes);

// Swagger setup
const swaggerDocs = swaggerJsDoc({
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
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Serve Home Page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
