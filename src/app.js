const express = require('express');
const cors = require('cors');
const moment = require('moment-timezone');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/:date?', (req, res) => {
    let date = req.params.date;

    if (!date) {
        date = new Date();
    } else if (!isNaN(date)) {
        date = parseInt(date);
    }

    let dateObj = moment.utc(date); // Força a usar UTC

    if (!dateObj.isValid()) {
        return res.json({ error: "Invalid Date" });
    }

    res.json({
        unix: dateObj.valueOf(),
        utc: dateObj.toISOString() // Formata para UTC ISO string
    });
});

app.get('/api/diff/:date1/:date2', (req, res) => {
    const { date1, date2 } = req.params;
    const timestamp1 = isNaN(date1) ? new Date(date1).getTime() : parseInt(date1);
    const timestamp2 = isNaN(date2) ? new Date(date2).getTime() : parseInt(date2);

    if (isNaN(timestamp1) || isNaN(timestamp2)) {
        return res.json({ error: "Invalid Date" });
    }

    const diff = Math.abs(timestamp2 - timestamp1);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    res.json({
        days,
        hours,
        minutes,
        seconds
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
