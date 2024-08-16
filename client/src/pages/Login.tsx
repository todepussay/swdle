import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiLock as PasswordIcon } from "react-icons/ci";
import { FaRegEye as EyeIcon, FaRegCheckCircle, FaRegEyeSlash as EyeSlashIcon } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { CiMail } from "react-icons/ci";
import axios from "axios";
import Loader from "@components/Loader";
import UserContext from "@contexts/UserContext";
import '@styles/Login.css';



const apiUrl = import.meta.env.VITE_API_URL;

function Login() {

    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [credentials, setCredentials] = useState<{ email: string, password: string }>({ email: "", password: "" });
    const [status, setStatus] = useState<string>("idle");
    const { setUser } = useContext(UserContext)!;
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });

        if(error !== ""){
            setError("");
            setStatus("idle");
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(credentials.email === "" || credentials.password === "" || status !== "idle"){
            setError("Veuillez remplir tous les champs");
            return;
        }

        setStatus("pending");
                
        // Envoie des données vers le serveur
        axios.post(`${apiUrl}/auth/login`, {
            email: credentials.email,
            password: credentials.password
        }).then((res: { data: any; }) => {
            if(!res.data.success){
                setError(res.data.message);
                setStatus("error");
                return;
            }

            if(res.data.success){
                setStatus("success");
                setUser(res.data.token);
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            }
        })
    }

    return (
        <div className="Login">
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <CiMail />
                    <input type="email" placeholder="Email" name="email" id="email" value={credentials.email} onChange={handleChange} />
                </div>
                <div className="field">
                    <PasswordIcon />
                    <input type={passwordVisible ? "text" : "password"} placeholder="Mot de passe" name="password" id="password" value={credentials.password} onChange={handleChange} />
                    {
                        passwordVisible ? <EyeSlashIcon onClick={() => setPasswordVisible(false)} /> : <EyeIcon onClick={() => setPasswordVisible(true)} />
                    }
                </div>
                <p className="error">{error}</p>

                <button className="btn" { ...(status !== "idle" ? { disabled: true } : {})} type="submit">
                    {
                        status === "idle" ? "Se connecter" :
                        status === "pending" ? <Loader /> : 
                        status === "success" ? <FaRegCheckCircle style={{
                            color: "green",
                            marginTop: "5px",
                            fontSize: "60px"
                        }} /> : 
                        status === "error" ? <MdErrorOutline style={{
                            color: "red",
                            marginTop: "5px",
                            fontSize: "60px"
                        }} /> : ""
                    }
                </button>
                <p className="other_links">Vous n'avez pas de compte ? <Link to={"/signin"}>S'enregistrer</Link></p>
            </form>

        </div>
    )
}

export default Login;