import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Pass from "../models/Pass.js";
import Email from "../models/Email.js";
import Cpf from "../models/Cpf.js";
import Cnpj from "../models/Cnpj.js";
import Domain from "../models/Domain.js";
import User from "../models/User.js";
import Auth from "../middleware/auth.js";


const router = Router();

//////////////////////////////////////////////////////////////////////////////////////// ROUTES ///////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/', (req, res) => res.redirect('/Generator.html'));

router.post('/pass', Auth.isAuthenticated, async (req, res) => {
  
  try {

    const pass = Number(req.body.carac);

    const newPass = await Pass.generatePass(pass);

    res.json(newPass);

  } catch(error) {

    throw new Error('Error in create pass');

  };
});

router.post('/email', Auth.isAuthenticated, async (req, res) => {

  try {

    const email = req.body;

    const newEmail = await Email.create(email);

    res.json(newEmail);

  } catch(error) {

    throw new Error('Error in create email');

  };
});

router.get('/domains', Auth.isAuthenticated, async (req, res) => {

  try {

    const domains = await Domain.readAll();

    res.json(domains);

  } catch(error) {
    throw new Error('Error in list domais');
  };
});

router.post('/cpf', Auth.isAuthenticated, async (req, res) => {

  try {

    const cpf = req.body.mascara;

    const newCPF = await Cpf.create(cpf);

    res.json(newCPF);

  } catch(error) {

    throw new Error('Error in create cpf');
  };
});

router.post('/cnpj', Auth.isAuthenticated, async (req, res) => {

  try {

    const cnpj = req.body.mascara;

    const newCNPJ = await Cnpj.create(cnpj);
    
    res.json(newCNPJ);
    
  } catch(error) {

    throw new Error('Error in create cnpj');  
  };
});

router.post('/signup', async (req, res) => {
  const data = req.body;
  res.json(await User.signup(data));
});

router.post('/signin', async (req, res) => {
  try {
    const content = req.body;

    const user = await User.signin(content);

    if (!user) {
      throw new Error('User not found');
    }

    const { id: userId, password: hash } = user;

    console.log(hash)

    const match = await bcrypt.compareSync(password, hash);

    if (match) {
      const token = jwt.sign(
        { userId },
        process.env.SECRET,
        { expiresIn: 3600 } // 1h
      );

      res.json({ auth: true, token });
    } else {
      throw new Error('User not found');
    }
  } catch(error) {
    res.status(401).json({ error: 'User not found' });
  }
});

router.use(function(error, req, res, next) {
  console.error(error.stack);

  res.status(500).json({
    message: 'Something broke!'
  });
});

export default router;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////