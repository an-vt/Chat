import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import authApi from "../../../api/authAPI";
import userApi from "../../../api/userAPI";
import Logo from "../../../assets/logo.svg";
import { StorageKeys } from "../../../common/constants";
import { useAuth } from "../../../context/AuthProvider";
import { AuthLogin, UserInfo } from "../../../models";
import { saveToStorage } from "../../../utils/storage";

const FormContainer = styled.div`
  height: 100%;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
  .btn-toggle {
    input[type="checkbox"] {
      height: 0;
      width: 0;
      visibility: hidden;
    }

    label {
      cursor: pointer;
      text-indent: -9999px;
      width: 80px;
      height: 35px;
      background: grey;
      display: block;
      border-radius: 100px;
      position: relative;
    }

    label:after {
      content: "";
      position: absolute;
      top: 5px;
      left: 5px;
      width: 26px;
      height: 26px;
      background: #fff;
      border-radius: 90px;
      transition: 0.3s;
    }

    input:checked + label {
      background: #4e0eff;
    }

    input:checked + label:after {
      left: calc(100% - 5px);
      transform: translateX(-100%);
    }

    label:active:after {
      width: 130px;
    }

    // centering
    body {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  // Mobile
  @media screen and (max-width: 767px) {
    form {
      padding: 40px;
    }
  }
`;

function Login() {
  const navigate = useNavigate();
  const { saveToken, saveUserInfo } = useAuth();
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [values, setValues] = useState<AuthLogin>({ email: "", password: "" });

  const validateForm = () => {
    const { email, password } = values;
    if (email === "") {
      toast.error("Email and Password is required.");
      return false;
    }
    if (password === "") {
      toast.error("Email and Password is required.");
      return false;
    }
    return true;
  };

  const handleClickToggle = () => {
    const rememberMeStatus = rememberMe;
    setRememberMe((prevV) => !prevV);
    saveToStorage(StorageKeys.REMEMBER_ME, JSON.stringify(!rememberMeStatus));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const data: AuthLogin | any = await authApi.login(values);
        if (data) {
          saveToken(data);
        }
        const userInfo: UserInfo | undefined = await userApi.getMe();
        if (userInfo) {
          saveUserInfo(userInfo);
          if (userInfo.isAvatar) {
            navigate("/chat");
          } else {
            navigate("/setAvatar");
          }
        }
      } catch (error: any) {
        toast.error(error?.message);
      }
    }
  };

  const handleChange = (event: any) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <FormContainer>
      <form action="" onSubmit={(event) => handleSubmit(event)}>
        <div className="brand">
          <img src={Logo} alt="logo" />
          <h1>snappy</h1>
        </div>
        <input
          type="text"
          placeholder="Email"
          name="email"
          onChange={(e) => handleChange(e)}
          min="3"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={(e) => handleChange(e)}
        />
        <div className="btn-toggle">
          value={rememberMe}
          <input
            type="checkbox"
            checked={rememberMe}
            id="switch"
            onClick={handleClickToggle}
          />
          <label htmlFor="switch">Toggle</label>
        </div>
        <button type="submit">Log In</button>
        <span>
          Don't have an account ? <Link to="/register">Create One.</Link>
        </span>
      </form>
    </FormContainer>
  );
}

export { Login };
