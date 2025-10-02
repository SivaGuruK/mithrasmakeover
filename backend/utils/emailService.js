const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBookingConfirmation = async (booking) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: booking.customer.email,
    subject: 'Booking Confirmation - Mithras Makeover',
    html: `
<h2>Booking Under Review</h2>
<p>Dear ${booking.customer.name},</p>
<p>Thank you for your booking request with Mithra's Makeover. We have received your request for <strong>${new Date(booking.appointmentDate).toDateString()}</strong> at <strong>${booking.appointmentTime}</strong>.</p>
<p><strong>Services Requested:</strong></p>
<ul>
  ${booking.services.map(s => `<li>${s.service.title} - ₹${s.price}</li>`).join('')}
</ul>
<p><strong>Total Amount:</strong> ₹${booking.totalAmount}</p>
<p>Our team is currently reviewing our availability for the scheduled date. We will get back to you shortly with a confirmation.</p>
<p>Thank you for choosing Mithra's Makeover. We look forward to helping you look and feel your best!</p>
<p>Best regards,<br>The Mithra's Makeover Team</p>
    `
  };

  return transporter.sendMail(mailOptions);
};

const sendBookingReminder = async (booking) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: booking.customer.email,
    subject: 'Appointment Reminder - Mithras Makeover',
    html: `
      <h2>Appointment Reminder</h2>
      <p>Dear ${booking.customer.name},</p>
      <p>This is a reminder for your appointment tomorrow at ${booking.appointmentTime}.</p>
      <p>We look forward to seeing you!</p>
      <p>Best regards,<br>Mithra's Makeover Team</p>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendBookingConfirmation,
  sendBookingReminder
};
