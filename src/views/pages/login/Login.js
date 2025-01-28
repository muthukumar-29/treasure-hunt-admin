import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import db from '../../../firebase/firebase-config'
import { collection, getDocs, query, where } from 'firebase/firestore'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const navigate = useNavigate();

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') == 'true');

  const validateAdmin = async (username, password) => {
    try {
      const adminRef = collection(db, "admin");
      const q = query(adminRef, where("username", "==", username), where("password", "==", password));
      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        querySnapShot.forEach(async (docSnapShot) => {
          console.log("Admin Data:", docSnapShot.data())
        })

        return true;
      } else {
        console.log("Invalid Data");
        return false;
      }
    } catch (error) {
      console.error("Error validating user login:", error.message);
      return false;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please Fill Out All Fields!",
      });
      return;
    }

    const isValidAdmin = await validateAdmin(username, password);

    if (isValidAdmin) {
      Swal.fire({
        icon: "success",
        title: "Login!",
        text: "Login Successfully!",
      });

      setIsLoggedIn(true);

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);

      setUsername("");
      setPassword("");

      navigate("/");

    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid!",
        text: "Invalid. Please try again.",
      });
    }

  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Username" autoComplete="username" onChange={(e) => setUsername(e.target.value)} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type='submit' color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
