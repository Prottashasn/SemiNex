// Email service utility for sending various types of emails
const nodemailer = require('nodemailer');

// Create a transporter object
const createTransporter = () => {
  // For production, use actual SMTP credentials
  // For development, we'll use a test account or console log the email content
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } else {
    // For development, log emails instead of sending
    return {
      sendMail: (mailOptions) => {
        console.log('========== EMAIL WOULD BE SENT ==========');
        console.log('To:', mailOptions.to);
        console.log('Subject:', mailOptions.subject);
        console.log('Text:', mailOptions.text);
        console.log('HTML:', mailOptions.html);
        console.log('========================================');
        return Promise.resolve({ messageId: 'test-message-id' });
      }
    };
  }
};

// Send registration confirmation email
exports.sendRegistrationConfirmation = async (registration, seminar) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'seminex@example.com',
      to: registration.email,
      subject: `Registration Confirmed: ${seminar.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Registration Confirmed</h2>
          <p>Dear ${registration.studentName},</p>
          <p>Your registration for the following seminar has been confirmed:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="margin-top: 0;">${seminar.title}</h3>
            <p><strong>Date:</strong> ${new Date(seminar.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${seminar.time}</p>
            <p><strong>Venue:</strong> ${seminar.venue}</p>
            <p><strong>Speaker:</strong> ${seminar.speaker}</p>
          </div>
          <p>Please arrive 15 minutes before the scheduled start time.</p>
          <p>If you have any questions, please contact us.</p>
          <p>Thank you,<br>SemiNex Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Registration confirmation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending registration confirmation email:', error);
    throw error;
  }
};

// Send seminar reminder email (to be sent 24 hours before the seminar)
exports.sendSeminarReminder = async (registration, seminar) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'seminex@example.com',
      to: registration.email,
      subject: `Reminder: ${seminar.title} - Tomorrow`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Seminar Reminder</h2>
          <p>Dear ${registration.studentName},</p>
          <p>This is a friendly reminder that you are registered for the following seminar tomorrow:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="margin-top: 0;">${seminar.title}</h3>
            <p><strong>Date:</strong> ${new Date(seminar.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${seminar.time}</p>
            <p><strong>Venue:</strong> ${seminar.venue}</p>
            <p><strong>Speaker:</strong> ${seminar.speaker}</p>
          </div>
          <p>Please arrive 15 minutes before the scheduled start time.</p>
          <p>We look forward to seeing you!</p>
          <p>Thank you,<br>SemiNex Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Seminar reminder email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending seminar reminder email:', error);
    throw error;
  }
};

// Send certificate issuance email
exports.sendCertificateEmail = async (certificate, registration, seminar) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'seminex@example.com',
      to: registration.email,
      subject: `Your Certificate for ${seminar.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Certificate of Participation</h2>
          <p>Dear ${registration.studentName},</p>
          <p>Thank you for attending the seminar on "${seminar.title}". We are pleased to issue you a certificate of participation.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="margin-top: 0;">Certificate Details</h3>
            <p><strong>Certificate Number:</strong> ${certificate.certificateNumber}</p>
            <p><strong>Verification Code:</strong> ${certificate.verificationCode}</p>
            <p><strong>Issue Date:</strong> ${new Date(certificate.issueDate).toLocaleDateString()}</p>
          </div>
          <p>You can view and download your certificate by logging into your account or by using the certificate verification tool on our website.</p>
          <p>Thank you for your participation!</p>
          <p>Best regards,<br>SemiNex Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Certificate email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending certificate email:', error);
    throw error;
  }
};

// Send feedback request email
exports.sendFeedbackRequest = async (registration, seminar) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'seminex@example.com',
      to: registration.email,
      subject: `Please Share Your Feedback: ${seminar.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>We Value Your Feedback</h2>
          <p>Dear ${registration.studentName},</p>
          <p>Thank you for attending the seminar on "${seminar.title}". We hope you found it informative and valuable.</p>
          <p>We would greatly appreciate your feedback to help us improve future seminars.</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="http://localhost:5173/feedback/${registration._id}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Provide Feedback</a>
          </div>
          <p>Your input is invaluable to us and will help us enhance our future events.</p>
          <p>Thank you,<br>SemiNex Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Feedback request email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending feedback request email:', error);
    throw error;
  }
};

// Send seminar cancellation email
exports.sendSeminarCancellation = async (registration, seminar) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'seminex@example.com',
      to: registration.email,
      subject: `Important: Seminar Cancellation - ${seminar.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Seminar Cancellation Notice</h2>
          <p>Dear ${registration.studentName},</p>
          <p>We regret to inform you that the following seminar has been cancelled:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="margin-top: 0;">${seminar.title}</h3>
            <p><strong>Originally Scheduled For:</strong> ${new Date(seminar.date).toLocaleDateString()} at ${seminar.time}</p>
            <p><strong>Venue:</strong> ${seminar.venue}</p>
          </div>
          <p>We apologize for any inconvenience this may cause. If you have any questions or concerns, please don't hesitate to contact us.</p>
          <p>Thank you for your understanding.</p>
          <p>Sincerely,<br>SemiNex Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Seminar cancellation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending seminar cancellation email:', error);
    throw error;
  }
};