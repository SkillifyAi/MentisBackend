import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const User = mongoose.model('User')

dotenv.config();


const message = `You are a clinical mental health assistant. You will receive a list of question-answer pairs, 
where each question relates to a specific psychological symptom, and each answer is provided by a patient.
Your task is to carefully analyze the patient’s responses and determine which of the following specializations best fit their current mental health needs. You can choose multiple if relevant, but only include those that clearly apply based on the answers.
`

const array = `Return your response as a JSON array, where each item is a string representing a matching specialization from this list:

[
  "Anxiety",
  "Depression",
  "Trauma",
  "Relationship Issues",
  "Child Therapy",
  "Family Therapy",
  "Addiction",
  "OCD",
  "PTSD",
  "Eating Disorders",
  "LGBTQ+ Issues",
  "Stress Management"
]`
// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.API_KEY, // Make sure this is set in your .env file
});

// Controller for handling the question
const handleQuestion = async (req, res) => {
  const model = "gpt-4o"; // The most recent model (April 2024)

  console.log("da");
  
  try {

    const user = await User.findById(req.userId)
    
    console.log(user.role);
    
    if(user.role === "therapist")
    {
        res.status(401).json({error: "You are a therapist"})
        return
    }
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "You are licensed therapist" },
        { role: "user", content: message + JSON.stringify(req.body) + "\n" + array}
      ],
      response_format: {type: "json_object"},
      temperature: 0.1
    });

    
    // const modifiedString = completion.choices[0].message.content.slice(7, -3);

    // console.log(modifiedString);
    console.log(completion.choices[0].message.content); 

    
    const data = JSON.parse(completion.choices[0].message.content)

    console.log(data);
    
    const diagnoses = data[Object.keys(data)]
    
    user.diagnoses = diagnoses

    console.log(diagnoses);
    
    await user.save()

    return res.status(200).json({});



  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Failed to generate a response",
    });
  }
};


export {
  handleQuestion
};
