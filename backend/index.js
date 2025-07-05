const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: "Hello from Express backend!" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
