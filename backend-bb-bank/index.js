require('dotenv').config();
const app = require('./app');
const port = process.env.PORT || 4500;
app.listen(port, () => console.log(`App is lisenting on http://localhost:${port}`));
