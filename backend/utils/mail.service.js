import { MailtrapClient } from "mailtrap";
// import { transporter } from "../config/EmailTransporter.js";

console.log(
  process.env.MAILTRAP_ENDPOINT,
  process.env.MAILTRAP_TOKEN,
  process.env,
  "TOKENNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN"
);
const client = new MailtrapClient({
  endpoint: "https://send.api.mailtrap.io/" || process.env.MAILTRAP_ENDPOINT,
  token: "3687a42681b2696d959306fc71889385" || process.env.MAILTRAP_TOKEN,
});
export const sendEmail = async (user, token) => {
  const sender = {
    email: "mailtrap@demomailtrap.com",
    name: "ZAIN RAZA",
  };
  const recipients = [
    {
      email: user.email,
      name: user?.name,
    },
  ];

  await client
    .send({
      from: sender,
      to: recipients,
      subject: "You are awesome!",
      text: "Your OTP is : " + token,
      category: "Integration Test",
    })
    .then(console.log, console.error);

  //   const mailOptions = {
  //     from: "zainrazahere987@gmail.com", // sender address
  //     template: "email", // the name of the template file, i.e., email.handlebars
  //     to: user.email,
  //     subject: `Welcome to My Company, ${user.name}`,
  //     context: {
  //       name: user.name,
  //       company: "my company",
  //     },
  //   };

  //   try {
  //     await transporter.sendMail(mailOptions);
  //   } catch (error) {
  //     console.log(`Nodemailer error sending email to ${user.email}`, error);
  //   }
};
