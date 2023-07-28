// This js file generates the OTP ; n = number of digits in the OTP

module.exports = (n) => {
  const chars = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789';
  let otp = '';
  for (let i = 0; i < n; i++) {
    otp += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return otp;
}