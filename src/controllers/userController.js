const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ['id', 'firstname', 'surname', 'email'],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createUser = async (req, res) => {
  try {
    const { firstname, surname, email, password, confirmPassword } = req.body;

    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ message: 'Invalid request body' });
    }

    // basic verification
    if (!firstname || !surname || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Password do not match' });
    }

    // check if email is already in use
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    // create user
    const newUser = await User.create({
      firstname,
      surname,
      email,
      password,
    });
    // console.log('New user created:', newUser);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);

    // generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      id: newUser.id,
      firstname: newUser.firstname,
      surname: newUser.surname,
      email: newUser.email,
      token, // return token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const authenticateUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // verify if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email or password is incorrect' });
    }
    // console.log('Password provided:', password);
    // console.log('Hashed password from DB:', user.password);
    // verify password
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    //console.log('Password is valid:', isPasswordValid);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email or password is incorrect' });
    }

    // generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, surname, email } = req.body;

    // verify if id in token is the same as id in params
    if (req.user.id !== parseInt(id, 10)) {
      return res.status(403).json({ message: 'You can only update your own profile' });
    }

    // basic validation
    if (!firstname || !surname || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // check if user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // update user data
    await User.update(
      { firstname, surname, email },
      { where: { id } }
    );

    res.status(204).send(); // No Content
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getUserById,
  createUser,
  authenticateUser,
  updateUser,
};