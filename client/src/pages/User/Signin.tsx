import React, { useState } from "react";
import Loader from "@components/Loader";
import { Link, useNavigate } from "react-router-dom";
import { CiUser as UserIcon, CiMail, CiLock as PasswordIcon } from "react-icons/ci";
import { MdErrorOutline } from "react-icons/md";
import { FaRegEye as EyeIcon, FaRegCheckCircle, FaRegEyeSlash as EyeSlashIcon } from "react-icons/fa";
import bcrypt from "bcryptjs";
import axios from "axios";
import '@styles/Signin.css';

const apiUrl = import.meta.env.VITE_API_URL;

interface Credentials {
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

function Signin(){

    const [credentials, setCredentials] = useState<Credentials>({ username: "", email: "", password: "", passwordConfirm: "" });
    const [passwordVisible, setPasswordVisible] = useState<{password: boolean, passwordConfirm: boolean}>({ password: false, passwordConfirm: false});
    const [error, setError] = useState<string>("");
    const [status, setStatus] = useState<string>("idle");
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

        if(credentials.username === "" || credentials.email === "" || credentials.password === "" || credentials.passwordConfirm === "" || status !== "idle"){
            setError("Veuillez remplir tous les champs");
            return;
        }

        if(credentials.username.length < 4 || !credentials.username.match(/^[a-zA-Z0-9]+$/)){
            setError("Nom d'utilisateur invalide, trop court ou contient des caractères spéciaux");
            return;
        }

        if(!credentials.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
            setError("Email invalide");
            return;
        }

        if(credentials.password.length < 8){
            setError("Mot de passe trop court");
            return;
        }

        if(credentials.password !== credentials.passwordConfirm){
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        setStatus("pending");

        // Hash password
        bcrypt.genSalt(12, (err: any, salt: any) => {
            if(err) console.log(err);
            bcrypt.hash(credentials.password, salt, (err: any, hash: any) => {
                if(err) throw err;
                
                // Envoie des données vers le serveur
                axios.post(`${apiUrl}/auth/signin`, {
                    username: credentials.username,
                    email: credentials.email,
                    password: hash
                }).then((res: { data: any; }) => {
                    if(!res.data.success){
                        setError(res.data.message);
                        setStatus("error");
                        return;
                    }

                    if(res.data.success){
                        setStatus("success");
                        setTimeout(() => {
                            navigate("/login");
                        }, 1000);
                    }
                })

            })
        })
    }

    return (
        <div className="Signin">
            <h2>S'incrire</h2>
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <UserIcon />
                    <input type="text" placeholder="Nom d'utilisateur" name="username" id="username" onChange={handleChange} value={credentials.username} />
                </div>
                <div className="field">
                    <CiMail />
                    <input type="email" placeholder="Email" name="email" id="email" onChange={handleChange} value={credentials.email} />
                </div>
                <div className="field">
                    <PasswordIcon />
                    <input type={passwordVisible.password ? "text" : "password"} placeholder="Mot de passe" name="password" id="password" onChange={handleChange} value={credentials.password} />
                    {
                        passwordVisible.password ? 
                        <EyeSlashIcon onClick={() => setPasswordVisible({ ...passwordVisible, password: false })} /> : 
                        <EyeIcon onClick={() => setPasswordVisible({ ...passwordVisible, password: true })} />
                    }
                </div>
                <div className="field">
                    <PasswordIcon />
                    <input type={passwordVisible.passwordConfirm ? "text" : "password"} placeholder="Confirmer mot de passe" name="passwordConfirm" id="passwordConfirm" onChange={handleChange} value={credentials.passwordConfirm} />
                    {
                        passwordVisible.passwordConfirm ? 
                        <EyeSlashIcon onClick={() => setPasswordVisible({ ...passwordVisible, passwordConfirm: false })} /> : 
                        <EyeIcon onClick={() => setPasswordVisible({ ...passwordVisible, passwordConfirm: true })} />
                    }
                </div>

                <div className="error">{error}</div>

                <button className="btn" { ...(status !== "idle" ? { disabled: true } : {})} type="submit">
                     {
                        status === "idle" ? "S'inscrire" :
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
                <p className="other_links">Vous avez déjà un compte ? <Link to={"/login"}>Se connecter</Link></p>
            </form>
        </div>
    )
}

export default Signin;