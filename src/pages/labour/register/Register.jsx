import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import logo from '../../../assets/images/Karnataka_logo_100_Pixels.png';
import graphic from '../../../assets/images/undraw_under_construction_46pa.svg';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputAdornment,
  TextField,
  Typography,
} from '@material-ui/core';
import validator from 'validator';
//import mobile from 'assets/images/Phone 1-01.svg';
import mobile from '../../../assets/images/Phone 1-01.svg';
//import otp from 'assets/images/Phone otp-01.svg';
import otp from '../../../assets/images/Phone otp-01.svg';
import { Link } from 'react-router-dom';
import { FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// import {
//   generateOtpRegistration,
//   getBoardDetails,
//   getMinistryDetails,
//   registerUser,
//   updateUser,
//   loginUser,
//   SERVER,
// } from 'store/actions/user.actions';
//import { saveTokenCookie, showToast } from 'utils/tools';
import axios from 'axios';
import DownloadIcon from '@mui/icons-material/Download';
import userManualEng from '../../../assets/documents/user_manual_eng.pdf';
import userManualKan from '../../../assets/documents/user_manual_kan.pdf';
import Button2 from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import {
  SERVER,
  loginUserHandler,
  //updateUser,
  generateOtpRegistration,
} from '../../../features/auth/authSlice';
import {
  getBoardDetails,
  getMinistryDetails,
} from './registerSlice';
import { showToast } from '../../../utils/tools1';
import { registerUser } from '../../../features/registerUser/registerSlice';

const Register = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [value, setValue] = React.useState('sevasindhu');

  const [newRegistrationPhone, setNewRegistrationPhone] = useState('');
  const [newRegistrationOTP, setNewRegistrationOTP] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [sevaSindhuPhone, setSevaSindhuPhone] = useState('');
  const [sevaSindhuOTP, setSevaSindhuOTP] = useState('');
  const [isOTPSending, setIsOTPSending] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isPhoneError, setIsPhoneError] = useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = useState('');
  const [isOtpError, setIsOTPError] = useState(false);
  const [OTPErrorMessage, setOTPErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [seconds, setSeconds] = React.useState(60);
  const [resendReset, setResendReset] = React.useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isDisableBtn, setIsDisableBtn] = useState(false);
  const [userId, setUserId] = useState('');
  const [isSevaOTPSending, setIsSevaOTPSending] = useState(false);
  const [isSevaOTPSent, setIsSevaOTPSent] = useState(false);
  const [isSevaPhoneError, setIsSevaPhoneError] = useState(false);
  const [sevaPhoneErrorMessage, setSevaPhoneErrorMessage] = useState('');
  const [isSevaOTPError, setIsSevaOTPError] = useState(false);
  const [sevaOTPErrorMessage, setSevaOTPErrorMessage] = useState('');
  // const [isSevaSubmitting, setIsSevaSubmitting] = useState(false);
  const [hashNumber, setHashNumber] = useState('');

  const [isActiveLogin, setIsActiveLogin] = useState(false);
  const [isActiveExist, setIsActiveExist] = useState(true);
  const [openDialog, setOpenDialog] = React.useState(false);

  const [isDisableVerifyBtn, setIsDisableVerifyBtn] = useState(false);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleLoginClick = () => {
    // history.push("/login")
    navigate('/login');
    setIsActiveLogin(true);
    setIsActiveExist(false);
  };

  const handleExisitingClick = () => {
    // history.push("/register")
    navigate('/register');
    setIsActiveExist(true);
    setIsActiveLogin(false);
  };

  useEffect(() => {
    if (window.location.pathname === 'register') {
      sessionStorage.clear();
    }
  });

  const newRegistrationHandler = (event) => {
    if (event.target.name === 'newPhone') {
      console.log(event.target.value);
      if (
        validator.isNumeric(event.target.value) &&
        event.target.value.length === 10
      ) {
        setIsPhoneError(false);
        setIsOTPSent(false);
        setIsOTPError(false);
        setPhoneErrorMessage('');
      } else {
        setIsPhoneError(true);
        setPhoneErrorMessage('Enter Correct Mobile Number');
      }
      setNewRegistrationPhone(event.target.value);
    } else if (event.target.name === 'newOTP') {
      setIsOTPError(false);
      setNewRegistrationOTP(event.target.value);
    }
  };

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const sevaSindhuRegistrationHandler = (event) => {
    if (event.target.name === 'regNo') {
      setRegistrationNumber(event.target.value);
    } else if (event.target.name === 'refNo') {
      setReferenceNumber(event.target.value);
    } else if (event.target.name === 'sevaPhone') {
      if (
        validator.isNumeric(event.target.value) &&
        event.target.value.length === 10
      ) {
        setIsSevaPhoneError(false);
        setIsSevaOTPSent(false);
        setIsSevaOTPError(false);
        setSevaPhoneErrorMessage('');
      } else {
        setIsSevaPhoneError(true);
        setSevaPhoneErrorMessage('Enter Correct Mobile Number');
      }
      setSevaSindhuPhone(event.target.value);
    } else if (event.target.name === 'sevaOTP') {
      setSevaSindhuOTP(event.target.value);
    }
  };

  useEffect(() => {
    //   console.log('in useEffect []');
    dispatch(getMinistryDetails());
    //   // removeTokenCookie()
    //   dispatch(updateUser(''));
    dispatch(loginUserHandler('delete'));
    //   //dispatch(registerUser('delete'));
  }, []);

  useEffect(() => {
    //   console.log('in useEffect [users.get_ministry]');

    if (
      users.get_ministry &&
      users.get_ministry.id !== undefined &&
      users.get_ministry.id !== null
    ) {
      console.log('Dispatching getBoardDetails action');
      dispatch(getBoardDetails(users.get_ministry.id));
    }
  }, [users.get_ministry]);

  useEffect(() => {
    console.log('in useEffect [users.get_ministry]');

    if (
      users?.get_ministry &&
      users.get_ministry.id !== undefined &&
      users.get_ministry.id !== null
    ) {
      console.log('Dispatching getBoardDetails action');
      dispatch(getBoardDetails(users.get_ministry.id));
    }
  }, [users?.get_ministry]);

  const getOtp = (event) => {
    event.preventDefault();
    // console.log("in getOtp-> phone:" + allValues.phone)
    // console.log("in getOtp-> users:" + JSON.stringify(users, undefined,2))

    if (
      users !== undefined &&
      users !== null &&
      !isPhoneError &&
      newRegistrationPhone.length === 10
    ) {
      setIsOTPSending(!isOTPSending);

      var boardId = 1;

      let dataToDispatch = {
        mobile_code: '+91',
        phone_number: newRegistrationPhone,
        board_id: boardId,
      };

      console.log('dataToDispatch: ' + JSON.stringify(dataToDispatch));

      dispatch(generateOtpRegistration(dataToDispatch));
    } else {
      // setAllValues({ ...allValues, phoneError: true })
    }
  };

  useEffect(() => {
    if (
      users.generate_otp_registration !== undefined &&
      users.generate_otp_registration !== null &&
      users.generate_otp_registration.message !== null &&
      users.generate_otp_registration.message === 'Success'
    ) {
      console.log('OTP generated Successfully');
      setIsOTPSending(false);
      setIsOTPSent(true);
      showToast('SUCCESS', 'OTP Sent Successfully!');
      users.generate_otp_registration.message = null;
    } else if (
      users.generate_otp_registration !== undefined &&
      users.generate_otp_registration !== null &&
      users.generate_otp_registration.message !== null &&
      users.generate_otp_registration.message !== undefined &&
      users.generate_otp_registration.message !== ''
    ) {
      console.log('OTP generate Error');

      setIsOTPSending(false);
      setIsOTPSent(false);
      setIsPhoneError(true);
      setPhoneErrorMessage(users.generate_otp_registration.message);

      showToast('ERROR', users.generate_otp_registration.message);
      users.generate_otp_registration.message = null;
    } else if (
      users &&
      users.generate_otp_registration &&
      users.generate_otp_registration.error
    ) {
      console.log('In else: error');
      console.log(
        'users.generate_otp_registration:' + users.generate_otp_registration,
      );
      setIsOTPSending(false);
      setIsOTPSent(false);
      setIsPhoneError(true);
      setPhoneErrorMessage('Error sending OTP');
      showToast('ERROR', users.generate_otp_registration.errors.msg);

      users.generate_otp_registration = null;
    }
  }, [users?.generate_otp_registration]);

  const registration_func = (event) => {
    event.preventDefault();

    if (users.generate_otp_registration !== null) {
      if (
        !isPhoneError &&
        newRegistrationPhone.length === 10 &&
        newRegistrationOTP !== ''
      ) {
        setIsSubmitting(!isSubmitting);

        // var login_user_id = '';
        if (
          users.generate_otp_registration.data.phone_number !== '' &&
          newRegistrationOTP !== ''
        ) {
          // login_user_id = users.login_admin.data.department_user_id

          let dataToRegister = {
            hash: users.generate_otp_registration.data.hash,
            phone_number: users.generate_otp_registration.data.phone_number,
            mobile_code: users.generate_otp_registration.data.mobile_code,
            board_id: users.generate_otp_registration.data.board_id,
            otp: newRegistrationOTP,
            login_user_id: +Date.now().toString().slice(0, 10),
          };
          console.log('dataToRegister: ' + JSON.stringify(dataToRegister));

          dispatch(registerUser(dataToRegister));
        } else {
          setIsSubmitting(false);
          showToast('ERROR', 'Cannot Register! No Admin Login Found.');
        }
      } else if (isPhoneError || newRegistrationPhone.length !== 10) {
        setIsPhoneError(true);
        setPhoneErrorMessage('Enter Correct Mobile Number!');
      } else if (newRegistrationOTP === '') {
        setIsSubmitting(false);
        setIsOTPError(true);
        setOTPErrorMessage('Enter Valid OTP!');
      } else if (users.generate_otp_registration.data.hash === undefined) {
        setIsSubmitting(false);
        setIsOTPError(true);
        setOTPErrorMessage('Enter Valid OTP!');
      } else {
        setIsSubmitting(false);
        setIsPhoneError(true);
        setIsOTPError(true);
        setPhoneErrorMessage('Enter Correct Mobile Number!');
      }
    }
  };

  useEffect(() => {
    if (
      users.register_user !== undefined &&
      users.register_user !== null &&
      users.register_user.data !== null &&
      users.register_user.data !== undefined
    ) {
      console.log('in if : Valid OTP');

      setIsSubmitting(false);
      saveTokenCookie(users.register_user.jwt);
      showToast('SUCCESS', 'Registered Successfully!');
      users.register_user.message = null;

      // props.history.push("/");

      // history.push("/dashboard-user");
      navigate('./dashboard-user');

      users.register_user.message = null;
    }
    if (
      users.register_user !== undefined &&
      users.register_user !== null &&
      users.register_user.message !== undefined &&
      users.register_user.message === 'Invalid OTP'
    ) {
      console.log('In elseif: Invalid OTP');

      setIsSubmitting(false);
      setIsOTPError(true);
      setOTPErrorMessage('Invalid OTP!');
      showToast('WARN', 'Invalid OTP!');

      users.register_user.message = null;
    } else if (
      users.register_user !== undefined &&
      users.register_user !== null &&
      users.register_user.message !== null
    ) {
      setIsSubmitting(false);
      showToast('ERROR', 'Error while Registering!');

      users.register_user = null;
    }
  }, [users.register_user]);

  //sevasindhu api's

  const handleVerify = (ev) => {
    if (registrationNumber && referenceNumber) {
      setIsDisableVerifyBtn(true);

      console.log('in_Verify');

      var data = JSON.stringify({
        registration_number: registrationNumber,
        application_reference_number: referenceNumber,
      });

      var config = {
        method: 'post',
        url: SERVER + '/seva_sindhu/check_user_in_seva_sindhu',
        data: data,
      };

      axios(config)
        .then(function (response) {
          console.log('response_reference', response.data);

          //  if(response.data.data[0].error){
          //     showToast("ERROR", response.data.data[0].error)
          // }

          if (response.data.data.length > 0) {
            if (
              response.data.data[0].IS_Freezed ||
              +response.data.data[0].ISACTIVEUSER === 0
            ) {
              // Failed
              showToast('ERROR', 'Your Card has been freezed');
            } else {
              setIsVerified(true);
              setIsDisableBtn(false);
              showToast('SUCCESS', 'Successfully Verified');
              sessionStorage.setItem('TempID', response.data.data[0].id);
              sessionStorage.setItem(
                'LabourName',
                response.data.data[0].applicantname,
              );
            }
            // sessionStorage.setItem("LabourName","MURALI")
          }
        })
        .catch(function (error) {
          console.log(error);
          showToast('ERROR', `${error.response.data.errors.msg}`);
          setIsDisableVerifyBtn(false);
        });
    } else {
      showToast('ERROR', 'Please fill all the mandatory fields');
    }
  };

  useEffect(() => {
    // console.log("users.generate_otp.message:"+users.generate_otp.message)
    try {
      if (
        users.generate_otp !== null &&
        users.generate_otp.message !== null &&
        users.generate_otp.message === 'Success'
      ) {
        // console.log("OTP generated Successfully");

        setIsSevaOTPSending(false);
        setIsSevaOTPSent(true);
        showToast('SUCCESS', 'OTP Sent Successfully!');
        users.generate_otp.message = null;
      } else if (
        users.generate_otp !== null &&
        users.generate_otp.message !== null &&
        users.generate_otp.message !== undefined &&
        users.generate_otp.message !== ''
      ) {
        // console.log("OTP generate Error");

        setIsSevaOTPSending(false);
        setIsSevaOTPSent(false);
        setIsSevaPhoneError(true);
        setSevaPhoneErrorMessage(users.gennerate_otp.message);
        showToast('ERROR', users.generate_otp.message);
        users.generate_otp = null;
      } else if (
        users.generate_otp !== null &&
        users.generate_otp.success === false &&
        users.generate_otp.error !== undefined &&
        users.generate_otp.error !== ''
      ) {
        // console.log("OTP generate Error");

        setIsSevaOTPSending(false);
        setIsSevaOTPSent(false);
        showToast('ERROR', users.generate_otp.error);
        showToast('ERROR', 'Please try after 30 minutes');
        users.generate_otp = null;
      } else if (users.generate_otp !== null) {
        // console.log("In else: error");
        console.log('users.generate_otp:' + JSON.stringify(users.generate_otp));

        users.generate_otp = null;
      }
    } catch (e) {
      console.error(e);
    }
  }, [users.generate_otp]);

  useEffect(() => {
    try {
      if (
        users.user !== undefined &&
        users.user !== null &&
        users.user !== ''
      ) {
        console.log('users.user.board_id:' + users.user.board_id);
        if (users.user.board_id === 1) {
          sessionStorage.setItem('registrationID', registrationNumber);
          sessionStorage.setItem('referenceID', referenceNumber);

          // history.push("/register-address");
          // history.push("/already-registered");
          navigate('/already-registered');
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [users.user]);

  useEffect(() => {
    var mobile_no = sevaSindhuPhone;
    console.log('Mobile_No', mobile_no);

    axios
      .get(`${SERVER}/user/${mobile_no}`)
      .then((res) => {
        console.log('USerRes:', res.data);
        console.log('USerRes2:', res.data.length);
        console.log('USerRes3:', res.data.data.length);
        setUserId(res.data.data.length);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [sevaSindhuPhone]);

  const getSevaSindhuOtp = (event) => {
    event.preventDefault();
    // console.log("in getOtp-> phone:" + allValues.phone)
    // console.log("in getOtp-> users:" + JSON.stringify(users))

    console.log('USerID', userId);

    if (userId > 0) {
      showToast('ERROR', 'Mobile Number already registered');
    } else {
      if (!isSevaPhoneError && sevaSindhuPhone.length === 10) {
        setIsSevaOTPSending(!isSevaOTPSending);

        let dataToLogin = {
          mobile_code: '+91',
          phone_number: sevaSindhuPhone,
          board_id: 1,
        };
        // console.log("dataToLogin: " + JSON.stringify(dataToLogin))

        var config = {
          method: 'post',
          url: SERVER + '/user/non-register-labour-send',
          data: dataToLogin,
        };

        axios(config)
          .then(function (response) {
            console.log('response', response);

            setIsSevaOTPSending(false);
            setIsSevaOTPSent(true);
            setHashNumber(response.data.data.hash);
            showToast('SUCCESS', 'OTP has been sent Successfully.');
          })
          .catch(function (error) {
            console.log(error);
            showToast('ERROR', 'There was an error connecting to the server.');
          });
      } else {
        setIsSevaPhoneError(true);
        setSevaPhoneErrorMessage('Enter Correct Mobile Number!');
      }
    }
  };

  const login_func = (event) => {
    event.preventDefault();

    // console.log("in login_func: hash: " + JSON.stringify(users.generate_otp.data.hash))
    // const hash = users.generate_otp.data.hash

    if (
      !isSevaPhoneError &&
      sevaSindhuPhone.length === 10 &&
      sevaSindhuOTP !== ''
    ) {
      let dataToLogin = {
        otp: sevaSindhuOTP,

        hash: hashNumber,
        phone_number: sevaSindhuPhone,
      };
      // console.log("dataToLogin: " + JSON.stringify(dataToLogin))
      // const res =axios.get('https://geolocation-db.com/json/')
      // console.log(res.data);

      var config = {
        method: 'post',
        url: SERVER + '/auth/verify-otp-nonuser',
        data: dataToLogin,
      };

      axios(config)
        .then(function (response) {
          console.log('response', response);
          sessionStorage.setItem('mobileNumber', sevaSindhuPhone);
          sessionStorage.setItem('registrationID', registrationNumber);
          sessionStorage.setItem('referenceID', referenceNumber);
          // history.push("/register-address")
          // history.push("/already-registered");
          navigate('/already-registered');
        })
        .catch(function (error) {
          console.log(error);
          showToast('ERROR', 'Please enter correct OTP.');
        });
    } else if (isSevaPhoneError || sevaSindhuPhone.length !== 10) {
      setIsSevaPhoneError(true);
      setSevaPhoneErrorMessage('Enter Correct Mobile Number!');
    } else if (otp === '') {
      setIsSevaOTPError(true);
      setSevaOTPErrorMessage('Please enter correct OTP!');
    }
  };

  useEffect(() => {
    // console.log("users.generate_otp_registration:"+JSON.stringify(users.generate_otp_registration));
    // console.log("users.generate_otp_registration.message:" + users.generate_otp_registration.message)
    if (
      users.generate_otp_registration !== undefined &&
      users.generate_otp_registration !== null &&
      users.generate_otp_registration.message !== null &&
      users.generate_otp_registration.message === 'Success'
    ) {
      console.log('OTP generated Successfully');

      setIsSevaOTPSending(false);
      setIsSevaOTPSent(true);
      showToast('SUCCESS', 'OTP Sent Successfully!');
      users.generate_otp_registration.message = null;
    } else if (
      users.generate_otp_registration !== undefined &&
      users.generate_otp_registration !== null &&
      users.generate_otp_registration.message !== null &&
      users.generate_otp_registration.message !== undefined &&
      users.generate_otp_registration.message !== ''
    ) {
      console.log('OTP generate Error');

      setIsSevaOTPSending(false);
      setIsSevaOTPSent(false);
      setIsSevaPhoneError(true);
      setSevaPhoneErrorMessage(users.generate_otp_registration.message);
      showToast('ERROR', users.generate_otp_registration.message);
      users.generate_otp_registration.message = null;
    } else if (
      users.generate_otp_registration !== undefined &&
      users.generate_otp_registration !== null &&
      users.generate_otp_registration.message !== null
    ) {
      console.log('In else: error');
      console.log(
        'users.generate_otp_registration:' + users.generate_otp_registration,
      );

      setIsSevaOTPSending(false);
      setIsSevaOTPSent(false);
      setIsSevaPhoneError(true);
      setSevaPhoneErrorMessage('Error Sending OTP');

      showToast('ERROR', 'This number has already been registered.');

      users.generate_otp_registration = null;
    }
  }, [users.generate_otp_registration]);

  const ResendOTP = () => {
    if (seconds > 0) {
      setTimeout(
        () => setSeconds(seconds - 1),

        1000,
      );
      return (
        <p className="generate-otp2 mb-5">Resend OTP after {seconds} seconds</p>
      );
    } else {
      setResendReset(true);
      setSeconds(60);

      setIsSevaOTPSent(false);
      return null;
    }
  };

  return (
    <Row className="login-div">
      <Col xs={12} lg={6} xl={6} xxl={6}>
        <Row>
          <Col sm={12}>
            <div className="logo-div d-flex justify-content-start text-center">
              <img
                id="logo"
                src={logo}
                alt="..."
                className="logo-img-admin1 d-flex justify-content-start"
              />
              <div className="logo-head d-flex justify-content-start text-center">
                <h1
                  className="logo-text d-flex justify-content-start text-center"
                  style={{ color: '#CA0027', fontSize: '25px' }}
                >
                  ಕಾರ್ಮಿಕ ಇಲಾಖೆ, ಕರ್ನಾಟಕ ಸರ್ಕಾರ
                </h1>
                <h1
                  className="logo-text d-flex justify-content-start text-center"
                  style={{ color: '#CA0027', fontSize: '25px' }}
                >
                  Labour Department, Government of Karnataka
                  {/* Karnataka Building & Other Construction <br />Workers Welfare Board (KBOCWWB) */}
                </h1>
              </div>
            </div>
          </Col>
          <Col sm={12} className="login-img-col">
            <img className="login-img" alt="..." src={graphic} />
          </Col>
          <Col sm={12} className="copyright">
            {/* <p>Karnataka Building & Other Construction Workers Welfare Board (KBOCWWB), Government of Karnataka</p> */}
          </Col>
        </Row>
      </Col>

      <Col xs={12} lg={6} className="login-form container">
        <div className="d-flex justify-content-center align-items-center">
          <Typography color="error" className="text-center w-75 p-2 mt-2">
            Please go through once with the user manual before using the
            Application.
            <button
              style={{
                color: 'blue',
                outline: 'none',
                background: 'none',
                border: 'none',
              }}
              onClick={handleClickOpenDialog}
            >
              Click here to download the user manual
            </button>
          </Typography>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle id="alert-dialog-title">
              User Manual for KBOCWWB Application
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <a
                  style={{ color: 'inherit', textDecoration: 'underline' }}
                  href={userManualKan}
                  download="User Manual Kannada"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button2 color="info" startIcon={<DownloadIcon />}>
                    Download in Kannada
                  </Button2>
                </a>
              </DialogContentText>
              <DialogContentText id="alert-dialog-description">
                <a
                  style={{ color: 'inherit', textDecoration: 'underline' }}
                  href={userManualEng}
                  download="User Manual English"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button2 color="info" startIcon={<DownloadIcon />}>
                    Download in English
                  </Button2>
                </a>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button2 onClick={handleCloseDialog}>Close</Button2>
            </DialogActions>
          </Dialog>
        </div>

        <div className="login-form-container">
          {/* <h2 className="login-form-head" style={{color:'#535353'}}>ಲಾಗಿನ್ / LOGIN </h2> */}

          {/* 6 month removal */}

          <div className="div-bar text-center row">
            <Button
              variant="contained"
              className="col btn-switch text-capitalize text-center"
              size="large"
              onClick={handleLoginClick}
              style={{
                backgroundColor: isActiveLogin ? '#CA0027' : '#dee2e6',
                color: isActiveExist ? 'black' : '',
              }}
            >
              Login clear
            </Button>
            <Button
              className="col btn-switch text-capitalize text-center"
              variant="contained"
              size="large"
              onClick={handleExisitingClick}
              style={{
                backgroundColor: isActiveExist ? '#CA0027' : '#dee2e6',
                color: isActiveExist ? 'white' : 'black',
              }}
            >
              Register
            </Button>
          </div>

          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={value}
              onChange={handleChange}
            >
              <FormControlLabel
                value="sevasindhu"
                control={<Radio />}
                label="Already Existing Seva Sindhu Construction Worker / E-Karmika Construction Worker"
              />
              <FormControlLabel
                value="newlabour"
                control={<Radio />}
                label="Register as New Construction Worker"
              />
            </RadioGroup>
          </FormControl>

          <div className="d-flex justify-content-center align-items-center mt-5 flex-column">
            {/* <p className='w-100 text-center note-new-reg' style={{color:'#CA0027'}}>Note 1: "If you are already registered user and linked your Mobile number,kindly use 'Login' tab above for logging in"</p> */}
            <p
              className="w-100 text-center note-new-reg"
              style={{ color: '#CA0027' }}
            >
              Note : "For E-Karmika Labour Registration, Reference Number will
              be same as Registration Number"
            </p>
          </div>

          {value === 'sevasindhu' ? (
            <div className="row d-flex flex-column">
              <p
                className="login-form-head-sub2 w-100 ms-2 col"
                style={{ fontSize: '21px' }}
              >
                Registration Number* / ನೋಂದಣಿ ಸಂಖ್ಯೆ*
              </p>
              <div
                className="col mt-1 mb-4 ms-5 w-100 newReg"
                style={{ border: '1px solid #707070' }}
              >
                <TextField
                  type={'text'}
                  className="w-100"
                  variant="outlined"
                  name="regNo"
                  value={registrationNumber}
                  onChange={sevaSindhuRegistrationHandler}
                  disabled={isVerified ? true : false}
                  // error={allValues.registration_id_error}
                  placeholder="Example: Lo-Bhadravati 2/SHI/RGN.660583/2020-21"
                  // helperText={allValues.registration_id_error ? "Please enter numbers only" : ""}

                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start"></InputAdornment>
                    ),
                  }}
                ></TextField>
              </div>
              <p className="d-flex ms-5 justify-content-end sub-reg-req">
                As per Labour Card
              </p>

              <p
                className="login-form-head-sub2 w-100 ms-2 col"
                style={{ fontSize: '21px' }}
              >
                Reference Number* / ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ*
              </p>
              <div
                className="col mt-1 mb-4 ms-5 w-100 newReg"
                style={{ border: '1px solid #707070' }}
              >
                <TextField
                  type={'text'}
                  className="w-100"
                  variant="outlined"
                  name="refNo"
                  value={referenceNumber}
                  onChange={sevaSindhuRegistrationHandler}
                  disabled={isVerified ? true : false}
                  // error={allValues.registration_id_error}
                  placeholder="Example: LD007S200847322"
                  // helperText={allValues.registration_id_error ? "Please enter numbers only" : ""}

                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start"></InputAdornment>
                    ),
                  }}
                ></TextField>
              </div>
              <p className="d-flex ms-5 justify-content-end sub-reg-req">
                As per Labour Card
              </p>

              {isVerified === false ? (
                <div className="d-flex justify-content-end align-items-end ms-2">
                  <div
                    className="row ms-4 d-flex justify-content-end"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    <p
                      style={{
                        pointerEvents: isDisableVerifyBtn ? 'none' : 'all',
                      }}
                      className="login-button w-25 bottom-btn"
                      onClick={handleVerify}
                    >
                      Verify
                    </p>
                  </div>
                </div>
              ) : null}

              {isVerified ? (
                <>
                  <p
                    className="login-form-head-sub2 w-100 ms-2 my-0 col"
                    style={{ fontSize: '21px' }}
                  >
                    Mobile Number* / ಮೊಬೈಲ್ ಸಂಖ್ಯೆ*
                  </p>
                  <div
                    className="col mt-1 mb-4 ms-5 w-100 newReg"
                    style={{ border: '1px solid #707070' }}
                  >
                    <TextField
                      type={'text'}
                      className="w-100"
                      variant="outlined"
                      name="sevaPhone"
                      value={sevaSindhuPhone}
                      onChange={sevaSindhuRegistrationHandler}
                      error={isSevaPhoneError}
                      placeholder=""
                      helperText={
                        isSevaPhoneError
                          ? 'Please enter correct Phone Number'
                          : ''
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <img
                              src={mobile}
                              alt="Mobile Icon"
                              className="phone-icon"
                            />
                          </InputAdornment>
                        ),
                      }}
                    ></TextField>
                  </div>

                  <div className="row">
                    {!isSevaOTPSent ? (
                      <div className="d-flex justify-content-end align-items-end ms-5">
                        <Link
                          to="#"
                          onClick={(event) => getSevaSindhuOtp(event)}
                        >
                          <p className="login-button bottom-btn otp-btn">
                            {resendReset ? 'Resend new OTP  ' : 'Generate OTP'}
                          </p>
                        </Link>
                      </div>
                    ) : (
                      <div className="d-flex justify-content-end align-items-end ms-4">
                        <ResendOTP />
                      </div>
                    )}
                  </div>

                  <p
                    className="login-form-head-sub2 w-100 ms-2 col"
                    style={{ fontSize: '21px' }}
                  >
                    Enter OTP* / ಒಟಿಪಿ ನಮೂದಿಸಿ*
                  </p>
                  <div
                    className="col mt-1 mb-4 ms-5 w-100 newReg"
                    style={{ border: '1px solid #707070' }}
                  >
                    <TextField
                      type={'password'}
                      className="w-100"
                      variant="outlined"
                      name="sevaOTP"
                      value={sevaSindhuOTP}
                      onChange={sevaSindhuRegistrationHandler}
                      error={isSevaOTPError}
                      // placeholder=""
                      helperText={
                        isSevaOTPError ? 'Please enter correct OTP!' : ''
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start"></InputAdornment>
                        ),
                      }}
                    ></TextField>
                  </div>
                  <div className="d-flex justify-content-end align-items-end ms-4">
                    <Link to="#" onClick={(event) => login_func(event)}>
                      <p className="login-button bottom-btn" type="submit">
                        Submit
                      </p>
                    </Link>
                  </div>
                </>
              ) : null}
            </div>
          ) : (
            <>
              <div className="note">
                ಆಧಾರ್ ನೋಂದಾಯಿತ ಪ್ರಕಾರ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ / Enter Mobile
                Number as per the Aadhaar Registered
              </div>

              <form noValidate>
                <FormControl fullWidth className="reg-phno-field">
                  <TextField
                    className="size21"
                    name="newPhone"
                    value={newRegistrationPhone}
                    type="phone"
                    onChange={newRegistrationHandler}
                    error={isPhoneError}
                    helperText={isPhoneError ? phoneErrorMessage : null}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <img src={mobile} alt="..." className="phone-icon" />
                          <p className="countrycode">+91</p>
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                  />
                </FormControl>

                {isOTPSending ? (
                  <CircularProgress className="loader-otp" />
                ) : (
                  <Link to="#" onClick={(event) => getOtp(event)}>
                    <p className="generate-otp">
                      {/* ಒಟಿಪಿ ಬಳಸಿ / Generate OTP */}
                      {isOTPSent
                        ? 'ಹೊಸ ಒಟಿಪಿ ಅನ್ನು ಮರುಕಳುಹಿಸಿ / Resend new OTP'
                        : 'ಒಟಿಪಿ ಬಳಸಿ / Generate OTP'}
                    </p>
                  </Link>
                )}

                <p className="reg-otp-label">
                  ನಿಮ್ಮ ಒಟಿಪಿಯನ್ನು ನಮೂದಿಸಿ / Enter Your OTP
                </p>

                <FormControl fullWidth className="reg-otp-form">
                  <TextField
                    className="size31"
                    name="newOTP"
                    value={newRegistrationOTP}
                    type="password"
                    onChange={newRegistrationHandler}
                    error={isOtpError}
                    placeholder="ನಿಮ್ಮ ಒಟಿಪಿಯನ್ನು ನಮೂದಿಸಿ / Enter Your OTP"
                    helperText={isOtpError ? OTPErrorMessage : null}
                    variant="outlined"
                    onKeyPress={(event) => {
                      if (event.key === 'Enter') {
                        registration_func(event);
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <img src={otp} alt="..." className="otp-icon" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>

                {isSubmitting ? (
                  <CircularProgress className="loader-otp" />
                ) : (
                  <Link to="#" onClick={(event) => registration_func(event)}>
                    {/* <Link to="/profile" > */}
                    <p className="login-button" type="submit">
                      ಸಲ್ಲಿಸು / Submit
                    </p>
                  </Link>
                )}
              </form>
            </>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default Register;
