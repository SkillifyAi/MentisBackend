import Therapist from "../models/TherapistCard.js";
import mongoose from "mongoose"
const User = mongoose.model('User')


const handleRegister = async (req, res) => {
  try {
    const {
      id,
      firstName,
      lastName,
      email,
      phone,
      location,
      bio,
      yearsOfExperience,
      hourlyRate,
      languages,
      newLanguage,
      qualifications,
      licenseNumber,
      specialization,
      availability,
      timeSlots
    } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let therapist = await Therapist.findOne({ email: email });

    // Update user info regardless of therapist state
    user.username = `${firstName} ${lastName}`;
    user.email = email;
    user.registered = true;
    await user.save();

   

    if (!therapist) {
      // Create new therapist
      therapist = new Therapist({
        userId: req.userId,
        firstName,
        lastName,
        email,
        phone,
        location,
        bio,
        yearsOfExperience,
        hourlyRate,
        languages,
        newLanguage,
        qualifications,
        licenseNumber,
        specialization,
        availability,
        timeSlots
      });
    } else {
      // Update existing therapist
      therapist.firstName = firstName;
      therapist.lastName = lastName;
      therapist.email = email;
      therapist.phone = phone;
      therapist.location = location;
      therapist.bio = bio;
      therapist.yearsOfExperience = yearsOfExperience;
      therapist.hourlyRate = hourlyRate;
      therapist.languages = languages;
      therapist.newLanguage = newLanguage;
      therapist.qualifications = qualifications;
      therapist.licenseNumber = licenseNumber;
      therapist.specialization = specialization;
      therapist.availability = availability;
      therapist.timeSlots = timeSlots;
    }

    const savedTherapist = await therapist.save();

    res.status(201).json({
      message: 'Therapist profile saved successfully!',
      therapist: savedTherapist
    });

  } catch (error) {
    console.error('Error saving therapist:', error);
    res.status(500).json({ message: 'Error saving therapist, please try again.' });
  }
};


const handlePlan = async (req, res) => {
  try {
    const therapist = await Therapist.findOne({ userId: req.userId });

    if (!therapist) {
      return res.status(404).json({ message: 'You need to register first' });
    }

    // Update therapist's plan (example: upgrading to premium)
    therapist.plan = req.body.plan || 'free';
    await therapist.save();

    res.status(200).json({ message: 'Plan updated successfully', therapist });
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTherapists = async (req, res) => {
  try {
    const {category, diagnoses, page}  = req.body; // Specialization is sent in the request body

    console.log(category);
    
    let specialization 

    if(category?.length === 0)
    {
      if(diagnoses?.length === 0)
      {
        specialization = [
          'Anxiety',
          'Depression',
          'Trauma',
          'Relationship Issues',
          'Child Therapy',
          'Family Therapy',
          'Addiction',
          'OCD',
          'PTSD',
          'Eating Disorders',
          'LGBTQ+ Issues',
          'Stress Management'
        ];
      } else 
        specialization = diagnoses
    } else 
      specialization = category

    const pageSize = 10

    const skip = (page - 1) * pageSize; // Calculate how many documents to skip based on the page number

    // MongoDB aggregation pipeline
    const therapists = await Therapist.aggregate([
      {
        // Add a field that counts the number of specialization matches
        $addFields: {
          specializationMatches: {
            $size: {
              $setIntersection: ["$specialization", specialization] // Count matching specializations
            }
          }
        }
      },
      {
        $match: {
          specializationMatches : { $gt: 0 }
        }
      },
      {
        // Sort by number of specialization matches (descending)
        $sort: { specializationMatches: -1 }
      },
      {
        // Sort by plan (Gold > Silver > Free)
        $addFields: {
          planPriority: {
            $switch: {
              branches: [
                { case: { $eq: ["$plan", "Gold"] }, then: 1 },
                { case: { $eq: ["$plan", "Silver"] }, then: 2 },
                { case: { $eq: ["$plan", "Free"] }, then: 3 }
              ],
              default: 4 // Default in case the plan is not Gold, Silver, or Free
            }
          }
        }
      },
      {
        // Sort by plan priority (Gold > Silver > Free)
        $sort: { planPriority: 1 }
      }, 
      {
        $skip: skip
      },
      {
        // Limit the number of results to 15
        $limit: pageSize
      }
    ]);

    const totalPages = Math.floor(therapists.length / pageSize) + 1 
    // Send the list of therapists in the response
    res.status(200).json({therapists, totalPages: totalPages});
  } catch (error) {
    console.error('Error fetching therapists:', error);
    res.status(500).json({ message: 'Error fetching therapists, please try again.' });
  }
};


export {
  handleRegister,
  handlePlan,
  getTherapists
}