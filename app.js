require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { default: mongoose, get } = require('mongoose');

//Local Modules
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors()); // Allows all origins (only for dev use)

// app.use((req, res, next) => {
//     const token = req.headers.authorization?.split('')[1]; 
//     if(!token) return res.status(401).json({message: 'Token is missing, Access denied!'});
    
//     try {
//         const decoded = jwt.verify(token, JWT_SECRET_KEY);
//         req.user = decoded; // Attach user info to request
//         next();
//     } catch (error) {
//         return res.status(401).json({message: 'Invalid token, Access denied!'});
//     }

//   }
// )

app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);


const DB_PATH =  process.env.DB_PATH ;
const PORT = process.env.PORT || 8080;

mongoose.connect(DB_PATH).then(()=>{
  app.listen(PORT, ()=>{
    console.log(`Server is running at localhost:${PORT}`);
});
}).catch(err=>{
  console.log("DataBase connection failed", err)
}) ;


