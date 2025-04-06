import express from 'express';
const router = express.Router();
import sendEmail from '../controllers/email.js';


// Set SendGrid API key
// Booking confirmation endpoint

router.post('/email', async (req, res) => {

  
  try {
    // await sendEmail(req.body.therapistEmail, req.body.username)
    res.status(200)
  } catch (err)
  {
    res.status(500)
  }

  // try {
  //   const { therapistEmail, date, time, sessionType, notes, clientName } = req.body;

  //   // 1. Save booking to MongoDB (implement your Booking model)
  //   // const booking = await Booking.create({ ... });

  //   // 2. Prepare email template
  //   const emailHtml = `
  //     <!DOCTYPE html>
  //     <html>
  //       <head>
  //         <meta charset="utf-8">
  //         <title>New Booking Notification</title>
  //         <style>
  //           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
  //           .header { color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px; }
  //           .booking-details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
  //           .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.9em; color: #7f8c8d; }
  //         </style>
  //       </head>
  //       <body>
  //         <div class="header">
  //           <h2>New Booking Notification</h2>
  //         </div>
          
  //         <p>Hello,</p>
  //         <p>You have a new booking through our platform:</p>
          
  //         <div class="booking-details">
  //           <h3 style="margin-top: 0; color: #3498db;">Booking Details</h3>
  //           <p><strong>Client Name:</strong> ${clientName || 'Not specified'}</p>
  //           <p><strong>Session Type:</strong> ${sessionType}</p>
  //           <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
  //           <p><strong>Time:</strong> ${time}</p>
  //           <p><strong>Notes:</strong> ${notes || 'None provided'}</p>
  //         </div>
          
  //         <p>This email was sent automatically from our booking system.</p>
          
  //         <div class="footer">
  //           <p>Best regards,</p>
  //           <p><strong>${process.env.COMPANY_NAME || 'Your Company'} Team</strong></p>
  //           <p>If you believe you received this email in error, please contact support.</p>
  //         </div>
  //       </body>
  //     </html>
  //   `;

  //   // 3. Send email via SendGrid
  //   const msg = {
  //     to: therapistEmail,
  //     from: {
  //       email: process.env.COMPANY_EMAIL,
  //       name: process.env.COMPANY_NAME || 'Your Company'
  //     },
  //     subject: 'New Therapy Session Booking',
  //     html: emailHtml,
  //     mail_settings: {
  //       sandbox_mode: {
  //         enable: process.env.NODE_ENV === 'test' // Enable only for tests
  //       }
  //     }
  //   };

  //   await sgMail.send(msg);

  //   res.status(201).json({ 
  //     success: true,
  //     message: 'Booking created and notification sent'
  //   });
  // } catch (error) {
  //   console.error('Booking error:', error);
    
  //   // Enhanced error handling for SendGrid
  //   if (error.response) {
  //     console.error('SendGrid error details:', error.response.body);
  //   }

  //   res.status(500).json({ 
  //     success: false,
  //     message: 'Error processing booking',
  //     error: process.env.NODE_ENV === 'development' ? error.message : undefined
  //   });
  // }
});

export default router