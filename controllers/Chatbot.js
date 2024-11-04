// Core modules
const path = require("path");
const fs = require("fs").promises;

// Third-party modules
const axios = require("axios");
const moment = require("moment-timezone");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");

// Models
const Author = require("../models/Author");
const Chat = require("../models/Chat");
const Session = require("../models/Sessions");
const Stage = require("../models/Stage");

// Verify Webhook - Validate the webhook
const verifyWebhook = async (req, res) => {
  console.log({ query: req.query });
  if (
    req.query["hub.mode"] == "subscribe" &&
    req.query["hub.verify_token"] === process.env.VERIFY_TOKEN
  ) {
    res.send(req.query["hub.challenge"]);
  } else {
    res.sendStatus(400);
  }
};

// Send message function definition
const sendMessage = async (messageData) => {
  try {
    const url = `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`;
    const response = await axios.post(url, messageData, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Message sent successfully:", response.data);
  } catch (error) {
    console.error(
      "Error sending message:",
      error?.response?.data || error.message
    );
    throw error; // Rethrow error for further handling
  }
};

// Receive Event - Handle incoming messages and process them
const receiveEvent = async (req, res) => {
  console.log("#########");
  try {
    const { object, entry } = req.body;
    if (object && entry && entry[0]?.changes?.[0]?.value?.messages?.[0]) {
      const messagebody = entry[0].changes[0].value.messages[0];
      const username = entry[0].changes[0].value.contacts[0].profile.name;
      const receivedon = entry[0].changes[0].value.metadata.phone_number_id;
       
      if (receivedon !== process.env.PHONE_NUMBER_ID) {
        return res.sendStatus(200);
      }
      const phonenumber = messagebody.from;
      console.log("Received message from:", {
        phonenumber,
        messagebody,
      });
      let replies = [];
      if (messagebody.type === "text") {
        const replyMessage = `Thank you, ${username}, for your message: "${messagebody.text.body}"`;
        replies.push(replyMessage);
      }
      for (const reply of replies) {
        const prepareschema = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: phonenumber,
          type: "text",
          text: {
            body: reply,
          },
        };
        await sendMessage(prepareschema);
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("Error processing event:", error);
    res.sendStatus(500);
  }
};

const sendPoll = async (req, res) => {
  const { phone } = req.body;
  if (phone === undefined) {
    return res.json({
      success: false,
      message: "Phone number required",
    });
  }
  let phonenumber = undefined;
  if (req.body.phone) {
    let phone = req.body.phone.toString();
    if (phone.length === 10 || (phone.length !== 12 && phone.length !== 13)) {
      phonenumber = `91${phone}`;
    } else {
      phonenumber = req.body.phone;
    }
  }
  const message =
    "*This is the Neehar Neuro bot*\n\n:bulb:We've got a great selection of offerings for you\n\nClick on the option below to explore :point_down:";
  const buttons = [
    { id: "1", text: "Book an Appointment" },
    { id: "2", text: "View Prescription" },
    { id: "3", text: "Other Services" },
  ];
  // Prepare the buttons with debug logging
  console.log("Preparing buttons with:", {
    phonenumber,
    message,
    buttons,
  });
  const header = ""; // Add header if needed
  const footer = ""; // Add footer if needed
  const prepareschema = prepareButtons(
    phonenumber,
    header,
    message,
    footer,
    buttons
  );
  await sendMessage(prepareschema);
  res.json({
    success: true,
    message: "Message sent successfully",
  });
};

module.exports = {
  verifyWebhook,
  receiveEvent,
  sendPoll,
};
