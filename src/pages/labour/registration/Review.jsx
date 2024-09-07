import {
  FormControl,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItemText,
  Tooltip,
  Checkbox,
  TextareaAutosize,
  Popover,
  Typography,
  Backdrop,
  CircularProgress,
  makeStyles,
} from '@material-ui/core';
import {
  PhoneAndroid,
  CameraAlt,
  Visibility,
  CheckBoxRounded,
  CheckBoxOutlineBlankRounded,
  CheckCircle,
} from '@material-ui/icons';
import HomeIcon from '@mui/icons-material/Home';
import React, { useEffect, useRef, useState } from 'react';
import { Col, Row, Button, OverlayTrigger } from 'react-bootstrap';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
//import MomentUtils from '@date-io/moment';
import Webcam from 'react-webcam';
import { Link, redirect, useNavigate } from 'react-router-dom';
import aadhar from '../../../assets/images/Aadhar black-01.svg';
import personal from '../../../assets/images/f1-01.svg';
import checkGreen from '../../../assets/images/Tick-01.png';
import mobilepic from '../../../assets/images/Icon awesome-mobile-alt.svg';
import pan from '../../../assets/images/PAN Black-01.svg';
import edit from '../../../assets/images/edit-01.svg';
import folder from '../../../assets/images/Folderwhite-01-01.svg';
import checkgreen from '../../../assets/images/Subtraction 1.svg';
import checkgrey from '../../../assets/images/Subtraction 2.svg';
import closeicon from '../../../assets/images/closeIcon.svg';
import male from '../../../assets/images/Mask Group 1.svg';
import female from '../../../assets/images/Mask Group 2.svg';
import { useDispatch, useSelector } from 'react-redux';
import family from '../../../assets/images/f3-01.svg';
import address from '../../../assets/images/f2-01.svg';
import bank from '../../../assets/images/f4-01.svg';
import nintydays from '../../../assets/images/f5-01.svg';
import logo from '../../../assets/images/Karnataka_logo_100_Pixels.png';
import { Required } from '../../../utils/tools';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';
import text from '../../../translations';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  finalSubmit,
  reviewDetails,
} from '../../../features/ReviewSlice/ReviewSlice';
import dayjs from 'dayjs';
import { getCatalogDetails } from '../../../features/personalDetails/catalogSlice';
import { SERVER } from '../../../features/auth/authSlice';
import { uploadFileAPI } from '../../../features/personalDetails/uploadImage';

const Review = ({ setRenderComponent }) => {
  const { header } = text.en;
  const { en } = text;

  const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: '#ffffffee',
      color: '#000',
      display: 'block',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    backdropCheck: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#6CC17A',
    },
    backdropCheckp: {
      fontSize: '30px',
      fontWeight: 'bold',
    },
  }));

  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElpassbook_nominee, setAnchorElpassbook_nominee] =
    React.useState(null);
  const [anchorElninty, setAnchorElninty] = React.useState(null);
  const [anchorElration, setAnchorElration] = React.useState(null);
  const [anchorElEducation, setAnchorElEducation] = React.useState(null);
  const [selectedfiles, setselectedfiles] = React.useState({});

  const [allValues, setAllValues] = React.useState({
    profliePicUploadResponse: users?.review.profliePicUploadResponse,
    rationCardUploadResponse: users?.review.rationCardUploadResponse,
    passbookUploadResponse: users?.review.passbookUploadResponse,
    passbookNomineeUploadResponse: users?.review.passbookNomineeUploadResponse,
    finalSubmitted: false,
    permanentData: {
      streetRoad: '',
      city: '',
      district: '',
      landmark: '',
      houseBuilding: '',
      areaVillage: '',
      taluk: '',
      state: '',
      pincode: '',
    },
  });

  const [loading, setLoading] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  const [certificateDocs, setcertificateDocs] = React.useState({});
  const [BankDocs, setBankDocs] = React.useState({});
  const [NomineeBankDocs, setNomineeBankDocs] = React.useState({});
  const [RationDocs, setRationDocs] = React.useState({});
  const [selected_document_type, setselected_document_type] =
    React.useState('');

  const [fetchedData, setFetchedData] = useState({});
  const [passbookDoc, setPassbookDoc] = React.useState([]);
  const [rationCardDocs, setRationCardDocs] = React.useState([]);
  const [nintyDaysDocs, setNintyDaysDocs] = React.useState([]);
  const [passbookDocNominee, setPassbookDocNominee] = React.useState([]);
  const [religionName, setReligionName] = React.useState([]);
  const [rationCardTypeData, setRationCardType] = React.useState([]);
  const navigate = useNavigate();
  const [showImage, setShowImage] = React.useState(null);
  const [showPassbookDocId, setShowPassbookDocId] = React.useState(null);
  const [passbookPicture, setPassbookPicture] = React.useState(null);
  const [showPassbookNomineeDocId, setShowPassbookNomineeDocId] =
    React.useState(null);
  const [passbookNomineePicture, setPassbookNomineePicture] =
    React.useState(null);
  const [nintyDaysPicture, setNintyDaysPicture] = React.useState(null);
  const [showRationDocId, setShowRationDocId] = React.useState(null);
  const [showNintyDocId, setShowNintyDocId] = React.useState(null);
  const [rationPicture, setRationPicture] = React.useState(null);
  const [eduDocument, setEduDocument] = React.useState(null);
  const [showEducationDocId, setShowEducationDocId] = React.useState(null);
  const [educDocPicture, setEducDocPicture] = React.useState(null);
  const [selfDeclarationDoc, setSelfDeclarationDoc] = React.useState(null);
  const [ackDetails, setAckDetails] = useState(null);

  const GetReligion = async (catalog_name) => {
    let payload = {
      board_id: 1,
      catalog_name: catalog_name,
    };
    try {
      const response = await dispatch(getCatalogDetails(payload));
      return response.payload.data;
    } catch (error) {
      console.error('Error fetching catalog details:', error);
    }
  };

  const GetOptionOfRationCardType = async (catalog_name) => {
    let payload = {
      board_id: 1,
      catalog_name: catalog_name,
    };

    try {
      const response = await dispatch(getCatalogDetails(payload));
      return response.payload.data;
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const removefile = () => {
    setselectedfiles({});
    setSelfDeclarationDoc(null);
  };

  useEffect(() => {
    const data = async () => {
      const details = {
        key: 'user_id',
        value: Cookies.get('id'),
        board_id: 1,
        procedure_name: 'all',
      };
      const response = await dispatch(reviewDetails(details));
      console.log(response.payload.data);
      if (response.payload.data.application_details?.length !== 0) {
        if (response.payload.data.application_details?.[0]?.application_no) {
          setAllValues({ ...allValues, finalSubmitted: true });
          const applicationDetails =
            response.payload.data?.application_details?.[0];
          const gscNo = response.payload.data?.employer_details?.[0]?.gsc_no;

          if (gscNo) {
            setAckDetails({ ...applicationDetails, gsc_no: gscNo });
          }
        }
      }
      if (response.payload.data.bank_details?.length !== 0) {
        const doc1 =
          response.payload.data.bank_details?.[0]?.bank_upload_files_xml;
        setPassbookDoc(JSON.parse(doc1));
        if (response.payload.data.bank_details?.length > 1) {
          const doc2 =
            response.payload.data.bank_details?.[1]?.bank_upload_files_xml;
          setPassbookDocNominee(JSON.parse(doc2));
        }
      }
      if (
        response.payload.data.personal_details?.[0]?.qualification_document_id
      ) {
        const data = JSON.parse(
          response.payload.data.personal_details?.[0]
            ?.qualification_document_id,
        );
        setEduDocument(data);
      }
      if (response.payload.data.ration_card_details?.length !== 0) {
        const rationDoc =
          response.payload.data.ration_card_details?.[0]?.ration_card_files_xml;
        setRationCardDocs(JSON.parse(rationDoc));
      }
      if (response.payload.data.certificate_details?.length !== 0) {
        const nintyDays =
          response.payload.data.certificate_details?.[0]
            ?.document_uplaod_files_xml;
        setNintyDaysDocs(JSON.parse(nintyDays));
      }
      setFetchedData(response.payload.data);
      const religionData = await GetReligion('Religion');
      const data = religionData?.filter(
        (e) =>
          e.value_id ===
          response.payload.data.personal_details?.[0]
            ?.catalog_value_religion_id,
      );
      setReligionName(data);
      const rationCard = await GetOptionOfRationCardType('Ration card type');
      const rationData = rationCard?.filter(
        (e) =>
          JSON.stringify(e.value_id) ===
          response.payload.data.ration_card_details?.[0]?.ration_card_no,
      );
      setRationCardType(rationData);
    };
    data();
  }, []);
  console.log(fetchedData);

  const handleClick = (event, data, selecteddoc) => {
    console.error('handleclick data:' + data);
    setselected_document_type(selecteddoc);

    if (data === 'passbook') {
      setAnchorEl(event.currentTarget);
      setShowPassbookDocId(selecteddoc?.file_id);
    } else if (data === 'passbook_nominee') {
      setAnchorElpassbook_nominee(event.currentTarget);
      setShowPassbookNomineeDocId(selecteddoc?.file_id);
    } else if (data === 'ninty') {
      setAnchorElninty(event.currentTarget);
      setShowNintyDocId(selecteddoc?.file_id);
    } else if (data === 'ration') {
      setAnchorElration(event.currentTarget);
      setShowRationDocId(selecteddoc?.file_id);
    } else if (data === 'education_document') {
      setAnchorElEducation(event.currentTarget);
      setShowEducationDocId(selecteddoc?.file_id);
    }
  };

  const handleClose = (event, data) => {
    console.error('handleClose data:' + data);
    if (data === 'passbook') setAnchorEl(null);
    else if (data === 'passbook_nominee') setAnchorElpassbook_nominee(null);
    else if (data === 'ninty') setAnchorElninty(null);
    else if (data === 'ration') setAnchorElration(null);
    else if (data === 'education_document') setAnchorElEducation(null);
  };

  const openEducation = Boolean(anchorElEducation);
  const educationid = openEducation ? 'simple-popover' : undefined;

  const openPassbook = Boolean(anchorEl);
  const id = openPassbook ? 'simple-popover' : undefined;

  const openPassbookNominee = Boolean(anchorElpassbook_nominee);
  const idpassbook_nominee = openPassbookNominee ? 'simple-popover' : undefined;

  const openninty = Boolean(anchorElninty);
  const idninty = openninty ? 'simple-popover' : undefined;

  const openration = Boolean(anchorElration);
  const idration = openration ? 'simple-popover' : undefined;

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleToggleBackdrop = () => {
    setOpenBackdrop(!openBackdrop);
  };
  const finalSubmitButtonPressed = () => {
    console.error('in finalSubmitButtonPressed');

    if (allValues.declaration && allValues.declaration2) {
      console.error('in allValues.declaration: ' + allValues.declaration);
      console.error('in allValues.declaration2: ' + allValues.declaration2);
      setOpenBackdrop(true);
      setLoading(true);
      setSubmitSuccess(false);

      submitFinalSubmit();
    } else {
      showToast('ERROR', 'Please Accept the Declarations!');
    }
  };

  const [AckLetterImg, setAckLetterImg] = React.useState('');
  const [ackId, setackId] = React.useState('');

  const callRegistrationDetails = async () => {
    const dataToSubmit = {
      board_id: 1,
      key: 'user_id',
      value: parseInt(Cookies.get('id')),
      procedure_name: 'all',
    };

    const response = await dispatch(reviewDetails(dataToSubmit));
    if (response.payload.success) {
      const applicationDetails =
        response.payload.data?.application_details?.[0];
      const gscNo = response.payload.data?.employer_details?.[0]?.gsc_no;

      if (gscNo) {
        setAckDetails({ ...applicationDetails, gsc_no: gscNo });
        setSubmitSuccess(true);
        //setLoading(false);
      }
    }
  };

  const submitFinalSubmit = async () => {
    let dataToSubmit = {
      labourUserId: parseInt(Cookies.get('id')),
      boardId: 1,
      certificateDetailsId: fetchedData?.certificate_details?.[0]?.id,
      driveUserId: fetchedData?.certificate_details?.[0]?.labour_incpector_id,
      selfDeclaration: selfDeclarationDoc,
    };

    console.error('dataToSubmit', JSON.stringify(dataToSubmit));

    const response = await dispatch(finalSubmit(dataToSubmit));
    if (response.payload.success) {
      callRegistrationDetails();
    }
  };

  const callSaveAcknowledgementId = () => {
    if (ackId !== '') {
      let dataToSubmit = {
        ack_id: ackId,
        id: users.user.id,
      };

      console.error('dataToSubmit', JSON.stringify(dataToSubmit));

      dispatch(saveAcknowledgementId(dataToSubmit));
    }
  };

  const getfilebase64 = (config) => {
    return new Promise((resolve, reject) => {
      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));

          resolve(response.data.data);
        })
        .catch(function (error) {
          console.log(error);
          reject(error);
        });
    });
  };

  const printDocument = () => {
    const input = document.getElementById('divToPrint');
    input.style.display = 'block';
    html2canvas(input, {
      scrollY: -window.scrollY,
      // allowTaint: true,
      // useCORS: true
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        setAckLetterImg(imgData);
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
        // pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.save('acknowledgement.pdf');
        window.open(pdf.output('bloburl'), '_blank');
      })
      .then(() => {
        input.style.display = 'none';
      });
  };

  const image = () => {
    if (fetchedData?.personal_details?.[0].user_photo_id) {
      axios
        .get(
          `${SERVER}api/upload/download_base_64/${fetchedData?.personal_details?.[0].user_photo_id}`,
        )
        .then((res) => {
          const { data } = res.data;
          setShowImage(`data:image/png;base64,${data.base_64_content}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  image();

  const insertSelfDeclarationDetails = (selfDeclarationFileAPI) => {
    const selfDeclarationFile = [
      {
        file_id: selfDeclarationFileAPI.fileId,
        file_name: selfDeclarationFileAPI.originalFileName,
      },
    ];
    setSelfDeclarationDoc(selfDeclarationFile);
  };

  const handleFileChange = async (event) => {
    if (event.target.files[0].size > 2000001) {
      toast.error('ERROR', 'Please upload file of size less than 2MB.', {
        position: 'bottom-right',
        theme: 'colored',
        autoClose: 3000,
      });
    } else if (!event.target.files[0].type.includes('image')) {
      toast.error('ERROR', 'Please upload file in JPEG or PNG format.', {
        position: 'bottom-right',
        theme: 'colored',
        autoClose: 3000,
      });
    } else {
      const joined = Array.from(selectedfiles).concat(
        Array.from(event.target.files),
      );
      setselectedfiles(joined);
      const selfDeclarationFileAPI = await dispatch(
        uploadFileAPI(
          event.target.files[0],
          event.target.files[0].name,
          Cookies.get('id'),
          'selfDeclarationFile',
        ),
      );
      insertSelfDeclarationDetails(selfDeclarationFileAPI.payload.image);
    }
  };

  if (ackDetails && ackDetails.application_no) {
    appNo = ackDetails.application_no;
  }

  var gscNo = '';
  if (ackDetails && ackDetails.gsc_no) {
    gscNo = ackDetails.gsc_no;
  }

  useEffect(() => {
    if (showPassbookDocId) {
      axios
        .get(`${SERVER}api/upload/download_base_64/${showPassbookDocId}`)
        .then((res) => {
          const { data } = res.data;
          setPassbookPicture(`data:image/png;base64,${data.base_64_content}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (showPassbookNomineeDocId) {
      axios
        .get(`${SERVER}api/upload/download_base_64/${showPassbookNomineeDocId}`)
        .then((res) => {
          const { data } = res.data;
          setPassbookNomineePicture(
            `data:image/png;base64,${data.base_64_content}`,
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (showRationDocId) {
      axios
        .get(`${SERVER}api/upload/download_base_64/${showRationDocId}`)
        .then((res) => {
          const { data } = res.data;
          setRationPicture(`data:image/png;base64,${data.base_64_content}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (showEducationDocId) {
      axios
        .get(`${SERVER}api/upload/download_base_64/${showEducationDocId}`)
        .then((res) => {
          const { data } = res.data;
          setEducDocPicture(`data:image/png;base64,${data.base_64_content}`);
          console.log(`data:image/png;base64,${data.base_64_content}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (showNintyDocId) {
      axios
        .get(`${SERVER}api/upload/download_base_64/${showNintyDocId}`)
        .then((res) => {
          const { data } = res.data;
          setNintyDaysPicture(`data:image/png;base64,${data.base_64_content}`);
          console.log(`data:image/png;base64,${data.base_64_content}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [
    showPassbookDocId,
    showPassbookNomineeDocId,
    showRationDocId,
    showEducationDocId,
    showNintyDocId,
  ]);

  const handleChangeCheckbox = (event) => {
    setAllValues({ ...allValues, [event.target.name]: event.target.checked });
  };

  var appNo = '';
  var applicantName = '';
  var villageWard = '';
  var mobile = '';
  var occupation = '';
  var officerIncharge = '';
  var circleName = '';
  var labour_incpector_id = '';
  var labour_union_id = '';
  var spoke_person = '';
  var address = '';
  var phone_no = '';
  var circle_id = '';
  var designation = '';

  return (
    <>
      <Row className="m-0">
        {loading ? (
          <Backdrop
            className={classes.backdrop}
            open={openBackdrop}
            onClick={loading ? null : handleCloseBackdrop}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : null}

        {submitSuccess ? (
          <Backdrop
            className={classes.backdrop}
            open={openBackdrop}
            onClick={loading ? null : handleCloseBackdrop}
          >
            <div style={{ display: 'block' }}>
              <CheckCircle
                className={classes.backdropCheck}
                style={{ height: 'auto', width: '200px' }}
              />
              <p className="final-success-title">
                {en.success1}
                <br />
                {en.success2}
                <br />
                {en.success3}
              </p>

              <p className="final-success-link-p">
                {en.downloadAckLetter}
                <Link
                  to="#"
                  onClick={printDocument}
                  style={{ flexGrow: '0.5' }}
                >
                  <span
                    variant="outline-primary"
                    className="final-success-link"
                  >
                    {' '}
                    {en.clickHere}
                  </span>
                </Link>
              </p>
              <p className="final-success-link-p">
                Back To Dashboard Migrant
                <Link to="/dashboardMigrant" style={{ flexGrow: '0.5' }}>
                  <span
                    variant="outline-primary"
                    className="final-success-link"
                  >
                    {' '}
                    {en.clickHere}
                  </span>
                </Link>
              </p>
            </div>
          </Backdrop>
        ) : null}
        <ToastContainer />

        <Row className="final all-details-subtitle-row">
          <Col xs={12} md={12} className="profile-title">
            <img alt="..." src={personal} />

            <h1>{en.personalDetails}</h1>
            {!allValues.finalSubmitted ? (
              <p onClick={() => setRenderComponent(0)}>
                {en.edityourdetails}
                <img src={edit} />
              </p>
            ) : (
              <p
                style={{
                  backgroundColor: '#F3F6F8',
                  boxShadow: 'none',
                  color: 'black',
                }}
              >
                Submitted{' '}
                <CheckCircle
                  className={classes.backdropCheck}
                  style={{ height: 'auto', width: '20px' }}
                />
              </p>
            )}
          </Col>
        </Row>

        <Row className="form-row-final mt-4">
          <Col xs={12} md={4} className="final-personal-col-1 px-3">
            <Required className="mb-0" title={en.firstName} />
            <FormControl fullWidth>
              <TextField
                name="firstname"
                value={
                  fetchedData
                    ? fetchedData.personal_details?.[0].first_name
                    : ''
                }
                disabled
              />
            </FormControl>

            <p className="mt-3 mb-0 text-start">{en.middleName} </p>
            <FormControl fullWidth>
              <TextField
                name="middlename"
                value={
                  fetchedData
                    ? fetchedData.personal_details?.[0].middle_name
                    : ''
                }
                disabled
              />
            </FormControl>

            <p className="mt-3 mb-0 text-start">{en.lastName}</p>

            <FormControl fullWidth>
              <TextField
                placeholder="Enter Your Last Name"
                value={
                  fetchedData ? fetchedData.personal_details?.[0].last_name : ''
                }
                disabled
              />
            </FormControl>

            <p className="mt-3 mb-0 text-start">{en.enterYourPANCardNumber}</p>

            <FormControl fullWidth className="pan-div">
              <TextField
                disabled
                value={
                  fetchedData ? fetchedData.personal_details?.[0].pan_no : ''
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img alt="..." src={pan} />
                    </InputAdornment>
                  ),
                  // endAdornment:
                  //     <InputAdornment position="start">
                  //         {
                  //             users.getUserRegistrationDetails.personal_details[0].pancheck ?
                  //                 (<img alt="..." src={checkgreen} />)
                  //                 :
                  //                 (<img alt="..." src={checkgrey} />)
                  //         }
                  //     </InputAdornment>,
                }}
              />
            </FormControl>

            <p className="mt-3 mb-0 text-start">{en.ayushmanholder}</p>

            {fetchedData.personal_details?.[0]?.is_ayushman_card_holder ? (
              <>
                <FormControl
                  className="mt-2 mb-2 interstateRadio formcontrol9"
                  variant="outlined"
                  fullWidth={true}
                  component="fieldset"
                >
                  <RadioGroup row name="is_ayushman_card_holder">
                    <FormControlLabel
                      disabled
                      value="1"
                      checked
                      control={<Radio />}
                      label={en.yes}
                    />
                    <FormControlLabel
                      disabled
                      value="0"
                      control={<Radio />}
                      label={en.no}
                    />
                  </RadioGroup>
                  <p className="mt-3 mb-0 text-start">
                    {en.ayushmancardnumber}
                  </p>
                  <TextField
                    value={
                      fetchedData
                        ? fetchedData.personal_details?.[0].ayushman_card_number
                        : ''
                    }
                    disabled
                  />
                </FormControl>
              </>
            ) : (
              <>
                <FormControl
                  className="mt-2 mb-2 interstateRadio formcontrol9"
                  variant="outlined"
                  fullWidth={true}
                  component="fieldset"
                >
                  <RadioGroup row name="is_ayushman_card_holder">
                    <FormControlLabel
                      disabled
                      value="1"
                      control={<Radio />}
                      label={en.yes}
                    />
                    <FormControlLabel
                      disabled
                      value="0"
                      checked
                      control={<Radio />}
                      label={en.no}
                    />
                  </RadioGroup>
                </FormControl>
              </>
            )}
          </Col>

          <Col xs={12} md={4} className="final-personal-col-2 px-3">
            <Required className="mb-0" title={en.enterYourMobileNumber} />

            <FormControl fullWidth className="formcontrol2">
              <TextField
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneAndroid className="phone-icon" />
                      +91
                    </InputAdornment>
                  ),
                }}
                value={
                  fetchedData ? fetchedData.personal_details?.[0].mobile_no : ''
                }
              />
            </FormControl>

            <p className="mt-3 mb-0 text-start">
              {en.enterEmailAddress}{' '}
              <span className="optional">(Optional)</span>
            </p>

            <FormControl fullWidth className="formcontrol3">
              <TextField
                name="email"
                value={
                  fetchedData ? fetchedData.personal_details?.[0].mail_id : ''
                }
                disabled
              />
            </FormControl>

            <p className="mt-3 mb-0 text-start">
              {en.enterYourAadharCardNumber}*
            </p>

            <FormControl fullWidth className="pan-div">
              <TextField
                disabled
                value={
                  fetchedData
                    ? fetchedData?.personal_details?.[0].aadhar_no !== null &&
                      fetchedData?.personal_details?.[0].aadhar_no.replace(
                        /\d(?=\d{4})/g,
                        'X',
                      )
                    : ''
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img alt="..." src={aadhar} />
                    </InputAdornment>
                  ),
                  // endAdornment:
                  //     <InputAdornment position="start">
                  //         {
                  //             users?.getUserRegistrationDetails.personal_details[0].pancheck ?
                  //                 (<img alt="..." src={checkgreen} />)
                  //                 :
                  //                 (<img alt="..." src={checkgrey} />)
                  //         }
                  //     </InputAdornment>,
                }}
              />
            </FormControl>
            <p className="mt-3 mb-0 text-start">{en.interstateMigrantWorker}</p>
            {fetchedData.personal_details?.[0]?.is_inter_state_migrant ? (
              <>
                <FormControl
                  className="mt-2 mb-2 interstateRadio formcontrol9"
                  variant="outlined"
                  fullWidth={true}
                  component="fieldset"
                >
                  <RadioGroup row name="is_inter_state_migrant">
                    <FormControlLabel
                      disabled
                      value="1"
                      checked
                      control={<Radio />}
                      label={en.yes}
                    />
                    <FormControlLabel
                      disabled
                      value="0"
                      control={<Radio />}
                      label={en.no}
                    />
                  </RadioGroup>
                  <p className="mt-3 mb-0 text-start">{en.migrantFromState}</p>
                  <TextField
                    value={
                      fetchedData ? fetchedData.personal_details?.[0].state : ''
                    }
                    disabled
                  />
                </FormControl>
              </>
            ) : (
              <>
                {' '}
                <FormControl
                  className="mt-2 mb-2 interstateRadio formcontrol9"
                  variant="outlined"
                  fullWidth={true}
                  component="fieldset"
                >
                  <RadioGroup row name="is_inter_state_migrant">
                    <FormControlLabel
                      disabled
                      value="1"
                      control={<Radio />}
                      label={en.yes}
                    />
                    <FormControlLabel
                      disabled
                      value="0"
                      checked
                      control={<Radio />}
                      label={en.no}
                    />
                  </RadioGroup>
                </FormControl>
              </>
            )}

            <p className="mt-3 mb-0 text-start">{en.interstateDistict}</p>
            {fetchedData.personal_details?.[0]?.is_inter_district ? (
              <>
                <FormControl
                  className="mt-2 mb-2 interstateRadio formcontrol9"
                  variant="outlined"
                  fullWidth={true}
                  component="fieldset"
                >
                  <RadioGroup row name="is_inter_district">
                    <FormControlLabel
                      disabled
                      value="1"
                      checked
                      control={<Radio />}
                      label={en.yes}
                    />
                    <FormControlLabel
                      disabled
                      value="0"
                      control={<Radio />}
                      label={en.no}
                    />
                  </RadioGroup>
                  <p className="mt-3 mb-0 text-start">
                    {en.migrantFromDistrict}
                  </p>
                  <TextField
                    value={
                      fetchedData
                        ? fetchedData.personal_details?.[0].inter_district_name
                        : ''
                    }
                    disabled
                  />
                </FormControl>
              </>
            ) : (
              <>
                <FormControl
                  className="mt-2 mb-2 interstateRadio formcontrol9"
                  variant="outlined"
                  fullWidth={true}
                  component="fieldset"
                >
                  <RadioGroup row name="is_inter_district">
                    <FormControlLabel
                      disabled
                      value="1"
                      control={<Radio />}
                      label={en.yes}
                    />
                    <FormControlLabel
                      disabled
                      value="0"
                      checked
                      control={<Radio />}
                      label={en.no}
                    />
                  </RadioGroup>
                </FormControl>
              </>
            )}
          </Col>
          <Col xs={12} md={4} className="final-personal-col-3 px-3">
            <div className="picupload">
              {!fetchedData?.personal_details?.[0].user_photo_id ? (
                <CameraAlt className="cameraAlt2" />
              ) : (
                <img
                  alt="..."
                  className="avatar border-gray"
                  src={showImage && showImage}
                  style={{ width: '200px', height: '200px' }}
                />
              )}
            </div>

            <div className="mt-3 final-display-flex">
              <p className="m-0 text-start ">{en.maritalStatus}*</p>

              <p className="m-0 p-0">
                {fetchedData
                  ? fetchedData.personal_details?.[0].marital_status
                  : ''}
              </p>
            </div>

            <div className="mt-3 final-display-flex">
              <p className="m-0 text-start">{en.gender}*</p>

              {
                {
                  27: (
                    <p className="m-0 p-0">
                      <img alt="..." src={male} />
                      <span>Male</span>
                    </p>
                  ),
                  28: (
                    <p className="m-0 p-0">
                      <img alt="..." src={female} />
                      <span>Female</span>
                    </p>
                  ),
                  29: (
                    <p className="m-0 p-0">
                      {/* <img alt="..." src={radioon}/> */}
                      <span>Others</span>
                    </p>
                  ),
                }[
                  fetchedData
                    ? fetchedData.personal_details?.[0].catalog_value_gender_id
                    : ''
                ]
              }
            </div>

            <div className="mt-3 final-display-flex">
              <p className="m-0 text-start">{en.dOB}*</p>

              <p className="m-0 p-0">
                {fetchedData
                  ? dayjs(
                      fetchedData.personal_details?.[0]?.date_of_birth,
                    ).format('MM-DD-YYYY')
                  : ''}
              </p>
            </div>

            <div className="mt-3 final-display-flex">
              <p className="m-0 text-start">{en.category}</p>
              <p className="m-0 p-0">
                {fetchedData ? fetchedData.personal_details?.[0].caste : ''}
              </p>
            </div>

            <div className="mt-3 final-display-flex">
              <p className="m-0 text-start">{en.religion}</p>
              <p className="m-0 p-0">
                {religionName ? religionName?.[0]?.description : ''}
              </p>
            </div>

            <div className="mt-3">
              <p className="m-0 text-start">{en.education}</p>
              <TextField
                value={
                  fetchedData
                    ? fetchedData.personal_details?.[0].qualification
                    : ''
                }
                disabled
              />
            </div>
            {fetchedData?.personal_details?.[0].catalog_value_qualification_id >
              18 && (
              <>
                <p className="mt-3 text-start">{en.qualificationDoc}</p>
                <div className="browsebutton2-div final">
                  <FormControl>
                    <TextField
                      variant="outlined"
                      name="education_document"
                      value={eduDocument[0].file_name}
                      style={{ width: '-webkit-fill-available' }}
                      disabled
                    />
                  </FormControl>
                  <label
                    className="browse-button2"
                    onClick={(e) =>
                      handleClick(e, 'education_document', eduDocument[0])
                    }
                  >
                    {en.view} <Visibility />
                  </label>
                  <div>
                    <Popover
                      id={educationid}
                      open={openEducation}
                      anchorEl={anchorElEducation}
                      onClose={(e) => handleClose(e, 'education_document')}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                    >
                      <img
                        src={educDocPicture}
                        alt="educationDoc"
                        style={{ width: '600px', height: '300px' }}
                      />
                    </Popover>
                  </div>
                </div>
              </>
            )}
          </Col>
        </Row>

        <Row className="mt-5 mb-0 final all-details-subtitle-row">
          <Col xs={12} md={12} className="profile-title mmb-0">
            <HomeIcon style={{ width: '40px', height: '40px' }} />
            <h1>{en.addressDetails}</h1>
            {!allValues.finalSubmitted ? (
              <p onClick={() => setRenderComponent(1)}>
                {en.edityourdetails}
                <img src={edit} />
              </p>
            ) : (
              <p
                style={{
                  backgroundColor: '#F3F6F8',
                  boxShadow: 'none',
                  color: 'black',
                }}
              >
                Submitted{' '}
                <CheckCircle
                  className={classes.backdropCheck}
                  style={{ height: 'auto', width: '20px' }}
                />
              </p>
            )}
          </Col>
        </Row>

        <Row className="form-row-final with-border mt-0">
          <Col xs={12} className="profile-title">
            <h2>{en.residentialAddress}</h2>
          </Col>
          <Col xs={12} md={4} className="final-personal-col-1 px-3">
            <Required className="mt-0 mb-2" title={en.typeOfresidence} />
            <FormControl fullWidth>
              <TextField
                variant="outlined"
                value={
                  fetchedData
                    ? fetchedData?.address_details?.[0]?.address_type
                    : ''
                }
                disabled
              />
            </FormControl>

            <p className="mt-3 mb-0 text-start">{en.cityName}*</p>
            <FormControl fullWidth>
              <TextField
                variant="outlined"
                value={
                  fetchedData
                    ? fetchedData?.address_details?.[0]?.panhayat_city_town
                    : ''
                }
                disabled
              />
            </FormControl>

            <p className="mt-3 mb-0 text-start">{en.villageName}*</p>
            <FormControl fullWidth>
              <TextField
                variant="outlined"
                value={
                  fetchedData
                    ? fetchedData?.address_details?.[0]?.ward_area_village
                    : ''
                }
                disabled
              />
            </FormControl>
          </Col>

          <Col xs={12} md={4} className="final-personal-col-1 px-3">
            <Required className="mb-0" title={en.houseBuildingNumber} />
            <FormControl fullWidth>
              <TextField
                variant="outlined"
                value={
                  fetchedData ? fetchedData?.address_details?.[0]?.door_no : ''
                }
                disabled
              />
            </FormControl>

            <p className="mt-3 mb-0 text-start">{en.district}*</p>
            <FormControl fullWidth>
              <TextField
                variant="outlined"
                value={
                  fetchedData ? fetchedData?.address_details?.[0]?.district : ''
                }
                disabled
              />
            </FormControl>

            <p className="mt-3 mb-0 text-start">{en.taluk}*</p>

            <FormControl fullWidth>
              <TextField
                variant="outlined"
                value={
                  fetchedData ? fetchedData?.address_details?.[0]?.taluk : ''
                }
                disabled
              />
            </FormControl>
          </Col>

          <Col xs={12} md={4} className="final-personal-col-1 px-3">
            <Required className="mb-0" title={en.streetRoadName} />
            <FormControl fullWidth>
              <TextField
                variant="outlined"
                value={
                  fetchedData
                    ? fetchedData?.address_details?.[0]?.street_name
                    : ''
                }
                disabled
              />
            </FormControl>

            <p className="mt-3 mb-0 text-start">{en.landmark}</p>
            <FormControl fullWidth>
              <TextField
                variant="outlined"
                value={
                  fetchedData
                    ? fetchedData?.address_details?.[0]?.land_mark
                    : ''
                }
                disabled
              />
            </FormControl>

            <Row>
              <Col xs={6} className="final-personal-col-1 ">
                <p className="mt-3 mb-0 text-start">{en.state}*</p>
                <FormControl fullWidth>
                  <TextField
                    variant="outlined"
                    value={
                      fetchedData
                        ? fetchedData?.address_details?.[0]?.state
                        : ''
                    }
                    disabled
                  />
                </FormControl>
              </Col>
              <Col xs={6} className="final-personal-col-1 ">
                <p className="mt-3 mb-0 text-start">{en.pin_code}*</p>
                <FormControl fullWidth>
                  <TextField
                    variant="outlined"
                    value={
                      fetchedData
                        ? fetchedData?.address_details?.[0]?.pin_code
                        : ''
                    }
                    disabled
                  />
                </FormControl>
              </Col>
            </Row>
          </Col>

          <Col xs={12} className="profile-title permanentAddress">
            <h2>{en.permanentAddress}</h2>
          </Col>
          <Col xs={12} md={4} className="final-personal-col-1 px-3">
            <Required className="mb-0" title={en.houseBuildingNumber} />

            <FormControl fullWidth>
              <TextField
                variant="outlined"
                value={allValues.permanentData.houseBuilding}
                disabled
              />
            </FormControl>

            <p className="mt-3 mb-0 text-start">{en.district}*</p>
            <FormControl fullWidth>
              <TextField
                variant="outlined"
                value={allValues.permanentData.district}
                disabled
              />
            </FormControl>

            <p className="mt-3 mb-0 text-start">{en.taluk}*</p>
            <FormControl fullWidth>
              <TextField
                variant="outlined"
                value={allValues.permanentData.taluk}
                disabled
              />
            </FormControl>
          </Col>

          <Col xs={12} md={4} className="final-personal-col-1 px-3">
            <Required className="mb-0" title={en.streetRoadName} />
            <FormControl fullWidth>
              <TextField
                variant="outlined"
                value={allValues.permanentData.streetRoad}
                disabled
              />
            </FormControl>

            <p className="mt-3 mb-0 text-start">{en.landmark}</p>
            <FormControl fullWidth>
              <TextField
                variant="outlined"
                value={allValues.permanentData.landmark}
                disabled
              />
            </FormControl>

            <Row>
              <Col xs={6} className="final-personal-col-1 ">
                <p className="mt-3 mb-0 text-start">{en.state}*</p>
                <FormControl fullWidth>
                  <TextField
                    variant="outlined"
                    value={allValues.permanentData.state}
                    disabled
                  />
                </FormControl>
              </Col>
              <Col xs={6} className="final-personal-col-1 ">
                <p className="mt-3 mb-0 text-start">{en.pin_code}*</p>
                <FormControl fullWidth>
                  <TextField
                    variant="outlined"
                    value={allValues.permanentData.pincode}
                    disabled
                  />
                </FormControl>
              </Col>
            </Row>
          </Col>

          <Col xs={12} md={4} className="final-personal-col-1 px-3">
            <p className="mb-0 text-start">{en.cityName}*</p>
            <FormControl fullWidth>
              <TextField
                variant="outlined"
                value={allValues.permanentData.areaVillage}
                disabled
              />
            </FormControl>

            <p className="mt-3 mb-0 text-start">{en.villageName}*</p>
            <FormControl fullWidth>
              <TextField
                variant="outlined"
                value={allValues.permanentData.areaVillage}
                disabled
              />
            </FormControl>
          </Col>
        </Row>

        <Row className="mt-5 mb-0 final all-details-subtitle-row">
          <Col xs={12} md={12} className="profile-title">
            <img alt="..." src={family} />
            <h1>{en.familyDetails}</h1>
            {!allValues.finalSubmitted ? (
              <p onClick={() => setRenderComponent(2)}>
                {en.edityourdetails}
                <img src={edit} />
              </p>
            ) : (
              <p
                style={{
                  backgroundColor: '#F3F6F8',
                  boxShadow: 'none',
                  color: 'black',
                }}
              >
                Submitted{' '}
                <CheckCircle
                  className={classes.backdropCheck}
                  style={{ height: 'auto', width: '20px' }}
                />
              </p>
            )}
          </Col>
        </Row>
        <Row className="form-row-final mt-4">
          <Col xs={12} className="profile-title">
            <h2>{en.rationCardDetails}</h2>
          </Col>

          <Col xs={6} md={4} className="final-personal-col-1 px-3">
            <p className="mb-3 text-start">{en.rationCardNumber}</p>
            <FormControl fullWidth>
              <TextField
                value={
                  fetchedData?.ration_card_details?.[0]
                    ?.catalog_value_ration_card_type_id
                }
                disabled
              />
            </FormControl>
          </Col>
          <Col xs={6} md={4} className="final-personal-col-1 px-3">
            <p className="mb-3 text-start">{en.rationCardType}</p>
            <FormControl fullWidth>
              <TextField
                // value={
                //   users?.getUserRegistrationDetails.ration_card_details[0]
                //     .ration_card_type
                // }
                // value={
                //     users?.getUserRegistrationDetails.family_details.rationCardTypes[
                //         users?.family_details.rationCardTypes.map(function(e) {
                //             return e.value_id;
                //         }).indexOf(users?.family_details.rationCardType)
                //     ].value
                // }
                value={rationCardTypeData ? rationCardTypeData?.[0]?.value : ''}
                disabled
              />
            </FormControl>
          </Col>
          <Col xs={4} className="final-personal-col-1 px-3">
            <p className="mb-0 text-start">{en.rationCardDocument}</p>

            {rationCardDocs?.map((details, i) => (
              <div className="browsebutton2-div final" key={i}>
                <FormControl>
                  <TextField
                    variant="outlined"
                    value={details?.file_name}
                    style={{ width: '-webkit-fill-available' }}
                    disabled
                  />
                </FormControl>
                <label
                  className="browse-button2"
                  onClick={(e) => handleClick(e, 'ration', details)}
                >
                  {en.view} <Visibility />
                </label>
              </div>
            ))}

            <Popover
              id={idration}
              open={openration}
              anchorEl={anchorElration}
              onClose={(e) => handleClose(e, 'ration')}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <img
                src={rationPicture}
                alt="ration"
                style={{ width: '600px', height: '300px' }}
              />
              {/* <a href="#">
                <img
                  alt="..."
                  className="avatar border-gray"
                  // id={item.id}
                  src={`
                                              data:image/jpeg;base64,${selected_document_type}`}
                  onClick={() => {
                    var win = window.open();
                    win.document.write(
                      '<iframe src="' +
                        `
                                                  data:image/jpeg;base64,${selected_document_type}` +
                        '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" style="-webkit-transform:scale(0.5);-moz-transform-scale(0.5);" allowfullscreen></iframe>',
                    );
                  }}
                />
              </a> */}
            </Popover>
          </Col>

          <Col xs={12} className="profile-title mmb-0">
            <h2>{en.familyMemberDetails}</h2>
          </Col>

          {fetchedData?.family_details?.map((id, i) => {
            return (
              <>
                <Row className={'mt-0 familymember-card final row' + i} key={i}>
                  <Col xs={12} md={6}>
                    <Row>
                      <Col xs={4} className="member-p">
                        <p className="text-start">{en.relation}* :</p>
                      </Col>
                      <Col xs={8}>
                        <FormControl fullWidth>
                          <TextField
                            value={
                              fetchedData?.family_details?.[i]
                                ?.parent_child_relation
                            }
                            disabled
                          />
                        </FormControl>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12} md={6}>
                    <Row>
                      <Col xs={4} className="member-p">
                        <p className="text-start">{en.firstName}* :</p>
                      </Col>
                      <Col xs={8}>
                        <FormControl fullWidth>
                          <TextField
                            value={fetchedData?.family_details?.[i]?.first_name}
                            disabled
                          />
                        </FormControl>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12} md={6}>
                    <Row>
                      <Col xs={4} className="member-p">
                        <p className="text-start">{en.middleName} : </p>
                      </Col>
                      <Col xs={8}>
                        <FormControl fullWidth>
                          <TextField
                            value={
                              fetchedData?.family_details?.[i]?.middle_name
                            }
                            disabled
                          />
                        </FormControl>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12} md={6}>
                    <Row>
                      <Col xs={4} className="member-p">
                        <p className="text-start">{en.lastName} :</p>
                      </Col>
                      <Col xs={8}>
                        <FormControl fullWidth>
                          <TextField
                            value={fetchedData?.family_details?.[i]?.last_name}
                            disabled
                          />
                        </FormControl>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12} md={6}>
                    <Row>
                      <Col xs={4} className="member-p">
                        <p className="text-start"> {en.aadhar}* :</p>
                      </Col>
                      <Col xs={8}>
                        <div className="aadhar-div">
                          <img alt="..." src={aadhar} />
                          <FormControl fullWidth>
                            <TextField
                              className="aadhardiv1"
                              // value={users?.getUserRegistrationDetails.family_details[i].aadhar_no}
                              //   value={users?.getUserRegistrationDetails.family_details[
                              //     i
                              //   ].aadhar_no.replace(/\d(?=\d{4})/g, 'X')}
                              value={
                                fetchedData?.family_details?.[i]?.aadhar_no
                              }
                              inputProps={{ minLength: 0, maxLength: 4 }}
                              disabled
                            />
                          </FormControl>

                          {/* {
                                                              users?.family_details.membersList[i]["aadharcheck" + i] ? */}
                          {/* (<img alt="..." src={checkgreen} />) */}
                          {/* : */}
                          {/* ( */}
                          {/* <img alt="..." src={checkgrey} /> */}
                          {/* ) */}
                          {/* } */}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12} md={6}>
                    <Row>
                      <Col xs={4} className="member-p">
                        <p className="text-start">{en.dOB}* :</p>
                      </Col>
                      <Col xs={8}>
                        <FormControl fullWidth>
                          <TextField
                            disabled
                            value={dayjs(
                              fetchedData?.family_details?.[i]?.date_of_birth,
                            ).format('MM-DD-YYYY')}
                          />
                        </FormControl>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12} md={6}>
                    <Row>
                      <Col xs={4} className="member-p">
                        <p className="text-start">{en.profession}* :</p>
                      </Col>
                      <Col xs={8}>
                        <FormControl fullWidth>
                          <FormControl fullWidth>
                            <TextField
                              value={
                                fetchedData?.family_details?.[i]?.proffession
                              }
                              disabled
                            />
                          </FormControl>
                        </FormControl>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12} md={6}>
                    <Row>
                      <Col xs={4} className="member-p">
                        <p className="text-start">{en.education}* :</p>
                      </Col>
                      <Col xs={8}>
                        <FormControl fullWidth>
                          <FormControl fullWidth>
                            <TextField
                              value={
                                fetchedData?.family_details?.[i]?.education
                              }
                              disabled
                            />
                          </FormControl>
                        </FormControl>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={10} className="member-p text-start mt-2">
                    <FormControlLabel
                      control={
                        <>
                          <Checkbox
                            checked={
                              fetchedData?.family_details?.[i]?.is_nominee
                            }
                            disabled
                          />
                        </>
                      }
                      label={en.nominee}
                    />
                  </Col>
                  <Col xs={10} className="member-p">
                    <Row>
                      <Col xs={12} md={8} className="member-p mt-2">
                        <FormControl
                          className="interstateRadio"
                          variant="outlined"
                          fullWidth
                          component="fieldset"
                        >
                          <RadioGroup
                            row
                            value={
                              fetchedData?.family_details?.[i]
                                ?.is_regisrered_user
                            }
                            name={'alreadyRegistered' + i}
                            disabled
                          >
                            <p className="pad-new mt-2 mb-2">
                              {en.alreadyRegisteredinKBOCWWB}*
                            </p>

                            <FormControlLabel
                              disabled
                              className="col-2"
                              value={1}
                              control={<Radio />}
                              label={en.yes}
                            />
                            <FormControlLabel
                              disabled
                              className="col-2"
                              value={0}
                              control={<Radio />}
                              label={en.no}
                            />
                          </RadioGroup>
                        </FormControl>
                      </Col>
                      {/* <Col xs={6} md={4} className="member-p mt-2">
                        {users?.getUserRegistrationDetails.family_details[i]
                          .is_regisrered_user === 1 ? (
                          <div className="regnum">
                            <p className="mt-2 mb-2">
                              KBOCWWB Registration Number
                            </p>
                            <FormControl>
                              <TextField
                                variant="outlined"
                                disabled
                                value={
                                  users?.getUserRegistrationDetails
                                    .family_details[i].registration_code
                                }
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="start">
                                      {users?.family_details.pancheck ? (
                                        <img alt="..." src={checkgreen} />
                                      ) : (
                                        <img alt="..." src={checkgrey} />
                                      )}
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </FormControl>
                          </div>
                        ) : null}
                      </Col> */}
                    </Row>
                  </Col>
                </Row>
              </>
            );
          })}
        </Row>

        <Row className="mt-5 mb-0 final all-details-subtitle-row">
          <Col xs={12} md={12} className="profile-title">
            <img alt="..." src={bank} />
            <h1>{en.bankDetails}</h1>
            {!allValues.finalSubmitted ? (
              <p onClick={() => setRenderComponent(3)}>
                {en.edityourdetails}
                <img src={edit} />
              </p>
            ) : (
              <p
                style={{
                  backgroundColor: '#F3F6F8',
                  boxShadow: 'none',
                  color: 'black',
                }}
              >
                Submitted{' '}
                <CheckCircle
                  className={classes.backdropCheck}
                  style={{ height: 'auto', width: '20px' }}
                />
              </p>
            )}
          </Col>
        </Row>
        <Row className="form-row-final mt-4">
          <Col xs={12} md={3} className="final-personal-col-1 px-3">
            <Required className="mb-0" title={en.iFSCCode} />
            <FormControl fullWidth>
              <TextField
                value={
                  fetchedData ? fetchedData?.bank_details?.[0]?.ifsc_code : ''
                }
                disabled
              />
            </FormControl>
          </Col>
          <Col xs={12} md={3} className="final-personal-col-1 px-3">
            <Required className="mb-0" title={en.accountNumber} />
            <FormControl fullWidth>
              <TextField
                value={
                  fetchedData ? fetchedData?.bank_details?.[0]?.account_no : ''
                }
                disabled
              />
            </FormControl>
          </Col>
          <Col xs={12} md={3} className="final-personal-col-1 px-3">
            <Required className="mb-0" title={en.bankName} />
            <FormControl fullWidth>
              <TextField
                value={
                  fetchedData ? fetchedData?.bank_details?.[0]?.bank_name : ''
                }
                disabled
              />
            </FormControl>
          </Col>
          <Col xs={12} md={3} className="final-personal-col-1 px-3">
            <Required className="mb-0" title={en.bankBranch} />
            <FormControl fullWidth>
              <TextField
                value={
                  fetchedData ? fetchedData?.bank_details?.[0]?.bank_branch : ''
                }
                disabled
              />
            </FormControl>
          </Col>
          <Col xs={12} md={6} className="final-personal-col-1 px-3 mt-3">
            <Required className="mb-0" title={en.bankAddress} />

            <FormControl fullWidth>
              <TextareaAutosize
                variant="outlined"
                multiline="true"
                minRows={4}
                value={
                  fetchedData
                    ? fetchedData?.bank_details?.[0]?.bank_address
                    : ''
                }
                disabled
              />
            </FormControl>
          </Col>
          <Col xs={12} md={6} className="final-personal-col-1 px-3 mt-3">
            <Required className="mb-0" title={en.passbookDocument} />

            {passbookDoc?.map((details, i) => (
              <>
                <div className="browsebutton2-div final" key={i}>
                  <FormControl>
                    <TextField
                      variant="outlined"
                      name="passbook"
                      value={details?.file_name}
                      style={{ width: '-webkit-fill-available' }}
                      disabled
                    />
                  </FormControl>
                  <label
                    className="browse-button2"
                    onClick={(e) => handleClick(e, 'passbook', details)}
                  >
                    {en.view} <Visibility />
                  </label>
                </div>
              </>
            ))}

            <Popover
              id={id}
              open={openPassbook}
              anchorEl={anchorEl}
              onClose={(e) => handleClose(e, 'passbook')}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <img
                src={passbookPicture}
                alt="passbook"
                style={{ width: '600px', height: '300px' }}
              />
              {/* <a href="#">
                <img
                  alt="..."
                  className="avatar border-gray"
                  // id={item.id}
                  src={`
                                  data:image/jpeg;base64,${showPassbookDoc}`}
                  onClick={() => {
                    var win = window.open();
                    win.document.write(
                      '<iframe src="' +
                        `
                                      data:image/jpeg;base64,${showPassbookDoc}` +
                        '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" style="-webkit-transform:scale(0.5);-moz-transform-scale(0.5);" allowfullscreen></iframe>',
                    );
                  }}
                />
              </a> */}
            </Popover>
          </Col>

          {fetchedData?.bank_details?.length > 1 ? (
            <>
              <Col xs={10} className="profile-title">
                <h2>{en.nomineeBankDetails}</h2>
              </Col>
              <Col xs={3} className="final-personal-col-1 px-3">
                <Required className="mb-0" title={en.iFSCCode} />
                <FormControl fullWidth>
                  <TextField
                    value={
                      fetchedData
                        ? fetchedData?.bank_details?.[1]?.ifsc_code
                        : ''
                    }
                    disabled
                  />
                </FormControl>
              </Col>
              <Col xs={3} className="final-personal-col-1 px-3">
                <Required className="mb-0" title={en.accountNumber} />
                <FormControl fullWidth>
                  <TextField
                    value={
                      fetchedData
                        ? fetchedData?.bank_details?.[1]?.account_no
                        : ''
                    }
                    disabled
                  />
                </FormControl>
              </Col>
              <Col xs={3} className="final-personal-col-1 px-3">
                <Required className="mb-0" title={en.bankName} />
                <FormControl fullWidth>
                  <TextField
                    value={
                      fetchedData
                        ? fetchedData?.bank_details?.[1]?.bank_name
                        : ''
                    }
                    disabled
                  />
                </FormControl>
              </Col>
              <Col xs={3} className="final-personal-col-1 px-3">
                <Required className="mb-0" title={en.bankBranch} />
                <FormControl fullWidth>
                  <TextField
                    value={
                      fetchedData
                        ? fetchedData?.bank_details?.[1]?.bank_branch
                        : ''
                    }
                    disabled
                  />
                </FormControl>
              </Col>
              <Col xs={6} className="final-personal-col-1 px-3 mt-3">
                <Required className="mb-0" title={en.bankAddress} />
                <FormControl fullWidth>
                  <TextareaAutosize
                    variant="outlined"
                    multiline="true"
                    minRows={4}
                    value={
                      fetchedData
                        ? fetchedData?.bank_details?.[1]?.bank_address
                        : ''
                    }
                    disabled
                  />
                </FormControl>
              </Col>
              <Col xs={6} className="final-personal-col-1 px-3 mt-3">
                <Required className="mb-0" title={en.passbookDocument} />

                {passbookDocNominee?.map((details, i) => (
                  <>
                    <div className="browsebutton2-div final" key={i}>
                      <FormControl>
                        <TextField
                          variant="outlined"
                          value={details?.file_name}
                          style={{ width: '-webkit-fill-available' }}
                          disabled
                        />
                      </FormControl>
                      <label
                        className="browse-button2"
                        onClick={(e) =>
                          handleClick(e, 'passbook_nominee', details)
                        }
                      >
                        {en.view} <Visibility />
                      </label>
                    </div>
                  </>
                ))}

                <Popover
                  id={idpassbook_nominee}
                  open={openPassbookNominee}
                  anchorEl={anchorElpassbook_nominee}
                  onClose={(e) => handleClose(e, 'passbook_nominee')}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  <img
                    src={passbookNomineePicture}
                    alt="nomineePassbook"
                    style={{ width: '600px', height: '300px' }}
                  />
                  {/* <a href="#">
                    <img
                      alt="..."
                      className="avatar border-gray"
                      // id={item.id}
                      src={`
                                              data:image/jpeg;base64,${selected_document_type}`}
                      onClick={() => {
                        var win = window.open();
                        win.document.write(
                          '<iframe src="' +
                            `
                                                  data:image/jpeg;base64,${selected_document_type}` +
                            '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" style="-webkit-transform:scale(0.5);-moz-transform-scale(0.5);" allowfullscreen></iframe>',
                        );
                      }}
                    />
                  </a> */}
                </Popover>
              </Col>
            </>
          ) : null}
        </Row>

        <Row className="mt-5 mb-0 final all-details-subtitle-row">
          <Col xs={12} md={12} className="profile-title">
            <img alt="..." src={nintydays} />
            {/* <h1>Details of 90 Days Working Certificate & Employer Details</h1> */}
            <h1 className="text-val">
              {en.detailsof90DaysWorkingCertificateEmployerDetails}
            </h1>

            {/* <p onClick={() => props.editButtonPressed(5)}>Edit your details<img src={edit}/></p> */}
            {!allValues.finalSubmitted ? (
              <p onClick={() => setRenderComponent(4)}>
                {en.edityourdetails}
                <img src={edit} />
              </p>
            ) : (
              <p
                style={{
                  backgroundColor: '#F3F6F8',
                  boxShadow: 'none',
                  color: 'black',
                }}
              >
                Submitted{' '}
                <CheckCircle
                  className={classes.backdropCheck}
                  style={{
                    height: 'auto',
                    width: '20px',
                    alignSelf: 'center',
                  }}
                />
              </p>
            )}
          </Col>
        </Row>

        {fetchedData?.employer_details?.map((i, index) => {
          return (
            <>
              <Row className="form-row-final mt-3" key={index}>
                <Row className={'mt-0 pt-4 familymember-card final row' + i}>
                  <Col xs={12} md={3} className="final-personal-col-1 px-3">
                    {/* <Required className="mb-0" title="Employer Details" /> */}
                    <Required className="mb-0" title={en.employerDetails} />
                    <FormControl fullWidth>
                      <TextField
                        value={
                          fetchedData?.employer_details?.[index]
                            ?.employement_status
                        }
                        disabled
                      />
                    </FormControl>
                  </Col>
                  <Col xs={12} md={3} className="final-personal-col-1 px-3">
                    {/* <Required className="mb-0" title="Constractor Name" /> */}
                    <Required className="mb-0" title={en.constractorName} />
                    <FormControl fullWidth>
                      <TextField
                        value={
                          fetchedData?.employer_details?.[index]
                            ?.contractor_name
                        }
                        disabled
                      />
                    </FormControl>
                  </Col>
                  <Col xs={12} md={3} className="final-personal-col-1 px-3">
                    {/* <Required className="mb-0" title="Constractor Company Name" /> */}
                    <Required
                      className="mb-0"
                      title={en.constractorCompanyName}
                    />
                    <FormControl fullWidth>
                      <TextField
                        value={
                          fetchedData?.employer_details?.[index]
                            ?.contractor_company_name
                        }
                        disabled
                      />
                    </FormControl>
                  </Col>
                  <Col
                    xs={12}
                    md={3}
                    className="final-personal-col-1 px-3 mt-3"
                  >
                    {/* <Required className="mb-0" title="Mobile Number (Incharge Person)" /> */}
                    <Required
                      className="mb-0"
                      style="margin-top:10px;"
                      title={en.mobileNumberInchargePerson}
                    />
                    <FormControl fullWidth>
                      <TextField
                        value={
                          '+91 ' +
                          fetchedData?.employer_details?.[index]?.mobile_no
                        }
                        disabled
                      />
                    </FormControl>
                  </Col>
                  <Col
                    xs={12}
                    md={6}
                    className="final-personal-col-1 px-3 mt-3"
                  >
                    {/* <Required className="mb-0" title="Workplace/Site Address" /> */}
                    <Required
                      className="mb-0"
                      title={en.workplaceSiteAddress}
                    />
                    <FormControl fullWidth>
                      <TextareaAutosize
                        variant="outlined"
                        multiline="true"
                        minRows={2}
                        value={
                          fetchedData?.employer_details?.[index]?.site_address
                        }
                        disabled
                      />
                    </FormControl>
                  </Col>
                  <Col
                    xs={12}
                    md={3}
                    className="final-personal-col-1 px-3 mt-3"
                  >
                    {/* <Required className="mb-0" title="State" /> */}
                    <Required className="mb-0" title={en.state} />
                    <FormControl fullWidth>
                      <TextField
                        value={fetchedData?.employer_details?.[index]?.state}
                        disabled
                      />
                    </FormControl>
                  </Col>
                  <Col
                    xs={12}
                    md={3}
                    className="final-personal-col-1 px-3 mt-3"
                  >
                    <Required className="mb-0" title={en.workplaceDistrict} />
                    <FormControl fullWidth>
                      <TextField
                        value={fetchedData?.employer_details?.[index]?.district}
                        disabled
                      />
                    </FormControl>
                  </Col>
                  <Col
                    xs={12}
                    md={3}
                    className="final-personal-col-1 px-3 mt-3"
                  >
                    <Required className="mb-0" title={en.taluk} />
                    <FormControl fullWidth>
                      <TextField
                        value={fetchedData?.employer_details?.[index]?.taluk}
                        disabled
                      />
                    </FormControl>
                  </Col>
                  <Col
                    xs={12}
                    md={3}
                    className="final-personal-col-1 px-3 mt-3"
                  >
                    <Required
                      className="mb-0"
                      title={en.townCityGramPanchayat}
                    />
                    <FormControl fullWidth>
                      <TextField
                        value={
                          fetchedData?.employer_details?.[index]
                            ?.panhayat_city_town
                        }
                        disabled
                      />
                    </FormControl>
                  </Col>
                  <Col
                    xs={12}
                    md={3}
                    className="final-personal-col-1 px-3 mt-3"
                  >
                    {/* <Required className="mb-0" title="Village/Ward Circle" /> */}
                    <Required className="mb-0" title={en.villageWardCircle} />
                    <FormControl fullWidth>
                      <TextField
                        value={
                          fetchedData?.employer_details?.[index]
                            ?.ward_area_village
                        }
                        disabled
                      />
                    </FormControl>
                  </Col>
                  <Col
                    xs={12}
                    md={3}
                    className="final-personal-col-1 px-3 mt-3"
                  >
                    {/* <Required className="mb-0" title="pin_code" /> */}
                    <Required className="mb-0" title={en.pin_code} />
                    <FormControl fullWidth>
                      <TextField
                        value={fetchedData?.employer_details?.[index]?.pin_code}
                        disabled
                      />
                    </FormControl>
                  </Col>
                  <Col
                    xs={12}
                    md={3}
                    className="final-personal-col-1 px-3 mt-3"
                  >
                    {/* <Required className="mb-0" title="Nature of Work" /> */}
                    <Required className="mb-0" title={en.natureofWork} />
                    <FormControl fullWidth>
                      <TextField
                        value={
                          fetchedData?.employer_details?.[index]?.nature_of_work
                        }
                        disabled
                      />
                    </FormControl>
                  </Col>
                </Row>
              </Row>
            </>
          );
        })}

        <Row className="form-row-final mt-4">
          <Col xs={12} md={12} className="profile-title">
            <h2>{en.daysWorkCertificateDetails}</h2>
            {/* <h2><Translate value="DaysWorkCertificateDetails"/></h2> */}
          </Col>
          <Col xs={12} md={6} className="final-personal-col-1">
            {/* <Required className="mb-0" title="Type of Issuer" /> */}
            <Required className="mb-0" title={en.typeofIssuer} />
            <FormControl fullWidth>
              <TextField
                value={fetchedData?.certificate_details?.[0]?.issuer_type}
                disabled
              />
            </FormControl>
          </Col>
          <Col xs={12} md={6} className="final-personal-col-1 px-3">
            {/* <Required className="mb-0" title="Issued Date" /> */}
            <Required className="mb-0 new-pad" title={en.issuedDate} />
            <FormControl fullWidth>
              <TextField
                value={
                  fetchedData
                    ? dayjs(
                        fetchedData.certificate_details?.[0]?.issue_date,
                      ).format('MM-DD-YYYY')
                    : ''
                }
                disabled
              />
            </FormControl>
          </Col>

          <Col xs={11} md={12} className="profile-title">
            <Row>
              {
                {
                  55: (
                    <>
                      <Col xs={12} md={4} className="issuerTypeForm">
                        {/* <p className="mt-0 mb-2">Labour Inspector Name</p> */}
                        <p className="mt-0 mb-2 new-pad">
                          {en.labourInspectorName}
                        </p>
                        <FormControl fullWidth>
                          <TextField
                            value={
                              fetchedData?.certificate_details?.length > 0 &&
                              fetchedData?.certificate_details[0].issuer_name
                            }
                            disabled
                          />
                        </FormControl>
                      </Col>
                      <Col xs={12} md={4} className="issuerTypeForm">
                        {/* <p className="mt-0 mb-2">Circle of the Labour Inspector </p> */}
                        <p className="mt-0 mb-2 new-pad">
                          {en.circleoftheLabourInspector}{' '}
                        </p>

                        <FormControl fullWidth>
                          <TextField
                            value={
                              fetchedData?.certificate_details?.length > 0 &&
                              fetchedData?.certificate_details[0]
                                .inspector_circle
                            }
                            disabled
                          />
                        </FormControl>
                      </Col>
                      <Col xs={12} md={4} className="issuerTypeForm">
                        {/* <p className="mt-0 mb-2 ">Mobile Number of the Labour Inspector </p> */}
                        <p className="mt-0 mb-2 new-space">
                          {en.mobileNumberoftheLabourInspector}{' '}
                        </p>
                        <FormControl fullWidth>
                          <TextField
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <img
                                    src={mobilepic}
                                    alt="..."
                                    className="phone-icon"
                                  />
                                </InputAdornment>
                              ),
                            }}
                            value={
                              fetchedData?.certificate_details?.length > 0 &&
                              '+91 ' +
                                fetchedData?.certificate_details[0]
                                  .inspector_mobile_no
                            }
                            disabled
                          />
                        </FormControl>
                      </Col>
                    </>
                  ),
                  56: (
                    <>
                      <Col xs={10} md={3} className="issuerTypeForm">
                        {/* <p className="mt-0 mb-2">Union Name</p> */}
                        <p className="mt-0 mb-2">{en.unionName}</p>
                        <FormControl fullWidth>
                          <TextField
                            value={
                              fetchedData?.certificate_details?.length > 0 &&
                              fetchedData?.certificate_details[0]
                                .labour_union_name
                            }
                            disabled
                          />
                        </FormControl>
                      </Col>
                      <Col xs={10} md={3} className="issuerTypeForm">
                        {/* <p className="mt-0 mb-2">Union Registration Number</p> */}
                        <p className="mt-0 mb-2">
                          {en.unionRegistrationNumber}
                        </p>
                        <FormControl fullWidth>
                          <TextField
                            value={
                              fetchedData?.certificate_details?.length > 0 &&
                              fetchedData?.certificate_details[0]
                                .labour_union_registration_no
                            }
                            disabled
                          />
                        </FormControl>
                      </Col>
                      <Col xs={10} md={3} className="issuerTypeForm">
                        {/* <p className="mt-0 mb-2">Name of Issuer</p> */}
                        <p className="mt-0 mb-2">{en.nameofIssuer}</p>
                        <FormControl fullWidth>
                          <TextField
                            value={
                              fetchedData?.certificate_details?.length > 0 &&
                              fetchedData?.certificate_details[0].issuer_name
                            }
                            disabled
                          />
                        </FormControl>
                      </Col>
                      <Col xs={10} md={3} className="issuerTypeForm">
                        {/* <p className="mt-0 mb-2">Mobile Number (If Available)</p> */}
                        <p className="mt-0 mb-2">
                          {en.mobileNumberIfAvailable}
                        </p>
                        <FormControl fullWidth>
                          <TextField
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <img
                                    src={mobilepic}
                                    alt="..."
                                    className="phone-icon"
                                  />
                                </InputAdornment>
                              ),
                            }}
                            value={
                              fetchedData?.certificate_details?.length > 0 &&
                              '+91 ' +
                                fetchedData?.certificate_details[0]
                                  .aslabour_union_phone_no
                            }
                            disabled
                          />
                        </FormControl>
                      </Col>
                    </>
                  ),
                  57: (
                    <>
                      <Col xs={4} className="issuerTypeForm">
                        <p className="mt-0 mb-2">Name of Issuer</p>
                        <FormControl fullWidth>
                          <TextField
                            value={
                              fetchedData?.certificate_details?.length > 0 &&
                              fetchedData?.certificate_details[0].issuer_name
                            }
                            disabled
                          />
                        </FormControl>
                      </Col>
                      <Col xs={4} className="issuerTypeForm">
                        <p className="mt-0 mb-2">Place of Issuer</p>
                        <FormControl fullWidth>
                          <TextField
                            value={
                              fetchedData?.certificate_details?.length > 0 &&
                              fetchedData?.certificate_details[0].issuer_place
                            }
                            disabled
                          />
                        </FormControl>
                      </Col>
                      <Col xs={4} className="issuerTypeForm">
                        <p className="mt-0 mb-2">
                          Mobile Number (If Available)
                        </p>
                        <FormControl fullWidth>
                          <TextField
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <img
                                    src={mobilepic}
                                    alt="..."
                                    className="phone-icon"
                                  />
                                </InputAdornment>
                              ),
                            }}
                            value={
                              fetchedData?.certificate_details?.length > 0 &&
                              '+91 ' +
                                fetchedData?.certificate_details[0].mobile_no
                            }
                            disabled
                          />
                        </FormControl>
                      </Col>
                    </>
                  ),
                  58: (
                    <>
                      <Col xs={4} className="issuerTypeForm">
                        <p className="mt-0 mb-2">Name of Issuer</p>
                        <FormControl fullWidth>
                          <TextField
                            value={
                              fetchedData?.certificate_details?.length > 0 &&
                              fetchedData?.certificate_details[0].issuer_name
                            }
                            disabled
                          />
                        </FormControl>
                      </Col>
                      <Col xs={4} className="issuerTypeForm">
                        <p className="mt-0 mb-2">Designation of Issuer</p>
                        <FormControl fullWidth>
                          <TextField
                            value={
                              fetchedData?.certificate_details?.length > 0 &&
                              fetchedData?.certificate_details[0]
                                .issuer_designation
                            }
                            disabled
                          />
                        </FormControl>
                      </Col>
                      <Col xs={4} className="issuerTypeForm">
                        <p className="mt-0 mb-2">
                          Mobile Number (If Available)
                        </p>
                        <FormControl fullWidth>
                          <TextField
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <img
                                    src={mobilepic}
                                    alt="..."
                                    className="phone-icon"
                                  />
                                </InputAdornment>
                              ),
                            }}
                            value={
                              fetchedData?.certificate_details?.length > 0 &&
                              '+91 ' +
                                fetchedData?.certificate_details[0].mobile_no
                            }
                            disabled
                          />
                        </FormControl>
                      </Col>
                    </>
                  ),
                }[
                  fetchedData?.certificate_details?.length > 0 &&
                    fetchedData?.certificate_details[0]
                      .catalog_value_type_of_issuer_id
                ]
              }

              {console.log(
                'certificateDocs: ' +
                  JSON.stringify(certificateDocs, undefined, 2),
              )}
              {console.log(
                'certificateDocs.length: ' +
                  Object.keys(certificateDocs, undefined, 2).length,
              )}

              <Col xs={12} md={6} className="final-personal-col-1 px-3 mt-3">
                <Required className="mb-0" title={en.DaysWorkingCertificate} />
                {nintyDaysDocs?.map((details, i) => (
                  <>
                    <div className="browsebutton2-div final" key={i}>
                      <FormControl>
                        <TextField
                          variant="outlined"
                          value={
                            nintyDaysDocs !== undefined &&
                            nintyDaysDocs?.length > 0 &&
                            details?.file_name
                          }
                          style={{ width: '-webkit-fill-available' }}
                          disabled
                        />
                      </FormControl>
                      <label
                        className="browse-button2"
                        onClick={(e) => handleClick(e, 'ninty', details)}
                      >
                        {en.view} <Visibility />
                      </label>
                    </div>
                  </>
                ))}

                <Popover
                  id={idninty}
                  open={openninty}
                  anchorEl={anchorElninty}
                  onClose={(e) => handleClose(e, 'ninty')}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  <img
                    src={nintyDaysPicture}
                    alt="nintyDaysDoc"
                    style={{ width: '600px', height: '300px' }}
                  />
                  {/* <a href="#">
                    <img
                      alt="..."
                      className="avatar border-gray"
                      // id={item.id}
                      src={`
                                  data:image/jpeg;base64,${selected_document_type}`}
                      onClick={() => {
                        var win = window.open();
                        win.document.write(
                          '<iframe src="' +
                            `
                                      data:image/jpeg;base64,${selected_document_type}` +
                            '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" style="-webkit-transform:scale(0.5);-moz-transform-scale(0.5);" allowfullscreen></iframe>',
                        );
                      }}
                    />
                  </a> */}
                </Popover>
              </Col>
            </Row>
          </Col>
        </Row>

        {!allValues.finalSubmitted ? (
          <>
            <Row className="scheme-subtitle-row mt-4">
              <Col xs={12} className="searchform-subtitle">
                <p>
                  <p>{en.declaration}</p>
                </p>
              </Col>
            </Row>

            <Row className="form-row mt-4 config-form searchform">
              <Col xs={12} className="note2 schemes mt-4 bank-col-5">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={allValues.declaration}
                      onChange={handleChangeCheckbox}
                      name="declaration"
                      // color="primary"
                    />
                  }
                  label={en.declarationmessage}
                />
              </Col>

              <Col xs={12} className="note2 schemes mt-4 bank-col-5">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={allValues.declaration2}
                      onChange={handleChangeCheckbox}
                      name="declaration2"
                      // color="primary"
                    />
                  }
                  label={en.declarationmessage2}
                />
              </Col>
              <Col xs={12} className="nintydays-col-6">
                <p className="mt-5 mb-2">{en.selfdeclaration}</p>
                <div className="browsebutton-outerdiv">
                  <div className="browsebutton2-div filesNames">
                    <FormControl style={{ padding: '5px' }}>
                      <TextField
                        variant="outlined"
                        name="passbookDocumentName"
                        //onChange={handleChange}
                        value={
                          selfDeclarationDoc?.[0]
                            ? selfDeclarationDoc?.[0]?.file_name
                            : ''
                        }
                        disabled
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              {selfDeclarationDoc?.[0] && (
                                <img
                                  alt="..."
                                  src={closeicon}
                                  className="removefilebtn"
                                  onClick={removefile}
                                />
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  </div>
                  <div className="browsebutton-div">
                    <label
                      htmlFor="upload-photo"
                      className="browse-button btn2"
                    >
                      <img alt="..." src={folder} /> {en.browse}
                    </label>
                    <input
                      type="file"
                      name="photo"
                      id="upload-photo"
                      key={
                        selfDeclarationDoc?.[0]?.file_name
                          ? selfDeclarationDoc?.[0]?.file_name
                          : selectedfiles?.[0]?.name
                      }
                      onChange={handleFileChange}
                      multiple
                    />
                  </div>
                </div>

                <p className="mt-4 instructions-ration">
                  <span>{en.instructions}* : </span>
                  <br />
                  {en.formatsupportingdocumentshouldbeinJPEGPNGorPDF}
                  <br />
                  {en.sizecontains500KBto2MB}
                </p>
              </Col>
            </Row>
          </>
        ) : null}

        <Row
          className="button-inside-form-row mt-5 mb-5"
          style={{
            borderTop: '2px solid #cccccc',
          }}
        >
          <Col xs={12} className="final-button-row mt-4 mb-5">
            {!allValues.finalSubmitted ? (
              <Link
                to="#"
                onClick={finalSubmitButtonPressed}
                style={{ flexGrow: '0.5' }}
              >
                <Button variant="outline-primary" className="final-button">
                  {en.finalSubmit}
                </Button>
              </Link>
            ) : (
              <Link to="#" onClick={printDocument} style={{ flexGrow: '0.5' }}>
                <Button variant="outline-primary" className="final-button">
                  {en.viewAcknowledgementLetter}
                </Button>
              </Link>
            )}
          </Col>
        </Row>
      </Row>

      {/* ********************   Acknowledgement Letter HTML ************************ */}
      <div>
        <div
          id="divToPrint"
          className="mt-4"
          style={{
            backgroundColor: '#fff',
            width: '210mm',
            minHeight: '297mm',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'center',
            // justifyContent: 'center',
            display: 'none',
            // border: '2px solid black',
          }}
        >
          <div className="logo-div-ack">
            <a href="/dashboard-user">
              <img id="logo" src={logo} alt="..." className="logo-img" />
            </a>
            <h1 className="logo-text">
              ಕರ್ನಾಟಕ ಕಟ್ಟಡ ಮತ್ತು ಇತರೆ ನಿರ್ಮಾಣ ಕಾರ್ಮಿಕರ ಕಲ್ಯಾಣ ಮಂಡಳಿ
              (ಕಕಇನಿಕಾಕಮಂ) <br />
              Karnataka Building & Other Construction Workers Welfare Board
              (KBOCWWB) <br />
            </h1>
          </div>

          <Row className="ack-subtitle-row">
            <Col xs={10} className="profile-title" style={{ display: 'block' }}>
              <h1 style={{ position: 'relative', left: '60px' }}>
                {en.acknowledgement}
              </h1>
            </Col>
          </Row>

          <p className="ack-success">
            <img
              src={checkGreen}
              style={{ height: 'auto', width: '28px', marginRight: '10px' }}
            />
            {/* <CheckCircle className={classes.backdropCheck} style={{height: "auto", width: "28px", marginRight: "10px"}}/> */}
            {en.applicationsubmitted}
          </p>

          <Row className="ack-table-row mt-5">
            <Col xs={2}></Col>
            <Col xs={3} className="ack-col">
              <p style={{ position: 'relative', right: '60px' }}>
                {en.applicationnumber}
              </p>
            </Col>

            <Col xs={1}>
              <p style={{ position: 'relative', right: '60px' }}>:</p>
            </Col>

            <Col xs={6} className="ack-col">
              <p style={{ position: 'relative', right: '60px' }}>
                {ackDetails?.application_no}
              </p>
            </Col>
          </Row>

          <Row className="ack-table-row">
            <Col xs={2}></Col>
            <Col xs={3} className="ack-col">
              <p
                className="w-75"
                style={{ position: 'relative', right: '60px' }}
              >
                {en.sakalaNumber}
              </p>
            </Col>

            <Col xs={1}>
              <p style={{ position: 'relative', right: '60px' }}>:</p>
            </Col>

            <Col xs={6} className="ack-col">
              <p style={{ position: 'relative', right: '60px' }}>{gscNo}</p>
            </Col>
          </Row>

          <Row className="ack-table-row">
            <Col xs={2}></Col>
            <Col xs={3} className="ack-col">
              <p style={{ position: 'relative', right: '60px' }}>
                {en.applicationdate}
              </p>
            </Col>

            <Col xs={1}>
              <p style={{ position: 'relative', right: '60px' }}>:</p>
            </Col>

            <Col xs={6} className="ack-col">
              <p style={{ position: 'relative', right: '60px' }}>
                {ackDetails
                  ? dayjs(ackDetails?.application_date).format('DD-MM-YYYY')
                  : ''}
              </p>
            </Col>
          </Row>

          <Row className="ack-table-row">
            <Col xs={2}></Col>
            <Col xs={3} className="ack-col">
              <p style={{ position: 'relative', right: '60px' }}>
                {en.requestedService}
              </p>
            </Col>

            <Col xs={1}>
              <p style={{ position: 'relative', right: '60px' }}>:</p>
            </Col>

            <Col xs={6} className="ack-col">
              <p style={{ position: 'relative', right: '60px' }}>
                {en.newregistration}
              </p>
            </Col>
          </Row>

          <Row className="ack-table-row">
            <Col xs={2}></Col>
            <Col xs={3} className="ack-col">
              <p style={{ position: 'relative', right: '60px' }}>
                {en.applicantName}
              </p>
            </Col>

            <Col xs={1}>
              <p style={{ position: 'relative', right: '60px' }}>:</p>
            </Col>

            <Col xs={6} className="ack-col">
              <p style={{ position: 'relative', right: '60px' }}>
                {fetchedData?.personal_details?.[0]?.first_name +
                  ' ' +
                  fetchedData?.personal_details?.[0]?.middle_name +
                  ' ' +
                  fetchedData?.personal_details?.[0]?.last_name}
              </p>
            </Col>
          </Row>

          <Row className="ack-table-row">
            <Col xs={2}></Col>
            <Col xs={3} className="ack-col">
              <p style={{ position: 'relative', right: '60px' }}>
                {en.residentialAddress2}
              </p>
            </Col>

            <Col xs={1}>
              <p style={{ position: 'relative', right: '60px' }}>:</p>
            </Col>

            <Col xs={6} className="ack-col">
              <p style={{ position: 'relative', right: '60px' }}>
                {fetchedData?.address_details?.[0]?.door_no +
                  ',' +
                  fetchedData?.address_details?.[0]?.street_name +
                  ',' +
                  fetchedData?.address_details?.[0]?.panhayat_city_town +
                  ',' +
                  fetchedData?.address_details?.[0]?.district +
                  ',' +
                  fetchedData?.address_details?.[0]?.ward_area_village +
                  ',' +
                  fetchedData?.address_details?.[0]?.taluk +
                  ',' +
                  fetchedData?.address_details?.[0]?.state +
                  '-' +
                  fetchedData?.address_details?.[0]?.pin_code}
              </p>
            </Col>
          </Row>

          <Row className="ack-table-row">
            <Col xs={2}></Col>
            <Col xs={3} className="ack-col">
              <p style={{ position: 'relative', right: '60px' }}>
                {en.villageWardCircle2}
              </p>
            </Col>

            <Col xs={1}>
              <p style={{ position: 'relative', right: '60px' }}>:</p>
            </Col>

            <Col xs={6} className="ack-col">
              <p style={{ position: 'relative', right: '60px' }}>
                {fetchedData?.address_details?.[0]?.ward_area_village}
              </p>
            </Col>
          </Row>

          <Row className="ack-table-row">
            <Col xs={2}></Col>
            <Col xs={3} className="ack-col">
              <p style={{ position: 'relative', right: '60px' }}>
                {en.mobileNumber2}
              </p>
            </Col>

            <Col xs={1}>
              <p style={{ position: 'relative', right: '60px' }}>:</p>
            </Col>

            <Col xs={6} className="ack-col">
              <p style={{ position: 'relative', right: '60px' }}>
                {fetchedData?.personal_details?.[0]?.mobile_no}
              </p>
            </Col>
          </Row>

          <Row className="ack-table-row">
            <Col xs={2}></Col>
            <Col xs={3} className="ack-col">
              <p style={{ position: 'relative', right: '60px' }}>
                {en.profession2}
              </p>
            </Col>

            <Col xs={1}>
              <p style={{ position: 'relative', right: '60px' }}>:</p>
            </Col>

            <Col xs={6} className="ack-col">
              <p style={{ position: 'relative', right: '60px' }}>
                {occupation}
              </p>
            </Col>
          </Row>

          <Row className="ack-table-row">
            <Col xs={2}></Col>
            <Col xs={3} className="ack-col">
              <p style={{ position: 'relative', right: '60px' }}>
                {en.circleName}
              </p>
            </Col>

            <Col xs={1}>
              <p style={{ position: 'relative', right: '60px' }}>:</p>
            </Col>

            <Col xs={6} className="ack-col">
              <p style={{ position: 'relative', right: '60px' }}>
                {circleName}
              </p>
            </Col>
          </Row>

          <Row className="ack-table-row">
            <Col xs={2}></Col>
            <Col xs={3} className="ack-col">
              <p style={{ position: 'relative', right: '60px' }}>
                {en.labourInspectorIncharge}
              </p>
            </Col>

            <Col xs={1}>
              <p style={{ position: 'relative', right: '60px' }}>:</p>
            </Col>

            <Col xs={6} className="ack-col">
              <p style={{ position: 'relative', right: '60px' }}>
                {fetchedData?.certificate_details?.[0]?.inspector_first_name +
                  ' ' +
                  fetchedData?.certificate_details?.[0]?.inspector_middle_name +
                  ' ' +
                  fetchedData?.certificate_details?.[0]?.inspector_last_name}
              </p>
            </Col>
          </Row>

          <Row className="ack-table-row-last mt-2">
            <Col xs={2}></Col>
            <Col xs={10} className="ack-col-note">
              <p>{en.note2}</p>
            </Col>
          </Row>
          <Row className="ack-table-row-last">
            <Col xs={2}></Col>
            <Col xs={10} className="ack-col">
              <p style={{ position: 'relative', bottom: '20px' }}>
                {en.acksubmit1}
              </p>
            </Col>
          </Row>
          <Row className="ack-table-row-last">
            <Col xs={2}></Col>
            <Col xs={10} className="ack-col">
              <p style={{ position: 'relative', bottom: '30px' }}>
                {en.acksubmit2}
              </p>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default Review;
