import React, { useEffect, useState } from 'react';
import { Navbar, Button, Container, Image, Badge } from 'react-bootstrap';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/userSlice';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function Header() {

  const [userData, setUserData] = useState(null);
  const balance = useSelector(state => state.transactions.balance);
  console.log("balance", balance);
  
  const isLoggedInState = useSelector(state => state.user.isLoggedIn);

  const isLoggedIn = userData !== null;

  useEffect(() => {
    const lsUserData = localStorage.getItem("userData");
    if (lsUserData) {
      setUserData(lsUserData);
    }
  }, [isLoggedInState]);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogOut = () => {
    dispatch(logout());
    Cookies.remove("token");
    localStorage.removeItem("userData");
    localStorage.clear();
    router.push("/");
  };

  return (
    <Navbar expand="lg" className="custom-navbar" style={{ backgroundColor: '#249c97' }}>
      <Container>
        {/* Logo and Name */}
        <div className="d-flex align-items-center">
          <Navbar.Brand as={Link} href="/" className="d-flex align-items-center">
            <Image
              src="/images/logo.jpg"
              alt="Builder Logo"
              height={80}
              width={80}
              className="logo-image me-2"
              roundedCircle
            />
            <span className="text-white fw-bold fs-3">Petrov Trading</span> {/* The Name */}
          </Navbar.Brand>
        </div>

        {/* Buttons */}
        <div className="d-flex align-items-center">
          {!isLoggedIn ? (
            <>
              <Button href="/register" variant="success" size="lg" className="me-3">
                Регистарция
              </Button>
              <Button href="/login" variant="light" size="lg">
                Вход
              </Button>
            </>
          ) : (
            <>
              <Button variant="success" size="lg" className="me-2">
                Баланс: {balance.toFixed(2)} $
              </Button>

              <Button href="/profile" variant="light" size="lg" className="me-2 d-flex align-items-center">
                Профил
              </Button>

              <Button variant="danger" size="lg" onClick={handleLogOut}>
                Изход
              </Button>
            </>
          )}
        </div>
      </Container>
    </Navbar>
  );
}
