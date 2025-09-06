function validEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

const valid = (name, email, password) => {
  if (!email || !password) return "All fields are required";
  if (!validEmail(email)) return "Invalid email format";
  if (password.length < 6) return "Password must be at least 6 characters long";
  return true;
};

export default valid;
