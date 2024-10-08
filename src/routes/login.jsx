import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  Error,
  Input,
  Switcher,
  Wrapper,
  Form,
  Title,
  Splash,
  Box,
} from "../components/auth-components";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (isLoading || email === "" || password === "") return;
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e.code, e.message);
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setSplashLoading(false);
    }, 1500);
  }, []);

  return (
    <Wrapper>
      {splashLoading && (
        <Splash className={splashLoading ? "" : "hidden"}>
          <h1>
            ICECREAM
            <br />
            FACTORY
          </h1>
          <div className="first" />
          <div className="second" />
        </Splash>
      )}
      <Box className={!splashLoading ? "action" : ""}>
        <Title>로그인이 필요해요</Title>
        <Form onSubmit={onSubmit}>
          <Input
            onChange={onChange}
            name="email"
            value={email}
            placeholder="이메일"
            type="email"
            required
          />
          <Input
            onChange={onChange}
            name="password"
            value={password}
            placeholder="비밀번호"
            type="password"
            required
          />
          <Input
            className="createBtn"
            type="submit"
            value={isLoading ? "Loading..." : "로그인"}
          />
        </Form>

        {error !== "" ? <Error>{error}</Error> : null}
        <Switcher>
          계정이 없나요? <Link to="/create-account">회원가입하기 &rarr;</Link>
        </Switcher>
      </Box>
    </Wrapper>
  );
}
