import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { login } from "../service/userAccountService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [checkForm, setCheckForm] = useState(0);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const loginRes = await login(data);

    if (loginRes === true) {
      navigate("/admin/");
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };
  return (
    <div className="container">
      <div className="page-container" id="page-container">
        <main className="main">
          {checkForm === 0 && (
            <div className="login-div content">
              <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                <h1 style={{ fontSize: "20px", marginBottom: "9px" }}>Login</h1>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control form-cus"
                    {...register("email")}
                    placeholder="Email"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control form-cus"
                    {...register("password")}
                    placeholder="Password"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-cus">
                  Submit
                </button>
                <label
                  className="form-check-label"
                  style={{ marginTop: "10px", fontSize: "12px" }}
                >
                  <a
                    style={{ textDecoration: "solid black", cursor: "pointer" }}
                    onClick={() => setCheckForm(2)}
                  >
                    FORGOT YOUR PASSWORD?
                  </a>
                </label>
                <button
                  className="btn btn-primary btn-cus"
                  style={{ marginTop: "30px" }}
                  onClick={() => handleRegister()}
                >
                  Register an account a
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Login;
