import bcrypt from 'bcrypt';

const password = "ABC@1234"; // Replace with your plain-text password
bcrypt.hash(password, 10).then((hashedPassword) => {
  console.log("Hashed Password:", hashedPassword);
}).catch((error) => {
  console.error("Error hashing password:", error);
});
