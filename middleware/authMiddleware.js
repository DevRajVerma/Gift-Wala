const UserModel = require("../models/user");

// Middleware to check if user is authenticated
exports.isAuthenticated = async (req, res, next) => {
  try {
    const username = req.cookies.username;
    
    if (!username) {
      return res.redirect("/login");
    }
    
    const user = await UserModel.findOne({ email: username });
    
    if (!user) {
      res.clearCookie("username");
      return res.redirect("/login");
    }
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.redirect("/login");
  }
};

// Middleware to add user data to response locals for templates
exports.getUserData = async (req, res, next) => {
  try {
    const username = req.cookies.username;
    
    if (username) {
      const user = await UserModel.findOne({ email: username }, { name: 1, email: 1, _id: 0 });
      
      if (user) {
        res.locals.user = {
          name: user.name,
          email: user.email,
          login_status: ""
        };
      } else {
        res.locals.user = {
          name: "",
          login_status: "Login"
        };
      }
    } else {
      res.locals.user = {
        name: "",
        login_status: "Login"
      };
    }
    
    next();
  } catch (error) {
    console.error("Error getting user data:", error);
    res.locals.user = {
      name: "",
      login_status: "Login"
    };
    next();
  }
};