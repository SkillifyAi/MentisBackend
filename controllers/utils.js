import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import base64url from 'base64url';
import moment from 'moment';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const pathToPubKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const pathToPrivKey = path.join(__dirname, '..', 'id_rsa_priv.pem')

const PRIV_KEY = fs.readFileSync(pathToPrivKey, 'utf8');
const PUB_KEY = fs.readFileSync(pathToPubKey, 'utf8');

import mongoose from 'mongoose'
const User = mongoose.model('User');

/**
 * -------------- HELPER FUNCTIONS ----------------
 */

/**
 * 
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 * 
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */
function validPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

/**
 * 
 * @param {*} password - The password string that the user inputs to the password field in the register form
 * 
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 * 
 * ALTERNATIVE: It would also be acceptable to just use a hashing algorithm to make a hash of the plain text password.
 * You would then store the hashed password in the database and then re-hash it to verify later (similar to what we do here)
 */
function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    
    return {
      salt: salt,
      hash: genHash
    };
}


/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the MongoDB user ID
 */
function issueJWT(user) {
  const _id = user._id;

  const expiresIn = '30 days';

  const payload = {
    sub: _id,
    iat: Date.now()
  };
        

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn
  }
}

function authMiddleware(req, res, next) {

  const token = req.cookies.token
  
  if (!token) {
    return res.status(401).json({ message: 'You must log in before visiting this route' });
  }
  const tokenParts = token.split(' ')
  if (tokenParts[0] === 'Bearer' && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {

    try {
      const verification = jsonwebtoken.verify(tokenParts[1], PUB_KEY, { algorithms: ['RS256'] });
      req.jwt = verification
      next();
    } catch (err) {
      res.status(401).json({ succes: false, msg: "You must log in before visiting this route"})
    }
  }
  else {
    res.status(401).json({ succes: false, msg: "You must log in before visiting this route"})
  }
}

function getPayload (req, res, next) {

    const jwtToken = req.cookies.token.split(' ')[1]
    const jwtParts = jwtToken.split('.')
    const jwtPayload = jwtParts[1]

    const decodedPayload = base64url.decode(jwtPayload)

    const parsedPayload = JSON.parse(decodedPayload)
    
    req.userId = parsedPayload.sub
    
    next()
}




export default {getPayload, validPassword, genPassword, issueJWT, authMiddleware}