export const handleDemo = (req, res) => {
  res.json({
    message: "Hello from the backend server! 🚀",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
};
