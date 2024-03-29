import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import routes from './routes/routes.js';
import dontenv from 'dotenv';
dontenv.config();

const port = process.env.PORT || 3030;
const app = express();

// const corsOptions = {
//   origin: 'https://barking-dogs.netlify.app/',
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   headers: {
//     'Access-Control-Allow-Headers': '*',
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': '*',
//   },
// };

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static('images'));
app.use(routes);

mongoose
  .connect(process.env.URL || 'mongodb database link.', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log('MongoDB Connected..'));

app.listen(port, () => {
  console.log(`Server Listen On ${port}  `);
});
