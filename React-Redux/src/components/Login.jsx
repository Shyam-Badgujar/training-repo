import { useDispatch, useSelector } from "react-redux";
import { updateField, loginSuccess, loginFailure } from "../store/authSlice.js";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { fields, errors } = useSelector((state) => state.auth);

    const handleLogin = () => {
        if (fields.username === "admin" && fields.password === "1234") {
            dispatch(loginSuccess());
            navigate("/profile");
        } else {
            dispatch(loginFailure({ message: "Invalid credentials" }));
        }
    };

    return (
        <div className="login-container">

            <h1>Login</h1>




            <input
                className="login-input"
                placeholder="admin"
                onChange={(e) =>
                    dispatch(
                        updateField({ field: "username", value: e.target.value })
                    )
                }
            />

            <input
                className="login-input"
                type="password"
                placeholder="1234"
                onChange={(e) =>
                    dispatch(
                        updateField({ field: "password", value: e.target.value })
                    )
                }
            />

            {errors.message && (
                <p className="login-error">{errors.message}</p>
            )}

            <button className="login-btn" onClick={handleLogin}>
                Login
            </button>
        </div>
    );
};

export default Login;
