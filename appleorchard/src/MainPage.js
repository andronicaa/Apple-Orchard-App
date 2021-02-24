import React, { useState } from 'react'
import { Card, Button, Alert } from 'react-bootstrap';
import { useAuth } from './context/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import styles from "./Styles/MainPage.module.css";
import TempProfile from "./Components/TempProfile";
export default function MainPage() {
    const[error, setError] = useState('');
    const{ currentUser, logout } = useAuth();
    const history = useHistory();

    async function handleLogout() {
        setError("");

        try {
            await logout();
            history.push("/neauth-home");
        } catch {
            setError("Failed to log out");
        }
    }


    return (
    <>
      <Card className={styles.cardProfile}>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong> {currentUser.email}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
          <div className="w-100 text-center mt-2">
            <Button variant="link" onClick={handleLogout}>
              <strong>Log Out</strong>
            </Button>
          </div>
          <TempProfile />
        </Card.Body>
      </Card>
    </>
    )
}
