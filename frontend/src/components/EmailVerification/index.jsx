import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { Link } from "react-router-dom";

const EmailVerification = () => {
  const [data, setData] = useState({
    email: "",
    otp: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = ({ target }) => {
    setData((prevData) => ({ ...prevData, [target.name]: target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:8080/api/users/verify";
      const { data: res } = await axios.post(url, data);
      navigate("/login");
      console.log(res.message);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className={styles.email_verification_container}>
      <div className={styles.email_verification_form}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Email Verification</h1>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={data.email || location.state?.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
            <input
              type="text"
              name="otp"
              placeholder="OTP"
              value={data.otp}
              onChange={handleChange}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            <button type="submit" className={styles.green_btn}>
              Verify Email
            </button>
          </form>
        </div>
        <div className={styles.right}>
          <h1>Register here !</h1>
          <Link to="/signup">
            <button type="button" className={styles.white_btn}>
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
