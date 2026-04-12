const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const multer = require('multer');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const winston = require('winston');
const redux = require('redux');
const dotenv = require('dotenv');

dotenv.config();

const logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console()]
});

const app = express();

app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => {
  logger.info('Root endpoint called');
  res.json({
    message: 'Project C - Large',
    timestamp: moment().format(),
    id: uuidv4()
  });
});

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'File uploaded', file: req.file });
});

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

app.post('/validate', (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details });
  res.json({ message: 'Valid' });
});

app.post('/hash', async (req, res) => {
  const hash = await bcryptjs.hash(req.body.password, 10);
  res.json({ hash });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app; 
