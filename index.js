const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const token = process.env.WHATSAPP_TOKEN;
const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

app.get("/", (req, res) => {
  res.send("Bot Estética ROOm está rodando!");
});

app.post("/webhook", async (req, res) => {
  const body = req.body;
  if (body.object) {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (messages) {
      const message = messages[0];
      const from = message.from;
      const msgBody = message.text?.body?.toLowerCase();

      let reply = "Desculpe, não entendi. Digite *serviços*, *agendar* ou *oi*.";

      if (msgBody === "oi") reply = "Olá! Bem-vindo à Estética ROOm.";
      else if (msgBody === "serviços") reply = "*Nossos serviços:*\n1️⃣ Lavagem Tradicional\n2️⃣ Higienização\n3️⃣ Vitrificação.";
      else if (msgBody === "agendar") reply = "Para agendar, envie os dados do seu carro e o serviço desejado.";

      await axios.post(
        `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          text: { body: reply },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Bot Estética ROOm rodando na porta " + PORT);
});