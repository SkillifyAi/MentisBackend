import mongoose from "mongoose"
import utils from "./utils.js"
const User = mongoose.model('User')
import moment from "moment"
import { register } from "module"
import Therapist from "../models/TherapistCard.js"

const handleLogin = async (req, res, next) => {

    if(req.cookies.token) {
        res.status(400).json({succes: false, error: "You are already logged in"})
        return 
    } 

    try {
        const user = await User.findOne({email: req.body.email})
        
        if(!user)
            return res.status(401).json({succes: false, error: "Could not find user"})

        const isValid = utils.validPassword(req.body.password, user.hash, user.salt)

        console.log(isValid);
        
        if(isValid) {
            const jwt = utils.issueJWT(user)
            const jwtTimeParts = jwt.expires.split(" ")
            const expiryTime = moment().add(jwtTimeParts[0], jwtTimeParts[1]).toDate()
        
            res.cookie('token', jwt.token, {
                expires:  expiryTime,
                httpOnly: true,
                secure: false,
                sameSite: 'Lax'
            })
            
            req.user = user
            return res.status(200).json({succes: true, user: user})
        } else {
            return res.status(401).json({succes: false, error: "Invalid password"})
        }   
    } catch(err) {
        return res.status(500).json({succes: false, error: err})
    }

}

const handleSignUp = async (req, res, next) => {

    
    if(req.cookies.token) {
        return res.status(400).json({succes: false, error: "You can`t create an account while you are logged in"})    
    } 
   

    try {
        
        const user = await User.findOne({email: req.body.email})
        if(user){
            return res.status(400).json({succes: false, error: "User already exists"})
        }       
        
        const saltHash = utils.genPassword(req.body.password)

        const salt = saltHash.salt
        const hash = saltHash.hash

        const newUser = new User({
            username: req.body.name.trim() + " " + req.body.surname.trim(),
            email: req.body.email.trim(),
            role: req.body.role,
            hash: hash,
            salt: salt,
            question: req.body.role === "member" ? false : true 
        })
        try {
            const user = await newUser.save()
            const jwt = utils.issueJWT(user)
    
            const jwtTimeParts = jwt.expires.split(" ")
    
            const expiryTime = moment().add(jwtTimeParts[0], jwtTimeParts[1]).toDate()
    
            res.cookie('token', jwt.token, {
                expires:  expiryTime,
                httpOnly: true,
                secure: false,
                sameSite: 'Lax'
            })
    
            return res.status(200).json({succes: true, user: user})
        } catch (err) {
            console.log(err);
            return res.status(500).json({succes: false, error: "Something went wrong, please try again"})
        }} catch (err) {
            console.log(err);
            return res.status(500).json({succes: false, error: "Something went wrong, please try again"})
}

}

const handleGoogleLogin = async (req, res , next) => {
    if(req.cookies.token) {
        return res.status(400).json({succes: false, error: "You are already logged in"})    
    } 

    try {
        const user = await User.findOne({email: req.body.email})
        if(user)
        {
            const jwt = utils.issueJWT(user)
            const expiryTime = moment().add(jwt.expires[0] + jwt.expires[1], 'days').toDate()
            
            res.cookie('token', jwt.token, {
                expires:  expiryTime,
                httpOnly: true,
                secure: false,
                sameSite: 'Lax'
            })
            
            await user.save()
            return res.status(200).json({succes: true, user: user})
        }
        const newUser = new User({
            username: req.body.name,
            email: req.body.email,
            
        })
        const newUserData = await newUser.save()
        const jwt = utils.issueJWT(newUserData)

        
        const expiryTime = moment().add(jwt.expires[0] + jwt.expires[1], 'days').toDate()
        
        
        res.cookie('token', jwt.token, {
            expires:  expiryTime,
            httpOnly: true,
            secure: false,
            sameSite: 'Lax'
        })

        
        return res.status(200).json({succes: true, user: newUserData})

    } catch (err) {
        console.log(err);
        return res.status(500).json({succes: false, error: err})
    }

}

const handleGetData = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        const therapist = await Therapist.findOne({userId: req.userId})

        let userData 

        // console.log(therapist);
        

        if(therapist)
        {
            userData = {
                id: user.id, 
                email: user.email, 
                username: user.username, 
                role: user.role,
                question: user.question,
                diagnoses: user.diagnoses,
                registered: user.registered,
                phone: therapist.phone || "",                 // Phone, fallback to empty string if undefined
                location: therapist.location || "",           // Location, fallback to empty string if undefined
                bio: therapist.bio || "",                     // Bio, fallback to empty string if undefined
                yearsOfExperience: therapist.yearsOfExperience || "", // Years of experience, fallback to empty string if undefined
                hourlyRate: therapist.hourlyRate || "",            // Hourly rate, fallback to empty string if undefined
                languages: therapist.languages || [],              // Languages, fallback to empty array if undefined
                newLanguage: therapist.newLanguage || "",          // New language, fallback to empty string if undefined
                qualifications: therapist.qualifications || "",    // Qualifications, fallback to empty string if undefined
                licenseNumber: therapist.licenseNumber || "",      // License number, fallback to empty string if undefined
                specialization: therapist.specialization || [],    // Specialization, fallback to empty array if undefined
                availability: {
                  monday: therapist.availability?.monday || false,
                  tuesday: therapist.availability?.tuesday || false,
                  wednesday: therapist.availability?.wednesday || false,
                  thursday: therapist.availability?.thursday || false,
                  friday: therapist.availability?.friday || false,
                  saturday: therapist.availability?.saturday || false,
                  sunday: therapist.availability?.sunday || false,
                },
                timeSlots: therapist.timeSlots || []              // Time slots, fallback to empty array if undefined
              };

            
        } else 
        {
            userData = {
                id: user.id, 
                email: user.email, 
                username: user.username, 
                role: user.role,
                diagnoses: user.diagnoses
            }
        }

          res.status(200).json({succes: true, user: userData})
         
    } catch (err) {
        console.log(err);
        res.status(500).json({succes: false, error: err})
    }
}

const handleChangeRole = async (req, res) => {
    try {
        // Find the user by ID
        const user = await User.findById(req.userId);
    
        if (!user) {
          throw new Error("User not found");
        }
        
        console.log(req.body);
        
        // Change the role
        user.role = req.body.value
        
        if(user.role === "member")
        {
            user.question = false
        }
        
        // Save the updated user
        await user.save();
        
        res.status(200).json({succes: true, user: user})
      } catch (error) {
        console.error("Error changing user role:", error.message);
        throw error;
      }
}

const handleLogout = (req, res) => {
    // Clear the token cookie
    res.clearCookie('token', { path: '/' }); // Clear the 'token' cookie
  
    // Send a response indicating successful logout
    res.status(200).json({ message: 'Logged out successfully' });
  };
export {
    handleLogin, 
    handleSignUp,
    handleGoogleLogin, 
    handleGetData, 
    handleChangeRole,
    handleLogout
}