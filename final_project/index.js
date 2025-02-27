const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
  // Check if session exists
  if (!req.session.authorized) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  // Get token from session
  const token = req.session.token;
  if (!token) {
    return res.status(401).json({ message: "No authentication token" });
  }

  try {
    // Verify the token
    const verified = jwt.verify(token, "fingerprint_customer");
    if (verified) {
      next();
    } else {
      return res.status(401).json({ message: "Invalid authentication token" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid authentication token" });
  }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
