import React, { useRef } from 'react';
import * as Yup from 'yup';
import Cookies from 'js-cookie';
import Webcam from 'react-webcam';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
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
  CircularProgress,
  Tooltip,
  ListItemIcon,
  InputLabel,
  Backdrop,
  makeStyles,
} from '@material-ui/core';
import FolderIcon from '@mui/icons-material/Folder';
import { PhoneAndroid, CameraAlt, Cached } from '@material-ui/icons';
import VerifiedIcon from '@mui/icons-material/Verified';
import folder from '../../../assets/images/Folderwhite-01-01.svg';
import webcam from '../../../assets/images/web cam-01.svg';
import pan from '../../../assets/images/PAN Black-01.svg';
import checkgreen from '../../../assets/images/Subtraction 1.svg';
import checkgrey from '../../../assets/images/Subtraction 2.svg';
import male from '../../../assets/images/Mask Group 1.svg';
import female from '../../../assets/images/Mask Group 2.svg';
import radioon from '../../../assets/images/Icon ionic-ios-radio-button-on-1.svg';
import { useDispatch } from 'react-redux';
import { Required } from '../../../utils/tools';
import text from '../../../translations';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getCatalogDetails } from '../../../features/personalDetails/catalogSlice';
import { getDistrictDetails } from '../../../features/OptionsSlice/districtSlice';
import { addLabourPersonalDetails } from '../../../features/personalDetails/personalSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setNumber } from '../../component/ProgressSlice';
import axios from 'axios';
import {
  SERVER,
  getUserRegistrationDetails,
} from '../../../features/auth/authSlice';
import cookie from 'react-cookies';
import moment from 'moment';
import { current } from '@reduxjs/toolkit';
import { PersonalDetails } from '../../../features/personalDetails/PersonalDetails';
import dayjs from 'dayjs';
import { uploadFileAPI } from '../../../features/personalDetails/uploadImage';
import CancelIcon from '@mui/icons-material/Cancel';
import { reviewDetails } from '../../../features/ReviewSlice/ReviewSlice';

const videoConstraints = {
  width: 720,
  height: 720,
  facingMode: 'user',
  // facingMode: { exact: "environment" }
};

const Personal = ({ setRenderComponent }) => {
  const fileRef = useRef(null);
  const { en } = text;
  const dispatch = useDispatch();
  const myRef = React.createRef();
  const [loading, setLoding] = useState(false);
  const [selectedDob, setSelectedDob] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [fetchedData, setFetchedData] = React.useState({});
  const [profileImageID, setProfileImageID] = useState(null);
  const [showProfileImage, setShowProfileImage] = useState(null);
  const [educationDocName, setEducationDocName] = useState(null);
  const [fetchedLoading, setFetchedLoading] = useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  const [allValues, setAllValues] = React.useState({
    language: '',
    selectedDate: null,
    phoneNumber: '',
    maritalStatus: '',
    category: '',
    migrantState: '',
    isMigrant: 1,
    pancheck: false,
    aadharcheck: false,
    imgfile: '',
    webcamEnabled: false,
    open: false,
    setOpen: false,
    openDatePicker: false,
    formcontrolnum: 1,
    aadharnum1: null,
    aadharnum2: null,
    aadharnum3: null,
    aadhar: null,
    first_name: '',
    captchaText: '',
    lastname: '',
    email: '',
    fatherHusbandName: '',
    pan: '',
    gender: null,
    dob: null,
    documentUploadResponse: '',
    aadhaarFetchedData: null,
    firstnameError: false,
    firstnameErrorMessage: '',
    lastnameError: false,
    lastnameErrorMessage: '',
    panError: false,
    emailError: false,
    otp: '',
  });

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
  const classes = useStyles();

  useEffect(() => {
    const data = async () => {
      const details = {
        key: 'user_id',
        value: Cookies.get('id'),
        board_id: 1,
        procedure_name: 'all',
      };
      const response = await dispatch(reviewDetails(details));
      if (response.payload.data.application_details?.[0]?.application_no) {
        setRenderComponent(5);
      } else {
        handleEdit();
      }
    };
    data();
  }, []);

  const getTokenCookie = () => {
    return cookie.load('jwt');
  };

  const handleClickOpen = () => {
    setAllValues({
      ...allValues,
      open: !allValues.open,
    });
  };

  const handleClose = () => {
    setAllValues({
      ...allValues,
      open: !allValues.open,
    });
  };

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };

  const capture = async () => {
    setProfilePicture(null);
    formik.setFieldValue('imgfile', '');
    const imageSrc = myRef.current.getScreenshot();
    setProfilePicture(imageSrc);
    setAllValues({
      ...allValues,
      imgfile: imageSrc,
      open: !allValues.open,
    });
    const base64WithoutPrefix = `${imageSrc}`.replace(
      /^data:image\/jpeg;base64,/,
      '',
    );
    var str = base64WithoutPrefix;
    var enc = window.atob(str);
    var image = new File([enc], 'random.jpg', {
      type: 'image/jpeg',
    });
    var file = b64toBlob(str, 'image/jpeg');
    const profileFileAPI = await dispatch(
      uploadFileAPI(file, image.name, Cookies.get('id'), 'profileCaptureImage'),
    );
    insertPersonDetails(profileFileAPI.payload.image);
  };

  function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    console.log(byteArrays);

    return new File(byteArrays, 'pot', { type: contentType });
  }

  const insertPersonDetails = (profileImgResponse) => {
    const profileImage = [
      {
        file_id: profileImgResponse.fileId,
        file_name: profileImgResponse.originalFileName,
      },
    ];
    formik.setFieldValue('user_photo_id', profileImage[0].file_id);
  };
  const insertEducationDoc = (educationDoc) => {
    const educDoc = [
      {
        file_id: educationDoc.fileId,
        file_name: educationDoc.originalFileName,
      },
    ];
    formik.setFieldValue('qualification_document', educDoc);
    setEducationDocName(educDoc[0].file_name);
  };

  useEffect(() => {
    if (profileImageID) {
      axios
        .get(`${SERVER}api/upload/download_base_64/${profileImageID}`)
        .then((res) => {
          const { data } = res.data;
          setProfilePicture(`data:image/png;base64,${data.base_64_content}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [profileImageID]);

  const handleFileChange = async (ev) => {
    console.log(ev.target.files[0]);
    const { type, size } = ev.target.files[0];
    if (
      ['image/png', 'image/jpeg', 'image/jpg'].includes(type) &&
      size < 2000001
    ) {
      const reader = new FileReader();
      reader.readAsDataURL(ev.target.files[0]);
      reader.onload = () => {
        const imageDataURL = reader.result;
        setProfilePicture(imageDataURL);
      };
      const profileFileAPI = await dispatch(
        uploadFileAPI(
          ev.target.files[0],
          ev.target.files[0].name,
          Cookies.get('id'),
          'profileImage',
        ),
      );
      insertPersonDetails(profileFileAPI.payload.image);
    } else {
      if (size >= 2000001) {
        toast.error("'ERROR', 'Please upload file size less than 2MB", {
          position: 'bottom-right',
          theme: 'colored',
          autoClose: 3000,
        });
      } else {
        toast.error(
          'ERROR',
          'Please upload file in the PNG or JPEG/JPG format',
          {
            position: 'bottom-right',
            theme: 'colored',
            autoClose: 3000,
          },
        );
      }
    }
  };

  const updatePersonal = async (values) => {
    setFetchedLoading(true);
    setOpenBackdrop(true);
    setMaterialoading(false);
    setCateloading(false);
    setReligionloading(false);
    setEduloading(false);
    try {
      const response = await dispatch(addLabourPersonalDetails(values));
      console.log(response);
      if (response.payload.success) {
        toast.success('Submitted Successfully!', {
          position: 'bottom-right',
          theme: 'colored',
          autoClose: 3000,
        });
        setFetchedLoading(false);
        dispatch(setNumber(20));
        setProfilePicture(null);
        setRenderComponent(5);
        formik.resetForm();
      } else if (response.payload.error) {
        toast.error(`${response.payload.errors.msg}`, {
          position: 'bottom-right',
          theme: 'colored',
          autoClose: 3000,
        });
        setFetchedLoading(false);
      }
    } catch (error) {
      setFetchedLoading(false);
      console.log(error, 'this is all error');
    }
  };

  const submitPersonal = async (values) => {
    setFetchedLoading(true);
    setOpenBackdrop(true);
    setMaterialoading(false);
    setCateloading(false);
    setReligionloading(false);
    setEduloading(false);
    try {
      const response = await dispatch(addLabourPersonalDetails(values));
      console.log(response);
      if (response.payload.success) {
        toast.success('Submitted Successfully!', {
          position: 'bottom-right',
          theme: 'colored',
          autoClose: 3000,
        });
        setFetchedLoading(false);
        dispatch(setNumber(20));
        setProfilePicture(null);
        setRenderComponent(1);
        formik.resetForm();
      } else if (response.payload.error) {
        toast.error(`${response.payload.errors.msg}`, {
          position: 'bottom-right',
          theme: 'colored',
          autoClose: 3000,
        });
        setFetchedLoading(false);
      }
    } catch (error) {
      console.log(error, 'this is all error');
      setFetchedLoading(false);
    }
  };

  const initPersonalState = {
    user_id: parseInt(Cookies.get('id')),
    first_name: '',
    middle_name: '',
    last_name: '',
    mobile_no: '',
    dob: '',
    caste_id: '',
    martial_status_id: '',
    catalog_value_religion_id: '',
    selectedDate: null,
    is_ayushman_card_holder: 0,
    ayushman_card_number: null,
    user_photo_id: '',

    migrate_from_state_id: '',
    is_inter_state_migrant: null,
    inter_district_id: '',
    is_inter_district: null,
    inter_district_name: '',
    catalog_value_qualification_id: '',

    isMigrant: false,
    isDistrict: false,

    pancheck: false,
    aadharcheck: false,
    imgfile: {},
    webcamEnabled: false,
    open: false,
    setOpen: false,
    openDatePicker: false,
    formcontrolnum: 1,
    aadharnum1: null,
    aadharnum2: null,
    aadharnum3: null,
    aadhar: null,
    email: '',
    fatherHusbandName: '',
    pan_no: '',
    gender_id: 0,
    migrantDistrict: '',
    //qualification_document_id: '',
    education: '',
    qualification: '',
    caste_name: '',
    qualification_document: '',

    religion_name: '',
    martial_name: '',
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required('First name is required'),
    //last_name: Yup.string().required('Last name is required'),
    gender_id: Yup.string().required('Gender is required'),
    // email: Yup.string()
    //   .email('Invalid email address')
    //   .required('Email address is required'),
    martial_status_id: Yup.string().required('Marital status is required'),
    pan_no: Yup.string()
      .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, 'Invalid PAN number')
      .required('PAN card number is required'),
    dob: Yup.string()
      .required('Please enter DOB')
      .test('valid-date', 'Please enter a valid date', function (value) {
        if (!value) {
          return false;
        }
        const dobDate = new Date(value);
        const ageDifferenceInYears = dayjs().diff(dayjs(dobDate), 'year');
        if (ageDifferenceInYears < 18) {
          return false;
        }
        return true;
      }),
    is_inter_state_migrant: Yup.string().required(
      'Please enter InterState migrant worker',
    ),
    is_inter_district: Yup.string().required(
      'Please enter District migrant worker',
    ),
    is_ayushman_card_holder: Yup.string().required(
      'Please enter Ayushman card',
    ),
    catalog_value_qualification_id: Yup.string().required(
      'Education is required',
    ),
    catalog_value_religion_id: Yup.string().required('Religion is required'),
    caste_id: Yup.string().required('Category is required'),
    mobile_no: Yup.string().required('Phone Number is Required'),
  });

  const [cate, setCate] = useState([]);
  const [religion, setReligion] = useState([]);
  const [material, setMaterial] = useState([]);
  const [education, setEducation] = useState([]);

  const [eduloading, setEduloading] = useState(false);
  const [cateloading, setCateloading] = useState(false);
  const [materialoading, setMaterialoading] = useState(false);
  const [religionloading, setReligionloading] = useState(false);

  const [selectedfiles, setselectedfiles] = React.useState({});

  const handleUploadEducationDoc = async (ev) => {
    const { type, size } = ev.target.files[0];
    if (
      ['image/png', 'image/jpeg', 'image/jpg'].includes(type) &&
      size < 2000001
    ) {
      const reader = new FileReader();

      //
      const joined = Array.from(selectedfiles).concat(
        Array.from(ev.target.files),
      );
      setselectedfiles(joined);
      //

      reader.onload = () => {
        const imageDataURL = reader.result;
      };
      reader.readAsDataURL(ev.target.files[0]);
      console.log(ev.target.files[0]);
      const educationFileAPI = await dispatch(
        uploadFileAPI(
          ev.target.files[0],
          ev.target.files[0].name,
          Cookies.get('id'),
          'educationDocument',
        ),
      );
      insertEducationDoc(educationFileAPI.payload.image);
    } else {
      if (size >= 2000001) {
        toast.error("'ERROR', 'Please upload file size less than 2MB", {
          position: 'bottom-right',
          theme: 'colored',
          autoClose: 3000,
        });
      } else {
        toast.error(
          'ERROR',
          'Please upload file in the PNG or JPEG/JPG format',
          {
            position: 'bottom-right',
            theme: 'colored',
            autoClose: 3000,
          },
        );
      }
    }
  };

  const [dob, setDob] = useState(null);
  const [genderID, setGenderID] = useState(null);
  const [imageEKYCID, setImageEKYCID] = useState(null);
  const [vaultRefNumber, setVaultRefNumber] = useState(null);
  const [aadhaarDuplicate, setAadharDuplicate] = useState(null);
  const [aadhaarValidated, setAadharValidated] = useState(null);
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(null);
  const [personalFields, setPersonalFields] = useState({
    first_name: null,
    middle_name: null,
    last_name: null,
    pan_no: null,
    mobile_no: null,
    mail_id: null,
    ayushManCardNumber: null,
    rdNumber: null,
    maritialStatus: null,
    gender: null,
    caste: null,
    religion: null,
    education: null,
  });

  const labourUserID = cookie.load('id');

  useEffect(() => {
    if (window.location.toString().includes('Success')) {
      const queryString = JSON.stringify(window.location.search);

      const vaultRefN = queryString
        .substring(queryString.lastIndexOf('refno=') + 6)
        .split(' ')[0];
      const vaultRefNo = vaultRefN.substring(0, vaultRefN.length - 1);
      setVaultRefNumber(vaultRefNo);

      const payLoad = {
        key: 'aadhar_no',
        value: vaultRefNo,
        board_id: 1,
      };

      axios
        .post(`${SERVER}api/user/get-user`, payLoad, {
          headers: {
            Authorization: `Bearer ${getTokenCookie()}`,
          },
        })
        .then((res) => {
          const { data } = res.data;
          setAadharDuplicate(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (window.location.toString().includes('Failure')) {
      toast.error('ERROR', 'Aadhaar Verification failed, please try again.');
    }
  }, []);

  useEffect(() => {
    if (aadhaarDuplicate) {
      if (aadhaarDuplicate.length === 0) {
        const payLoad = {
          labour_user_id: labourUserID,
          vault_ref_no: vaultRefNumber,
        };
        axios
          .post(`${SERVER}api/global/update_ekyc_vault_number`, payLoad)
          .then((res) => {
            const { data } = res.data;
            setAadharValidated(true);
          })
          .catch((err) => {
            console.log(err);
            toast.error('ERROR', err.response.data.errors.msg.msg);
          });
      } else {
        setAadharValidated(true);
      }
    }
  }, [aadhaarDuplicate, labourUserID, vaultRefNumber]);

  useEffect(() => {
    if (aadhaarValidated) {
      const payLoad = {
        labour_user_id: labourUserID,
      };
      axios
        .post(`${SERVER}api/user/get_ad_details`, payLoad, {
          headers: {
            Authorization: `Bearer ${getTokenCookie()}`,
          },
        })
        .then((res) => {
          const { data } = res.data;
          setShowProfileImage(`data:image/png;base64,${data[0].document_link}`);
          setImageEKYCID(data[0].image);
          const fullName = data[0].name.split(' ');
          const lastName = fullName.pop();
          const middleName = fullName.pop();
          const firstName = fullName.join(' ');
          setIsAadhaarVerified(true);
          setPersonalFields((prev) => ({
            ...prev,
            first_name: firstName ?? '',
            last_name: lastName ?? '',
            middle_name: middleName ?? '',
          }));
          setDob(
            data[0].dob &&
              moment(data[0].dob, 'YYYY-MM-DD').format('DD/MM/YYYY'),
          );
          setGenderID(
            data[0].gender === 'M' ? 27 : data[0].gender === 'F' ? 28 : 29,
          );
        });
    }
  }, [aadhaarValidated, labourUserID]);

  const handleVerifyAadhaar = () => {
    const currentDateTime = Date.now();
    const randNum = Math.floor(100000 + Math.random() * 900000);
    const payLoad = {
      deptCode: '9',
      integrationKey: '0dac67ae-00bb-47fb-8c10-f5fc1776e91d',
      integrationPassword: '-t-69hpP8K?Do-VX',
      txnNo: randNum,
      txnDateTime: currentDateTime,
      serviceCode: '3',
      responseRedirectURL: `http://localhost:5173/registration`,
    };
    axios
      .post(`${SERVER}/api/global/get_ekyc_token`, payLoad, {
        headers: {
          Authorization: `Bearer ${getTokenCookie()}`,
        },
      })
      .then((res) => {
        const { data } = res.data;
        window.open(
          `https://dbt.karnataka.gov.in/HSMService/EKYCService.aspx?key=0dac67ae-00bb-47fb-8c10-f5fc1776e91d&token=${data.token}`,
          '_blank',
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const GetMaritalStatus = async (catalog_name) => {
    setMaterialoading(true);
    let payload = {
      board_id: 1,
      catalog_name: catalog_name,
    };
    try {
      if (material.length == 0) {
        const response = await dispatch(getCatalogDetails(payload));
        setMaterialoading(false);
        setMaterial(response.payload.data);
        return response.payload.data;
      }
      setMaterialoading(false);
    } catch (error) {
      console.error('Error fetching catalog details:', error);
    }
  };

  const GetCategory = async (catalog_name) => {
    setCateloading(true);
    let payload = {
      board_id: 1,
      catalog_name: catalog_name,
    };
    try {
      if (cate.length == 0) {
        const response = await dispatch(getCatalogDetails(payload));
        setCateloading(false);
        setCate(response.payload.data);
        return response.payload.data;
      }
      setCateloading(false);
    } catch (error) {
      console.error('Error fetching catalog details:', error);
    }
  };

  const GetReligion = async (catalog_name) => {
    setReligionloading(true);
    let payload = {
      board_id: 1,
      catalog_name: catalog_name,
    };
    try {
      if (religion.length == 0) {
        const response = await dispatch(getCatalogDetails(payload));
        setReligionloading(false);
        setReligion(response.payload.data);
        return response.payload.data;
      }
      setReligionloading(false);
    } catch (error) {
      console.error('Error fetching catalog details:', error);
    }
  };

  const GetEducation = async (catalog_name) => {
    setEduloading(true);
    let payload = {
      board_id: 1,
      catalog_name: catalog_name,
    };
    try {
      if (education.length == 0) {
        const response = await dispatch(getCatalogDetails(payload));
        setEduloading(false);
        setEducation(response.payload.data);
        return response.payload.data;
      }
    } catch (error) {
      console.error('Error fetching catalog details:', error);
    }
  };

  const [dist, setDist] = useState([]);

  const getDistrict = async () => {
    setLoding(true);
    const payload = 12;
    try {
      if (dist.length == 0) {
        const response = await dispatch(getDistrictDetails(payload));
        setLoding(false);
        setDist(response.payload.data);
      }
    } catch (error) {
      console.log(error, 'somethign went wrong');
    }
  };

  const formik = useFormik({
    initialValues: initPersonalState,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (fetchedData?.first_name === '') {
        submitPersonal(values);
      } else {
        updatePersonal(values);
      }
    },
  });

  const handleEdit = async () => {
    const details = {
      key: 'user_id',
      value: parseInt(Cookies.get('id')),
      board_id: 1,
      procedure_name: 'personal_details',
    };
    const response = await dispatch(PersonalDetails(details));
    console.log(response.payload.data[0]);
    const responseData = response.payload.data[0];
    const first_name = responseData?.first_name;
    setFetchedData(responseData);
    const religionData = await GetReligion('Religion');
    const religionName = religionData?.filter(
      (e) => e.value_id === responseData.catalog_value_religion_id,
    );
    let isMigrantState = '';
    let isMigrantDistrict = '';
    let asayushman_card_holder_number = '';
    let isMigrantStateId = '';
    let isMigrantDistrictId = '';
    let isMigrantDistrictName = '';
    let asayushmanCardHolderNumber = null;
    if (first_name) {
      isMigrantState = responseData.is_inter_state_migrant ? '1' : '0';
      isMigrantDistrict = responseData.is_inter_district ? '1' : '0';
      asayushman_card_holder_number = responseData.is_ayushman_card_holder
        ? '1'
        : '0';
      if (isMigrantState !== '0') {
        isMigrantStateId = responseData.migrate_from_state_id;
      }
      if (isMigrantDistrict !== '0') {
        isMigrantDistrictId = responseData.inter_district_id;
        isMigrantDistrictName = responseData.inter_district_name;
      }
      if (asayushman_card_holder_number !== '0') {
        asayushmanCardHolderNumber = parseInt(
          responseData.ayushman_card_number,
        );
      }
    }

    if (response.payload.data.length > 0) {
      let qualicationData = null;
      if (responseData.catalog_value_qualification_id > 18) {
        qualicationData = JSON.parse(responseData.qualification_document_id);
        setEducationDocName(qualicationData[0].file_name);
      } else {
        setEducationDocName(null);
      }
      formik.setValues({
        first_name: responseData.first_name,
        middle_name: responseData.middle_name,
        last_name: responseData.last_name,
        mobile_no: responseData.mobile_no,
        email: responseData.mail_id,
        pan_no: responseData.pan_no,
        gender_id: responseData.catalog_value_gender_id,
        user_photo_id: responseData.user_photo_id,

        is_inter_state_migrant: isMigrantState,
        migrate_from_state_id: isMigrantStateId,
        is_inter_district: isMigrantDistrict,
        inter_district_id: isMigrantDistrictId,
        inter_district_name: isMigrantDistrictName,
        ayushman_card_number: asayushmanCardHolderNumber,
        is_ayushman_card_holder: asayushman_card_holder_number,
        catalog_value_qualification_id:
          responseData.catalog_value_qualification_id,
        qualification: responseData.qualification,
        qualification_document: qualicationData ? qualicationData : '',

        caste_id: responseData.catalog_value_caste_id,
        caste_name: responseData.caste,
        catalog_value_religion_id: responseData.catalog_value_religion_id,
        religion_name: religionName?.[0]?.description,
        martial_status_id: responseData.catalog_value_marital_status_id,
        martial_name: responseData.marital_status,
        dob: responseData.date_of_birth,
      });
      if (responseData?.user_photo_id) {
        setProfileImageID(responseData?.user_photo_id);
      }
    }
  };

  //console.log(formik.values, 'values.for');

  return (
    <div>
      <Row className="m-0">
        {fetchedLoading ? (
          <Backdrop
            className={classes.backdrop}
            open={openBackdrop}
            onClick={fetchedLoading ? null : handleCloseBackdrop}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : null}
        <ToastContainer />
        <div>
          <div className="d-flex justify-content-center align-items-center">
            {!aadhaarValidated && (
              <Button
                type="button"
                onClick={handleVerifyAadhaar}
                variant="contained"
                color="info"
                className="py-3 px-5 fs-6 bg-danger"
              >
                Click here to verify your Aadhaar
              </Button>
            )}
            {aadhaarValidated && (
              <Button
                type="button"
                onClick={handleVerifyAadhaar}
                variant="contained"
                color="success"
                className="py-3 px-5 fs-6"
                disabled={aadhaarValidated}
                sx={{
                  '&.Mui-disabled': {
                    background: '#66BB6A',
                    color: '#ffffff',
                  },
                }}
                startIcon={
                  <VerifiedIcon style={{ width: '50px', height: '40px' }} />
                }
              >
                Aadhaar Verified Successfully
              </Button>
            )}
          </div>

          <form onSubmit={formik.handleSubmit}>
            <Row className="m-0">
              <Row className="form-row mt-4">
                <Col xs={12} md={6} className="personal-col-1">
                  <div className="form-inner-card-right">
                    <Required className="mb-2" title={en.firstName} />
                    <FormControl fullWidth={true} className="formcontrol1">
                      <TextField
                        variant="outlined"
                        placeholder="Enter Your First Name"
                        name="first_name"
                        type="text"
                        value={formik.values.first_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </FormControl>
                    {formik.touched.first_name && formik.errors.first_name && (
                      <div style={{ color: 'red' }}>
                        {formik.errors.first_name}
                      </div>
                    )}

                    <p className="mt-4 mb-2 text-start">{en.middleName}</p>
                    <FormControl fullWidth={true} className="formcontrol1">
                      <TextField
                        variant="outlined"
                        placeholder="Enter Your Middle Name"
                        name="middle_name"
                        value={formik.values.middle_name}
                        onChange={formik.handleChange}
                      />
                    </FormControl>

                    <p className="mt-4 mb-2 text-start">{en.lastName}</p>
                    <FormControl fullWidth={true} className="formcontrol1">
                      <TextField
                        variant="outlined"
                        placeholder="Enter Your Last Name"
                        name="last_name"
                        type="text"
                        value={formik.values.last_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </FormControl>
                    {formik.touched.last_name && formik.errors.last_name && (
                      <div style={{ color: 'red' }}>
                        {formik.errors.last_name}
                      </div>
                    )}

                    <Required
                      className="mt-4 mb-2"
                      title={en.enterYourMobileNumber}
                    />
                    <FormControl fullWidth={true} className="formcontrol2">
                      <TextField
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneAndroid className="phone-icon" />
                              +91
                            </InputAdornment>
                          ),
                        }}
                        variant="outlined"
                        placeholder="XXXXX 99999"
                        name="mobile_no"
                        type="number"
                        onChange={(event) => {
                          const inputValue = event.target.value;
                          if (inputValue.length <= 10) {
                            formik.handleChange(event);
                          }
                        }}
                        value={formik.values.mobile_no}
                        onBlur={formik.handleBlur}
                        inputProps={{ maxLength: 10 }}
                      />
                    </FormControl>
                    {formik.touched.mobile_no && formik.errors.mobile_no && (
                      <div className="text-danger">
                        {formik.errors.mobile_no}
                      </div>
                    )}
                  </div>
                </Col>

                <Col xs={12} md={6} className="personal-col-2">
                  <div className="form-inner-card-right mt-0">
                    <div className="picupload">
                      <div>
                        <input
                          type="file"
                          name="photo"
                          id="upload-photo"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                        {profilePicture ? (
                          <img
                            alt="Profile"
                            src={profilePicture}
                            style={{ width: '200px', height: '200px' }}
                          />
                        ) : (
                          <CameraAlt className="cameraAlt2" />
                        )}

                        <div className="d-flex justify-content-center align-align-items-center">
                          <Required
                            className="upload-title required-p"
                            title={en.uploadYourProfilePicture}
                            style={{ width: 'auto', marginLeft: '210px' }}
                          ></Required>
                        </div>
                      </div>

                      <div className="browse-buttons-div my-4">
                        <label htmlFor="upload-photo" className="browse-button">
                          <img alt="..." src={folder} />
                          {en.browse}
                        </label>
                        <input
                          type="file"
                          name="photo"
                          id="upload-photo"
                          onChange={handleFileChange}
                        />
                        <div className="or-between-buttons">or</div>
                        <p onClick={handleClickOpen} className="webcam-button">
                          <img alt="..." src={webcam} />
                          {en.useWebCamera}
                        </p>
                      </div>

                      <Dialog
                        open={allValues.open}
                        onClose={handleClose}
                        aria-labelledby="scroll-dialog-title"
                        aria-describedby="scroll-dialog-description"
                        fullWidth={true}
                        // maxWidth='750px'
                      >
                        <DialogTitle id="scroll-dialog-title">
                          {en.captureImageforProfilePicture}
                        </DialogTitle>
                        <DialogContent>
                          <Webcam
                            audio={false}
                            height={400}
                            ref={myRef}
                            name="imgfile"
                            screenshotFormat="image/jpeg"
                            width={400}
                            mirrored
                            value={formik.values.imgfile}
                            // fullWidth={true}
                            videoConstraints={videoConstraints}
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose} color="primary">
                            Cancel
                          </Button>
                          <Button onClick={capture} color="primary">
                            Capture
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                    <div className="pic-below-border"></div>
                  </div>
                </Col>

                <Col xs={12} md={6} className="personal-col-3">
                  <div className="form-inner-card-right mt-0">
                    <p className="mt-5 mb-2 text-start">
                      {en.enterEmailAddress}
                    </p>
                    <FormControl fullWidth={true} className="formcontrol3">
                      <TextField
                        variant="outlined"
                        placeholder="Enter Your Email Address"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </FormControl>
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-danger">{formik.errors.email}</div>
                    )}

                    <Required className="mt-5 mb-2" title={en.maritalStatus} />
                    <FormControl
                      variant="outlined"
                      fullWidth={true}
                      className="formcontrol5"
                    >
                      <Select
                        className="select-marital"
                        labelid="demo-simple-select-required-label"
                        id="demo-simple-select-required"
                        defaultValue={
                          formik.values.martial_status_id == ''
                            ? 'select'
                            : formik.values.martial_status_id
                        }
                        value={
                          formik.values.martial_status_id
                            ? formik.values.martial_status_id
                            : 'select'
                        }
                        name="martial_status_id"
                        displayEmpty
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        onOpen={() => GetMaritalStatus('Marital Status')}
                      >
                        <MenuItem
                          value={formik.values.martial_status_id || 'select'}
                          disabled
                        >
                          <ListItemText
                            primary={
                              materialoading
                                ? 'Loading...'
                                : formik.values.martial_name || '--Select--'
                            }
                          />
                        </MenuItem>

                        {material?.map((item) => (
                          <MenuItem key={item.value_id} value={item.value_id}>
                            <ListItemText
                              style={{ color: 'black' }}
                              primary={item.short_name}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {formik.touched.martial_status_id &&
                      formik.errors.martial_status_id && (
                        <div className="text-danger">
                          {formik.errors.martial_status_id}
                        </div>
                      )}
                  </div>
                </Col>

                <Col xs={12} md={6} className="personal-col-4">
                  <div className="form-inner-card-right mt-0">
                    <Required
                      className="mt-5 mb-2"
                      title={en.enterYourPANCardNumber}
                    />
                    <FormControl
                      fullWidth={true}
                      className="formcontrol8 pan-div"
                    >
                      <TextField
                        name="pan_no"
                        variant="outlined"
                        placeholder="LLNP••••P"
                        value={formik.values.pan_no}
                        inputProps={{ maxLength: 10 }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <img src={pan} alt="..." className="otp-icon" />
                            </InputAdornment>
                          ),

                          endAdornment: (
                            <InputAdornment
                              position="start"
                              disablePointerEvents
                            >
                              {!formik.errors.pan_no ? (
                                <img alt="..." src={checkgreen} />
                              ) : (
                                <img alt="..." src={checkgrey} />
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                    {formik.touched.pan_no && formik.errors.pan_no && (
                      <div className="text-danger">{formik.errors.pan_no}</div>
                    )}

                    <Required
                      className="mt-5 mb-0"
                      title={en.selectYourGender}
                    />
                    <div className="gender-div">
                      <div className="button genderradio">
                        <input
                          id="male"
                          type="radio"
                          name="gender_id"
                          value={27}
                          onChange={formik.handleChange}
                          checked={formik.values.gender_id == 27}
                        />
                        <label htmlFor="male">
                          <img alt="..." src={male} />
                          <span>{en.male}</span>
                        </label>
                      </div>
                      <div className="button genderradio">
                        <input
                          id="female"
                          type="radio"
                          name="gender_id"
                          value={28}
                          onChange={formik.handleChange}
                          checked={formik.values.gender_id == 28}
                        />
                        <label htmlFor="female">
                          <img alt="..." src={female} />
                          <span>{en.female}</span>
                        </label>
                      </div>
                      <div className="button genderradio">
                        <input
                          id="others"
                          type="radio"
                          name="gender_id"
                          value={29}
                          onChange={formik.handleChange}
                          checked={formik.values.gender_id == 29}
                        />
                        <label htmlFor="others">
                          <img alt="..." src={radioon} />
                          <span>{en.others}</span>
                        </label>
                      </div>
                    </div>
                    {formik.touched.gender_id && formik.errors.gender_id && (
                      <div className="text-danger">
                        {formik.errors.gender_id}
                      </div>
                    )}
                    <div className="gender-below-border"></div>
                  </div>
                </Col>

                <Col xs={12} md={6} className="mt-5 personal-col-5">
                  <div className="form-inner-card-right mt-0">
                    <Required className="mb-2 mt-4" title={en.dateofBirth} />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker']}>
                        <DatePicker
                          name="dob"
                          className="datepicker"
                          format="MM-DD-YYYY"
                          value={dayjs(formik.values.dob)}
                          onChange={(value) => {
                            setSelectedDob(value);
                            formik.setFieldValue(
                              'dob',
                              dayjs(value).format('MM-DD-YYYY'),
                            );
                          }}
                          onBlur={formik.handleBlur}
                        />
                      </DemoContainer>
                      {formik.touched.dob && formik.errors.dob && (
                        <div className="text-danger">{formik.errors.dob}</div>
                      )}
                    </LocalizationProvider>

                    <Required className="mt-5 mb-2" title={en.category} />
                    <FormControl
                      variant="outlined"
                      fullWidth={true}
                      className="formcontrol5"
                    >
                      <Select
                        name="caste_id"
                        className="select-marital"
                        defaultValue={
                          formik.values.caste_id == ''
                            ? 'select'
                            : formik.values.caste_id
                        }
                        value={
                          formik.values.caste_id
                            ? formik.values.caste_id
                            : 'select'
                        }
                        id="demo-simple-select-required"
                        labelid="demo-simple-select-required-label"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        onOpen={() => GetCategory('Category')}
                        displayEmpty
                      >
                        <MenuItem
                          value={formik.values.caste_id || 'select'}
                          disabled
                        >
                          <ListItemText
                            primary={
                              cateloading
                                ? 'Loading...'
                                : formik.values.caste_name || '--Select--'
                            }
                          />
                        </MenuItem>
                        {cate?.map((i) => (
                          <MenuItem key={i.value_id} value={i.value_id}>
                            <ListItemText
                              style={{ color: 'black' }}
                              primary={i.short_name}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {formik.touched.caste_id && formik.errors.caste_id && (
                      <div className="text-danger">
                        {formik.errors.caste_id}
                      </div>
                    )}

                    <Required className="mt-4 mb-2" title={en.religion} />
                    <FormControl
                      variant="outlined"
                      fullWidth={true}
                      className="formcontrol5"
                    >
                      <Select
                        className="select-marital"
                        labelid="demo-simple-select-required-label"
                        id="demo-simple-select-required"
                        defaultValue={
                          formik.values.catalog_value_religion_id == ''
                            ? 'select'
                            : formik.values.catalog_value_religion_id
                        }
                        value={
                          formik.values.catalog_value_religion_id
                            ? formik.values.catalog_value_religion_id
                            : 'select'
                        }
                        name="catalog_value_religion_id"
                        displayEmpty
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        onOpen={() => GetReligion('Religion')}
                      >
                        <MenuItem
                          value={
                            formik.values.catalog_value_religion_id || 'select'
                          }
                          disabled
                        >
                          <ListItemText
                            primary={
                              religionloading
                                ? 'Loading...'
                                : formik.values.religion_name || '--Select--'
                            }
                          />
                        </MenuItem>

                        {religion?.map((i) => (
                          <MenuItem key={i.value_id} value={i.value_id}>
                            <ListItemText
                              style={{ color: 'black' }}
                              primary={i.description}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {formik.touched.catalog_value_religion_id &&
                      formik.errors.catalog_value_religion_id && (
                        <div className="text-danger">
                          {formik.errors.catalog_value_religion_id}
                        </div>
                      )}

                    <Required className="mt-4 mb-2" title={en.education} />
                    <FormControl
                      variant="outlined"
                      fullWidth={true}
                      className="formcontrol5"
                    >
                      <Select
                        className="select-marital"
                        labelid="demo-simple-select-required-label"
                        id="demo-simple-select-required"
                        defaultValue={
                          formik.values.catalog_value_qualification_id == ''
                            ? 'select'
                            : formik.values.catalog_value_qualification_id
                        }
                        value={
                          formik.values.catalog_value_qualification_id
                            ? formik.values.catalog_value_qualification_id
                            : 'select'
                        }
                        name="catalog_value_qualification_id"
                        displayEmpty
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        onOpen={() => GetEducation('Education')}
                      >
                        <MenuItem
                          value={
                            formik.values.catalog_value_qualification_id ||
                            'select'
                          }
                          disabled
                        >
                          <ListItemText
                            primary={
                              eduloading
                                ? 'Loading...'
                                : formik.values.qualification || '--Select--'
                            }
                          />
                        </MenuItem>

                        {education?.map((i) => (
                          <MenuItem key={i.value_id} value={i.value_id}>
                            <ListItemText
                              style={{ color: 'black' }}
                              primary={i.short_name}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {formik.touched.catalog_value_qualification_id &&
                      formik.errors.catalog_value_qualification_id && (
                        <div className="text-danger">
                          {formik.errors.catalog_value_qualification_id}
                        </div>
                      )}

                    {formik.values.catalog_value_qualification_id > 18 && (
                      <FormControl
                        variant="outlined"
                        fullWidth={true}
                        className="formcontrol5 p-3 mt-3"
                      >
                        <input
                          name="document-upload"
                          type="file"
                          onChange={handleUploadEducationDoc}
                          style={{
                            opacity: 0,
                            position: 'absolute',
                            zIndex: -1,
                          }}
                          id="document-upload"
                          ref={fileRef}
                          required={!educationDocName}
                        />
                        <label htmlFor="document-upload p-2">
                          <button
                            htmlFor="upload-photo"
                            className="browse-button"
                            style={{ fontSize: '18px' }}
                            onClick={() => fileRef.current?.click()}
                          >
                            <img alt="..." src={folder} /> {en.browse}
                          </button>
                        </label>
                        {educationDocName && (
                          <div className="d-flex justify-content-center">
                            <p className="mt-3">
                              Selected file: {educationDocName}
                            </p>
                            <CancelIcon
                              onClick={() => setEducationDocName(null)}
                              style={{
                                fontSize: '30px',
                                cursor: 'pointer',
                                color: '#9B1D03',
                                marginLeft: '10px',
                                marginTop: '10px',
                              }}
                            />
                          </div>
                        )}
                      </FormControl>
                    )}
                  </div>
                </Col>

                <Col xs={12} md={6} className="personal-col-6 mt-4 ">
                  <div className="form-inner-card-right mt-0">
                    <FormControl
                      className="mt-2 mb-2 interstateRadio formcontrol9"
                      variant="outlined"
                      fullWidth={true}
                      component="fieldset"
                    >
                      <RadioGroup
                        row
                        name="is_inter_state_migrant"
                        value={formik.values.is_inter_state_migrant}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <p className="mt-2 mb-2" style={{ flexGrow: 1 }}>
                          {en.interstateMigrantWorker}
                        </p>
                        <FormControlLabel
                          value="1"
                          control={<Radio />}
                          label={en.yes}
                        />
                        <FormControlLabel
                          value="0"
                          control={<Radio />}
                          label={en.no}
                        />
                      </RadioGroup>
                    </FormControl>
                    {formik.touched.is_inter_state_migrant &&
                      formik.errors.is_inter_state_migrant && (
                        <div className="text-danger">
                          {formik.errors.is_inter_state_migrant}
                        </div>
                      )}

                    {formik.values.is_inter_state_migrant === '1' && (
                      <div>
                        <p className="mt-2 mb-2">{en.migrantFromState}</p>
                        <FormControl
                          variant="outlined"
                          className="formcontrol5"
                          fullWidth={true}
                        >
                          <Select
                            className="select-state"
                            labelid="demo-simple-select-required-label"
                            id="demo-simple-select-required"
                            value={formik.values.migrate_from_state_id}
                            required={
                              formik.values.is_inter_state_migrant === '1'
                            }
                            name="migrate_from_state_id"
                            displayEmpty
                            onChange={formik.handleChange}
                          >
                            <MenuItem value="" disabled>
                              <ListItemText primary="--Select--" />
                            </MenuItem>
                            <MenuItem value={'12'}>
                              <ListItemText
                                style={{ color: 'black' }}
                                primary="Karnataka"
                              />
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    )}
                  </div>

                  <div className="form-inner-card-right mt-0">
                    <FormControl
                      className="mt-2 mb-2 interstateRadio formcontrol9"
                      variant="outlined"
                      fullWidth={true}
                      component="fieldset"
                    >
                      <RadioGroup
                        row
                        name="is_inter_district"
                        value={formik.values.is_inter_district}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <p className="mt-2 mb-2" style={{ flexGrow: 1 }}>
                          {en.interstateDistict}
                        </p>
                        <FormControlLabel
                          value="1"
                          control={<Radio />}
                          label={en.yes}
                        />
                        <FormControlLabel
                          value="0"
                          control={<Radio />}
                          label={en.no}
                        />
                      </RadioGroup>
                    </FormControl>
                    {formik.touched.is_inter_district &&
                      formik.errors.is_inter_district && (
                        <div className="text-danger">
                          {formik.errors.is_inter_district}
                        </div>
                      )}

                    {formik.values.is_inter_district === '1' && (
                      <div>
                        <p className="mt-2 mb-2">{en.migrantFromDistrict}</p>
                        <FormControl
                          variant="outlined"
                          fullWidth={true}
                          required={formik.values.is_inter_district === '1'}
                        >
                          <Select
                            className="select-state"
                            labelId="demo-simple-select-required-label"
                            id="demo-simple-select-required"
                            defaultValue={
                              formik.values.inter_district_id || 'select'
                            }
                            value={formik.values.inter_district_id || 'select'}
                            name="inter_district_id"
                            onChange={formik.handleChange}
                            onOpen={getDistrict}
                            displayEmpty
                          >
                            <MenuItem
                              value={
                                formik.values.inter_district_id || 'select'
                              }
                              disabled
                            >
                              <ListItemText
                                primary={
                                  loading
                                    ? 'Loading..'
                                    : formik.values.inter_district_name
                                      ? formik.values.inter_district_name
                                      : '--select--'
                                }
                              />
                            </MenuItem>

                            {dist?.map((i) => (
                              <MenuItem key={i.id} value={i.id}>
                                <ListItemText
                                  style={{ color: 'black' }}
                                  primary={i.short_name + ' | ' + i.name}
                                />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    )}
                  </div>

                  <div className="form-inner-card-right mt-0">
                    <FormControl
                      className="mt-2 mb-2 interstateRadio formcontrol9"
                      variant="outlined"
                      fullWidth={true}
                      component="fieldset"
                    >
                      <RadioGroup
                        row
                        name="is_ayushman_card_holder"
                        value={formik.values.is_ayushman_card_holder}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <p className="mt-2 mb-2" style={{ flexGrow: 1 }}>
                          {en.ayushmanholder}
                        </p>
                        <FormControlLabel
                          value="1"
                          control={<Radio />}
                          label={en.yes}
                        />
                        <FormControlLabel
                          value="0"
                          control={<Radio />}
                          label={en.no}
                        />
                      </RadioGroup>
                    </FormControl>
                    {formik.touched.is_ayushman_card_holder &&
                      formik.errors.is_ayushman_card_holder && (
                        <div className="text-danger">
                          {formik.errors.is_ayushman_card_holder}
                        </div>
                      )}

                    {formik.values.is_ayushman_card_holder === '1' && (
                      <div>
                        <p className="mt-2 mb-2">{en.ayushmancardnumber}</p>
                        <FormControl
                          className="formcontrol8 pan-div"
                          fullWidth={true}
                        >
                          <TextField
                            type="number"
                            className="select-state"
                            variant="outlined"
                            labelid="demo-simple-select-required-label"
                            id="demo-simple-select-required"
                            value={formik.values.ayushman_card_number}
                            name="ayushman_card_number"
                            placeholder="Enter Card Number"
                            inputProps={{ maxLength: 14 }}
                            onChange={(event) => {
                              const inputValue = event.target.value;
                              if (inputValue.length <= 14) {
                                formik.handleChange(event);
                              }
                            }}
                            required={
                              formik.values.is_ayushman_card_holder === '1'
                            }
                          ></TextField>
                        </FormControl>
                      </div>
                    )}
                  </div>
                </Col>

                <Col xs={12} className="note2 text-center mt-5 personal-col-7">
                  <p>
                    <span>{en.note}</span>
                    {
                      en.afterthecompletionofthemandatoryfieldsinPersonalDetailsthenonlythesystemwillallowthefurtherprocess
                    }
                  </p>
                </Col>
              </Row>

              <Row row="true" className="button-inside-form-row mb-5">
                <Col xs={12} className="next-back-button-row mt-4">
                  {fetchedData?.first_name === '' ? (
                    <div>
                      <Link to="/dashboardMigrant" style={{ flexGrow: '0.5' }}>
                        <Button variant="danger" className="back-button">
                          {en.back}
                        </Button>
                      </Link>

                      <Button
                        type="submit"
                        variant="outline-primary"
                        className="next-button"
                      >
                        {en.saveandContinue}
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Button
                        type="submit"
                        variant="outline-primary"
                        className="next-button"
                      >
                        {en.saveyourDetails}
                      </Button>
                    </div>
                  )}
                </Col>
              </Row>
            </Row>
          </form>
        </div>
      </Row>
    </div>
  );
};

export default Personal;
