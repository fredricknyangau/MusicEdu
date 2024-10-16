const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Import Models
const User = require('./models/User');
const UserInteraction = require('./models/UserInteraction');
const Feedback = require('./models/Feedback');
const SecurityLog = require('./models/SecurityLog');
const Instrument= require('./models/Instrument');

const app = express();
const PORT = 3000; // Define the port number

// MongoDB connection string (replace <db_password> with your password)
const uri = "mongodb+srv://Admin:xtzPnKO60GccUK2P@backenddb.oinf5.mongodb.net/backendDB?retryWrites=true&w=majority";

// Middleware
app.use(express.json()); // To handle JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // To handle form data (optional)
app.use(express.static('public')); // Serve static files like HTML, CSS, JS

// Connect to MongoDB using Mongoose
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB using Mongoose!'))
  .catch((error) => console.error('MongoDB connection failed:', error));

// JWT Secret
const JWT_SECRET = 'your_jwt_secret'; // Replace with your secret

// Middleware for Authentication
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.sendStatus(403); // Forbidden
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user; // Attach user info to request
    next();
  });
};

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Musical Instruments API',
      version: '1.0.0',
      description: 'API documentation for musical instruments project',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./index.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Home Route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html'); // Serve homepage
});

// Registration Route with Validation
app.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('username').notEmpty().withMessage('Username is required'),
  body('role').notEmpty().withMessage('Role is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, username, role } = req.body;

  try {
    // Check if the user already exists in the MongoDB database
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to MongoDB using Mongoose
    const newUser = new User({ name, email, password: hashedPassword, username, role });
    await newUser.save();

    res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    // Send the token and user ID back
    res.status(200).json({ message: 'Login successful!', token, userId: user._id });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new instrument
app.post('/instruments', authenticateJWT, async (req, res) => {
  const { name } = req.body; // Get the instrument name from the request body

  try {
    const newInstrument = new Instrument({ name }); // Create a new instrument
    await newInstrument.save();
    res.status(201).json(newInstrument);
  } catch (error) {
    console.error('Error creating instrument:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all instruments
app.get('/instruments', authenticateJWT, async (req, res) => {
  try {
    const instruments = await Instrument.find(); // Get all instruments
    res.status(200).json(instruments);
  } catch (error) {
    console.error('Error fetching instruments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete an instrument
app.delete('/instruments/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    await Instrument.findByIdAndDelete(id); // Delete instrument by ID
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting instrument:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to get user profile
app.get('/api/user/:id', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Find user by ID
    if (!user) return res.status(404).json({ error: 'User not found' });

    // You might want to exclude the password field
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      savedInstruments: user.savedInstruments // Assuming this field exists
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create User Interaction
app.post('/interactions', authenticateJWT, async (req, res) => {
  const { instrumentID, interactionType } = req.body;
  const userID = req.user.id; // Get user ID from JWT

  try {
    const newInteraction = new UserInteraction({ userID, instrumentID, interactionType });
    await newInteraction.save();
    res.status(201).json(newInteraction);
  } catch (error) {
    console.error('Error creating user interaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Interactions by User
app.get('/interactions/:userId', authenticateJWT, async (req, res) => {
  const { userId } = req.params;

  try {
    const interactions = await UserInteraction.find({ userID: userId }).populate('instrumentID');
    res.status(200).json(interactions);
  } catch (error) {
    console.error('Error fetching user interactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create Feedback
app.post('/feedback', authenticateJWT, [
  body('instrumentID').notEmpty().withMessage('Instrument ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').notEmpty().withMessage('Comment is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { instrumentID, rating, comment } = req.body;
  const userID = req.user.id;

  try {
    const newFeedback = new Feedback({ userID, instrumentID, rating, comment });
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Feedback by Instrument ID
app.get('/feedback/:instrumentId', async (req, res) => {
  const { instrumentId } = req.params;

  try {
    const feedback = await Feedback.find({ instrumentID: instrumentId }).populate('userID');
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
