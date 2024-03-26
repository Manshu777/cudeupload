const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 8000;
require('dotenv').config();

const twilio = require('twilio');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);



// Configure Nodemailer with your Gmail account
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
     
    user:"rahulrajput82198@gmail.com",
    pass:"rahul@2001"
    }
});

 app.get("/hello" , (req,res)=>{
    res.send("Hello, world");
 })

app.post('/submit-form', async (req, res) => {
    const formData = req.body;

  

    // // Craft the message dynamically based on filled fields
    // let message = '\n';
    // for (const key in formData) {
    //     if (formData[key]) { // Check if field is filled
    //         message += `${key}: ${formData[key]}\n`;
    //     }
    // }

  console.log(formData)
const shiftTime = formData.shiftTime ? new Date(formData.shiftTime).toLocaleString() : '';

const htmlValue = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }
        h2 {
            color: #333;
        }
        ul {
            list-style-type: none;
            padding: 0;
        }
        li {
            margin-bottom: 10px;
        }
        li strong {
            margin-right: 5px;
        }
    </style>
</head>
<body>
<p>
Dear User,<br><br>
Thank you for your submission!<br><br>
We appreciate your time and effort in filling out our form. Below are the details you provided:<br><br>
<strong>Name:</strong> ${formData?.name}<br>
<strong>Phone Number:</strong> ${formData?.phoneNumber}<br>
${formData?.selectedCity ? `<strong>Selected City:</strong> ${formData?.selectedCity}<br>` : ""}
${formData?.shiftingfrom ? `<strong>Shifting From:</strong> ${formData.shiftingfrom}<br>` : ""}

${formData?.shiftingto ? `<strong>Shifting To:</strong> ${formData.shiftingto}<br>` : ""}
${formData?.destinationcity ? `<strong>Destination City:</strong> ${formData.destinationcity}<br>` : ""}
${formData?.cityTempo ? `<strong>City Tempo:</strong> ${formData.cityTempo}<br>` : ""}
${formData?.pickUpLocation ? `<strong>Pickup Location</strong> ${formData.pickUpLocation}<br>` : ""}
${formData?.dropOffLocation ? `<strong>DropOff Location</strong> ${formData.dropOffLocation}<br>` : ""}
${formData?.vehicleshiftingfrom ? `<strong>Vehicle Shifting From</strong> ${formData.vehicleshiftingfrom}<br>` : ""}
${formData?.vehicleshiftingto ? `<strong>Vehicle Shifting To</strong> ${formData.vehicleshiftingto}<br>` : ""}
${shiftTime ? `<strong>Shift Time:</strong> ${shiftTime}<br>` : ""}
We will get back to you as soon as possible.<br><br>
Best regards,<br>

</p>
</body>
</html>
`;

 let whatsappMessage = `Dear User,\n\nThank you for your submission!\n\nWe appreciate your time and effort in filling out our form. Below are the details you provided:\n\n- Name: ${formData?.name}\n- Phone Number: ${formData?.phoneNumber}\n${formData?.selectedCity ? `- Selected City: ${formData?.selectedCity}\n` : ""}${formData?.shiftingfrom ? `- Shifting From: ${formData.shiftingfrom}\n` : ""}${formData?.shiftingto ? `- Shifting To: ${formData.shiftingto}\n` : ""}${formData?.destinationcity ? `- Destination City: ${formData.destinationcity}\n` : ""}${formData?.cityTempo ? `- City Tempo: ${formData.cityTempo}\n` : ""}${formData?.pickUpLocation ? `- Pickup Location: ${formData.pickUpLocation}\n` : ""}${formData?.dropOffLocation ? `- DropOff Location: ${formData.dropOffLocation}\n` : ""}${formData?.vehicleshiftingfrom ? `- Vehicle Shifting From: ${formData.vehicleshiftingfrom}\n` : ""}${formData?.vehicleshiftingto ? `- Vehicle Shifting To: ${formData.vehicleshiftingto}\n` : ""}${shiftTime ? `- Shift Time: ${shiftTime}\n` : ""}\nWe will get back to you as soon as possible.\n\nBest regards,`;




    const apikey = '37c57f0985af4aacab7836d4eb478981';
    const mobile = '917876150485'; 

    // const url = `https://api.bulkwhatsapp.net/wapp/api/send?apikey=${apikey}&mobile=${mobile}&msg=${encodeURIComponent(message)}`;
     
    try {
    
       // const response = await axios.post(url);

        console.log('Message sent successfully !!!');
        await twilioClient.messages.create({
            body: whatsappMessage,
            from: process.env.TWILIO_WHATSAPP_FROM,
            to: `whatsapp:+91918219838054`,
          });
     
        

       
        await transporter.sendMail({
            from: 'rahulrajput82198@gmail.com',
            to: 'rahulrajput82198@gmail.com', // Recipient email address
            subject: 'Thank You for Your Submission',
              text: 'Thank you for your submission!',
                html: htmlValue
        });

        res.status(200).send('Form data sent successfully');
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send('Error sending form data');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
