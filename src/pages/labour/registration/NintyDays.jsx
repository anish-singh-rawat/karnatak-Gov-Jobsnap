import {
  FormControl,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  ListItemText,
  TextareaAutosize,
  Backdrop,
  CircularProgress,
  makeStyles,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AddCircleRounded } from '@material-ui/icons';
import folder from '../../../assets/images/Folderwhite-01-01.svg';
import close from '../../../assets/images/close-01.svg';
import closeicon from '../../../assets/images/closeIcon.svg';
import mobile from '../../../assets/images/Phone 1-01.svg';
import { useDispatch, useSelector } from 'react-redux';
import text from '../../../translations';
import validator from 'validator';
import { Required } from '../../../utils/tools';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import CancelIcon from '@mui/icons-material/Cancel';
import 'react-toastify/dist/ReactToastify.css';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import {
  addNintyDaysDetails,
  getCityNameDetails,
  getDistrictDetails,
  getInspectorDetails,
  getIssuerDetails,
  getNatureWorkDetails,
  getTalukDetails,
  getUnionDetails,
  getUserRegistration,
  getVillageNameDetails,
  updateNintyDaysDetails,
} from '../../../features/Ninety-Day-Details/NinetydaySlice';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import { Autocomplete } from '@mui/material';
import { uploadFileAPI } from '../../../features/personalDetails/uploadImage';
import { reviewDetails } from '../../../features/ReviewSlice/ReviewSlice';

const NintyDays = ({ setRenderComponent }) => {
  const { en } = text;
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);

  const [allValues, setAllValues] = React.useState({
    noOfEmployementDetails: users?.nintydays_details.noOfEmployementDetails,

    selectedDate: users?.nintydays_details.selectedDate,
    imgfile: users?.nintydays_details.imgfile,
    documentName: users?.nintydays_details.documentName,
    openDatePicker: users?.nintydays_details.openDatePicker,
    employmentsList: users?.nintydays_details.employmentsList,
    issuerType: users?.nintydays_details.issuerType,

    presentDetailsGiven: users?.nintydays_details.presentDetailsGiven,
    presentDetailsGivenIndex: users?.nintydays_details.presentDetailsGivenIndex,

    inspectorName: users?.nintydays_details.inspectorName,
    inspectorCircle: users?.nintydays_details.inspectorCircle,
    inspectorPhone: users?.nintydays_details.inspectorPhone,

    unionName: users?.nintydays_details.unionName,
    unionRegistrationNumber: users?.nintydays_details.unionRegistrationNumber,
    unionIssuerName: users?.nintydays_details.unionIssuerName,
    unionPhone: users?.nintydays_details.unionPhone,

    issuerName: users?.nintydays_details.issuerName,
    issuerPlace: users?.nintydays_details.issuerPlace,
    issuerPhone: users?.nintydays_details.issuerPhone,
    issuerDesignation: users?.nintydays_details.issuerDesignation,

    employerDetails: [],
    states: [],
    district: [],
    taluk: [],
    city: [],
    village: [],
    natureOfWork: [],
    issuerTypes: [],
    issuedDate: users?.nintydays_details.dob,
    documentUploadResponse: users?.nintydays_details.documentUploadResponse,
    pinError: false,
    contractorNameError: false,
    contractorCompanyNameError: false,
    inchargePhoneNumberError: false,
    contractorNameError: false,
    contractorCompanyNameError: false,
    issuerPhoneError: false,
    pinError: false,
    mobileNumberInchargeError: false,
    mobileNumberInchargePersonError: false,
    issuerPlaceError: false,
    issuerDesignationError: false,
    issuerNameError: false,
  });

  const [loadingfiles, setloadingfiles] = React.useState(true);
  const [selectedfiles, setselectedfiles] = React.useState({});
  const [issuerGramName, setIssuerName] = React.useState(false);
  const [issuerGramPhone, setIssuerPhone] = React.useState(false);
  const [issuerGramPlace, setIssuerPlace] = React.useState(false);
  const [dropdownNotselected, setDropdownNotSelected] = React.useState(false);
  const [removedFile, setRemovedFile] = React.useState(false);
  const [issuedDate, setIssuedDate] = React.useState(
    users?.nintydays_details.dob,
  );
  const [validationErrors, setValidationErrors] = React.useState({});
  const [employmentIdCounter, setEmploymentIdCounter] = React.useState(1);
  const [getInspectorData, setInspectorData] = React.useState({
    name: '',
    circleId: '',
    mobile: '',
    department_user_id: '',
  });
  const [getInspectorUnionData, setInspectorUnionData] = React.useState({
    name: '',
  });
  const [getTradeUnionData, setTradeUnionData] = React.useState({});
  const [nintyDaysDetails, setNintyDaysEmploye] = React.useState([
    {
      id: uuidv4(),
      issuerType: '',
      employerDetails: '',
      contractorDeveloperName: '',
      workplaceSiteaddress: '',
      contractorCompanyName: '',
      inchargePhoneNumber: '',
      state: '',
      districtWorkplace: '',
      talukWorkplace: '',
      cityGram: '',
      villageWard: '',
      pincode: '',
      issueDate: '',
      natureWorkplace: '',
    },
  ]);

  const [getAllDistrict, setAllDistrict] = React.useState([]);
  const [getNatureWorkData, setNatureWork] = React.useState([]);
  const [getIssuerData, setIssuer] = React.useState([]);
  const [unionData, setUnionData] = React.useState([]);
  const [demographics, setDemographics] = React.useState({});
  const [loadings, setLoadings] = React.useState({
    issuerLoading: false,
    natureLoading: false,
    TalukLoading: false,
    districtLoading: false,
    cityLoading: false,
    villageLoading: false,
    unionLoading: false,
  });
  const [NintyDaysDoc, setNintyDaysDoc] = React.useState(null);
  const [employerFetchedDetails, setEmployerFetchedDetails] =
    React.useState(null);
  const [certificateFetchedDetails, setCertificateFetchedDetails] =
    React.useState(null);
  const [fetchedLoading, setFetchedLoading] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  const removefile = (index) => {
    setNintyDaysDoc([]);
    console.log('removefile index: ' + index);
    selectedfiles.splice(index, 1);
  };

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
      const payload = {
        board_id: 1,
        key: 'user_id',
        value: Cookies.get('id'),
        procedure_name: 'address_details',
      };
      const res = await dispatch(getUserRegistration(payload));
      if (res.payload[0].village_area_id) {
        const data = await dispatch(
          getInspectorDetails(res.payload[0].village_area_id),
        );
        if (data.payload[0]) {
          setInspectorData({
            name:
              data.payload[0].first_name +
              ' ' +
              data.payload[0].middle_name +
              ' ' +
              data.payload[0].last_name,
            circleId: data.payload[0].circle_id,
            mobile: data.payload[0].mobile_no,
            department_user_id: data.payload[0].department_user_id,
          });
        }
      }
      const resp = await dispatch(getUnionDetails());
      const extractedData = resp.payload.map((item) => ({
        labour_union_id: item.labour_union_id,
        name: item.name,
        registeration_no: item.registeration_no,
        phone_no: item.phone_no,
      }));
      setUnionData(extractedData);
    };
    data();
    handleEdit();
  }, []);

  const handleEdit = async () => {
    const details = {
      key: 'user_id',
      value: Cookies.get('id'),
      board_id: 1,
      procedure_name: 'all',
    };
    const response = await dispatch(reviewDetails(details));
    if (
      response.payload.data.employer_details?.length > 0 &&
      response.payload.data.certificate_details?.length > 0
    ) {
      const data = response.payload.data.employer_details;
      const data1 = response.payload.data.certificate_details;
      const doc1 = data1?.[0]?.document_uplaod_files_xml;
      setNintyDaysDoc(JSON.parse(doc1));
      setAllValues({
        issuerName: data1?.[0]?.issuer_name,
        issuerPlace: data1?.[0]?.issuer_place,
        issuerPhone: data1?.[0]?.mobile_no,
        issuerDesignation: data1?.[0]?.issuer_designation,
      });
      if (data1[0]?.catalog_value_type_of_issuer_id === 56) {
        //handleLabourChange([], data1?.[0]?.labour_union_name);
        const data = await unionData?.filter(
          (ev) => ev.name === data1?.[0]?.labour_union_name,
        );
        setTradeUnionData(data);
      }
      const editData = data?.map((details, index) => {
        return {
          issuerType: data1[0]?.catalog_value_type_of_issuer_id,
          issueDate: dayjs(data1[0]?.issue_date),
          employerDetails: details.catalog_value_employement_status_id,
          contractorDeveloperName: details.contractor_name,
          workplaceSiteaddress: details.site_address,
          contractorCompanyName: details.contractor_company_name,
          inchargePhoneNumber: details.mobile_no,
          state: details.state_id,
          districtWorkplace: details.district_id,
          talukWorkplace: details.taluk_id,
          cityGram: details.city_town_gram_panchayat_id,
          villageWard: details.village_area_id,
          pincode: details.pin_code,
          natureWorkplace: details.catalog_value_nature_of_work,
        };
      });
      setNintyDaysEmploye(editData);
      setEmployerFetchedDetails(response.payload.data.employer_details);
      console.log(nintyDaysDetails);
    }
    if (response.payload.data.certificate_details?.length > 0) {
      const data = response.payload.data.certificate_details;
      setCertificateFetchedDetails(data);
    }
  };

  const addNewEmploymentDetail = () => {
    if (nintyDaysDetails.length < 4) {
      setNintyDaysEmploye([
        ...nintyDaysDetails,
        {
          id: uuidv4(),
          employerDetails: '',
          contractorDeveloperName: '',
          workplaceSiteaddress: '',
          contractorCompanyName: '',
          inchargePhoneNumber: '',
          state: '',
          districtWorkplace: '',
          talukWorkplace: '',
          cityGram: '',
          villageWard: '',
          pincode: '',
          natureWorkplace: '',
        },
      ]);
    } else {
      toast.error('Reached to Maximum Limit!', {
        position: 'bottom-right',
        theme: 'colored',
        autoClose: 3000,
      });
    }
  };

  const nintyDayValidation = yup.object().shape({
    nintyDaysDetails: yup.array().of(
      yup.object().shape({
        employerDetails: yup
          .string()
          .trim()
          .required('*Employer Details is Required'),
        contractorDeveloperName: yup
          .string()
          .trim()
          .required('*Contractor Developer Name is Required'),
        workplaceSiteaddress: yup
          .string()
          .trim()
          .required('*Workplace Site Address is Required'),
        contractorCompanyName: yup
          .string()
          .trim()
          .required('*Contractor CompanyName is Required'),
        inchargePhoneNumber: yup
          .string()
          .trim()
          .required('*Incharge PhoneNumber is Required'),
        state: yup.string().trim().required('*State is Required'),
        districtWorkplace: yup
          .string()
          .trim()
          .required('*District Workplace is Required'),
        talukWorkplace: yup
          .string()
          .trim()
          .required('*Taluk Workplace is Required'),
        cityGram: yup.string().trim().required('*City Gram is Required'),
        villageWard: yup.string().trim().required('*VillageWard is Required'),
        pincode: yup.string().trim().required('*Pincode is Required'),
        natureWorkplace: yup
          .string()
          .trim()
          .required('*Nature Workplace is Required'),
      }),
    ),
  });

  const apiData = async (employers) => {
    const postData = {
      user_id: JSON.parse(Cookies.get('id')),
      board_id: 1,
      files: NintyDaysDoc && NintyDaysDoc,
      document_uploaded_id: NintyDaysDoc?.[0]?.file_id,
      issue_date: nintyDaysDetails?.[0].issueDate,
      catalog_value_type_of_issuer_id: nintyDaysDetails[0].issuerType,
      mobile_country_code: '+91',
      catalog_value_registration_status_id: 45,
      employers: employers,
      circle_id: getInspectorData?.circleId,
      labour_incpector_id: getInspectorData?.department_user_id,
      mobile_no:
        nintyDaysDetails[0].issuerType === 55
          ? getInspectorData?.mobile
          : nintyDaysDetails[0].issuerType === 56
            ? getTradeUnionData?.[0]?.phone_no
            : nintyDaysDetails[0].issuerType === 57
              ? allValues?.issuerPhone
              : allValues?.issuerPhone,
      issuer_place: allValues?.issuerPlace ? allValues?.issuerPlace : '',
      issuer_designation: allValues?.issuerDesignation
        ? allValues?.issuerDesignation
        : '',
      labour_union_id: getTradeUnionData?.[0]?.labour_union_id
        ? getTradeUnionData?.[0]?.labour_union_id
        : '',
      issuer_name:
        nintyDaysDetails[0].issuerType === 55
          ? getInspectorData?.name
          : nintyDaysDetails[0].issuerType === 56
            ? getInspectorUnionData?.name
            : nintyDaysDetails[0].issuerType === 57
              ? allValues.issuerName
              : allValues.issuerName,
    };

    if (employerFetchedDetails?.length > 0) {
      const response = await dispatch(updateNintyDaysDetails(postData));
      if (response.payload.success) {
        setFetchedLoading(false);
        toast.success(response.payload.message, {
          position: 'bottom-right',
          theme: 'colored',
          autoClose: 3000,
        });
        setRenderComponent(5);
      } else {
        setFetchedLoading(false);
        toast.error(`${response.payload.errors.msg}`, {
          position: 'bottom-right',
          theme: 'colored',
          autoClose: 1000,
        });
      }
    } else {
      const response = await dispatch(addNintyDaysDetails(postData));
      if (response.payload.success) {
        setFetchedLoading(false);
        toast.success(response.payload.message, {
          position: 'bottom-right',
          theme: 'colored',
          autoClose: 3000,
        });
        setRenderComponent(5);
      } else {
        setFetchedLoading(false);
        toast.error(`${response.payload.errors.msg}`, {
          position: 'bottom-right',
          theme: 'colored',
          autoClose: 1000,
        });
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setFetchedLoading(true);
    setOpenBackdrop(true);
    try {
      await nintyDayValidation.validate(
        { nintyDaysDetails },
        { abortEarly: false },
      );
      const employers = nintyDaysDetails.map((e, i) => ({
        catalog_value_employement_status_id: e.employerDetails,
        contractor_company_name: e.contractorCompanyName,
        contractor_name: e.contractorDeveloperName,
        mobile_country_code: '+91',
        mobile_no: e.inchargePhoneNumber,
        catalog_value_nature_of_work: e.natureWorkplace,
        state_id: e.state,
        site_address: e.workplaceSiteaddress,
        district_id: e.districtWorkplace,
        taluk_id: e.talukWorkplace,
        city_town_gram_panchayat_id: e.cityGram,
        village_area_id: e.villageWard,
        pin_code: e.pincode,
      }));
      apiData(employers);
    } catch (error) {
      setFetchedLoading(false);
      if (error instanceof yup.ValidationError) {
        const errors = {};
        error.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
        setValidationErrors(errors);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFetchedLoading(true);
    setOpenBackdrop(true);
    try {
      await nintyDayValidation.validate(
        { nintyDaysDetails },
        { abortEarly: false },
      );
      const employers = nintyDaysDetails.map((e, i) => ({
        catalog_value_employement_status_id: e.employerDetails,
        contractor_company_name: e.contractorCompanyName,
        contractor_name: e.contractorDeveloperName,
        mobile_country_code: '+91',
        mobile_no: e.inchargePhoneNumber,
        catalog_value_nature_of_work: e.natureWorkplace,
        state_id: e.state,
        site_address: e.workplaceSiteaddress,
        district_id: e.districtWorkplace,
        taluk_id: e.talukWorkplace,
        city_town_gram_panchayat_id: e.cityGram,
        village_area_id: e.villageWard,
        pin_code: e.pincode,
      }));
      apiData(employers);
    } catch (error) {
      setFetchedLoading(false);
      if (error instanceof yup.ValidationError) {
        const errors = {};
        error.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
        setValidationErrors(errors);
      }
    }
  };

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };

  const removeNintyDetails = (index) => {
    const updatedDetails = [...nintyDaysDetails];
    updatedDetails.splice(index, index);
    setNintyDaysEmploye(updatedDetails);
  };

  const handleChangeData = (e, index, fieldName) => {
    if (fieldName === 'issueDate') {
      const updatedEmploymentDetails = [...nintyDaysDetails];
      updatedEmploymentDetails[index] = {
        ...updatedEmploymentDetails[index],
        [fieldName]: dayjs(e.$d).format('YYYY-MM-DD'),
      };
      setNintyDaysEmploye(updatedEmploymentDetails);
    } else {
      const updatedEmploymentDetails = [...nintyDaysDetails];
      updatedEmploymentDetails[index] = {
        ...updatedEmploymentDetails[index],
        [fieldName]: e.target.value,
      };
      setNintyDaysEmploye(updatedEmploymentDetails);
    }
  };

  const handleChange = (event) => {
    console.log('eventSelected', event.target.name);
    if (event.target.name === 'nameOfContractor') {
      if (
        validator.isAlpha(event.target.value, 'en-US', { ignore: ' ' }) &&
        event.target.value.length !== 0 &&
        event.target.value.length < 30
      ) {
        setAllValues({
          ...allValues,
          contractorNameError: false,
          [event.target.name]: event.target.value,
        });
      } else {
        setAllValues({
          ...allValues,
          contractorNameError: true,
          [event.target.name]: event.target.value,
        });
      }
    } else if (event.target.name === 'issuerName') {
      if (event.target.value.length === 0) {
        setIssuerName(true);
      }

      if (
        validator.isAlpha(event.target.value, 'en-US', { ignore: ' ' }) &&
        event.target.value.length !== 0 &&
        event.target.value.length < 30
      ) {
        setAllValues({
          ...allValues,
          issuerNameError: false,
          [event.target.name]: event.target.value,
        });
        setIssuerName(false);
      } else {
        setAllValues({
          ...allValues,
          issuerNameError: true,
          [event.target.name]: event.target.value,
        });
      }
    } else if (event.target.name === 'issuerDesignation') {
      if (
        validator.isAlpha(event.target.value, 'en-US', { ignore: ' ' }) &&
        event.target.value.length !== 0 &&
        event.target.value.length < 30
      ) {
        setAllValues({
          ...allValues,
          issuerDesignationError: false,
          [event.target.name]: event.target.value,
        });
      } else {
        setAllValues({
          ...allValues,
          issuerDesignationError: true,
          [event.target.name]: event.target.value,
        });
      }
    } else if (event.target.name === 'issuerPlace') {
      if (event.target.value.length === 0) {
        setIssuerPlace(true);
      }

      if (
        validator.isAlpha(event.target.value, 'en-US', { ignore: ' ' }) &&
        event.target.value.length !== 0 &&
        event.target.value.length < 30
      ) {
        setAllValues({
          ...allValues,
          issuerPlaceError: false,
          [event.target.name]: event.target.value,
        });
        setIssuerPlace(false);
      } else {
        setAllValues({
          ...allValues,
          issuerPlaceError: true,
          [event.target.name]: event.target.value,
        });
      }
    } else if (event.target.name === 'contractorCompanyName') {
      if (
        validator.isAlpha(event.target.value, 'en-US', { ignore: ' ' }) &&
        event.target.value.length !== 0 &&
        event.target.value.length < 30
      ) {
        setAllValues({
          ...allValues,
          contractorCompanyNameError: false,
          [event.target.name]: event.target.value,
        });
      } else {
        setAllValues({
          ...allValues,
          contractorCompanyNameError: true,
          [event.target.name]: event.target.value,
        });
      }
    } else if (event.target.name === 'issuerPhone') {
      if (event.target.value.length === 0) {
        setIssuerPhone(true);
      }

      if (
        validator.isNumeric(event.target.value) &&
        event.target.value.length !== 0 &&
        event.target.value.length == 10
      ) {
        setAllValues({
          ...allValues,
          issuerPhoneError: false,
          [event.target.name]: event.target.value,
        });
        setIssuerPhone(false);
      } else {
        setAllValues({
          ...allValues,
          issuerPhoneError: true,
          [event.target.name]: event.target.value,
        });
      }
    } else if (event.target.name === 'mobileNumberIncharge') {
      if (
        validator.isNumeric(event.target.value) &&
        event.target.value.length !== 0 &&
        event.target.value.length == 10
      ) {
        setAllValues({
          ...allValues,
          mobileNumberInchargeError: false,
          [event.target.name]: event.target.value,
        });
      } else {
        setAllValues({
          ...allValues,
          mobileNumberInchargeError: true,
          [event.target.name]: event.target.value,
        });
      }
    } else if (event.target.name === 'mobileNumberIfAvailable') {
      if (
        validator.isNumeric(event.target.value) &&
        event.target.value.length !== 0 &&
        event.target.value.length == 10
      ) {
        setAllValues({
          ...allValues,
          mobileNumberInchargePersonError: false,
          [event.target.name]: event.target.value,
        });
      } else {
        setAllValues({
          ...allValues,
          mobileNumberInchargePersonError: true,
          [event.target.name]: event.target.value,
        });
      }
    } else if (event.target.name === 'pinCode') {
      if (
        validator.isNumeric(event.target.value) &&
        event.target.value.length !== 0 &&
        event.target.value.length === 6
      ) {
        setAllValues({
          ...allValues,

          [event.target.name]: event.target.value,
          pinError: false,
        });
      } else {
        setAllValues({
          ...allValues,

          [event.target.name]: event.target.value,
          pinError: true,
        });
      }
    } else {
      setAllValues({
        ...allValues,
        [event.target.name]: event.target.value,
      });
    }
  };

  const insertNintyDaysDetails = (nintyDaysFileAPI) => {
    const nintyDaysFile = [
      {
        file_id: nintyDaysFileAPI.fileId,
        file_name: nintyDaysFileAPI.originalFileName,
      },
    ];
    setNintyDaysDoc(nintyDaysFile);
  };

  const handleFileChange = async (event) => {
    console.log('event.target.files: ', event.target.files);
    console.log(event.target.files);

    setloadingfiles(true);

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
      console.log(joined);
      const nintyDaysFileAPI = await dispatch(
        uploadFileAPI(
          event.target.files[0],
          event.target.files[0].name,
          Cookies.get('id'),
          'nintyDaysFile',
        ),
      );
      insertNintyDaysDetails(nintyDaysFileAPI.payload.image);
    }

    setloadingfiles(false);
  };

  const getDistrict = async (index) => {
    setLoadings({
      ...loadings,
      districtLoading: true,
    });
    if (nintyDaysDetails?.[index].state) {
      try {
        const response = await dispatch(
          getDistrictDetails(
            nintyDaysDetails[index].state && nintyDaysDetails[index].state,
          ),
        );
        console.log(response);
        setAllDistrict(response.payload);
        setLoadings({
          ...loadings,
          districtLoading: false,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      setLoadings({
        ...loadings,
        districtLoading: false,
      });
    }
  };

  const getTaluk = async (index, id) => {
    console.log(nintyDaysDetails?.[index].districtWorkplace);
    setLoadings({
      ...loadings,
      TalukLoading: true,
    });
    if (nintyDaysDetails?.[index].districtWorkplace) {
      try {
        const response = await dispatch(
          getTalukDetails(
            nintyDaysDetails[index].districtWorkplace &&
              nintyDaysDetails[index].districtWorkplace,
          ),
        );
        let newDemographics = { ...demographics };
        if (!newDemographics[id]) {
          newDemographics[id] = {};
        }
        newDemographics[id]['taluka'] = response.payload;
        setDemographics(newDemographics);
        setLoadings({
          ...loadings,
          TalukLoading: false,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      setLoadings({
        ...loadings,
        TalukLoading: false,
      });
    }
  };

  const getCityName = async (index, id) => {
    console.log(nintyDaysDetails?.[index].talukWorkplace);
    setLoadings({
      ...loadings,
      cityLoading: true,
    });
    if (nintyDaysDetails?.[index].talukWorkplace) {
      try {
        const response = await dispatch(
          getCityNameDetails(
            nintyDaysDetails[index].talukWorkplace &&
              nintyDaysDetails[index].talukWorkplace,
          ),
        );
        let newDemographics = { ...demographics };
        if (!newDemographics[id]) {
          newDemographics[id] = {};
        }
        newDemographics[id]['city'] = response.payload;
        setDemographics(newDemographics);
        setLoadings({
          ...loadings,
          cityLoading: false,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      setLoadings({
        ...loadings,
        cityLoading: false,
      });
    }
  };
  const getVillageName = async (index, id) => {
    console.log(nintyDaysDetails?.[index].cityGram);
    setLoadings({
      ...loadings,
      villageLoading: true,
    });
    if (nintyDaysDetails?.[index].cityGram) {
      try {
        const response = await dispatch(
          getVillageNameDetails(
            nintyDaysDetails[index].cityGram &&
              nintyDaysDetails[index].cityGram,
          ),
        );
        let newDemographics = { ...demographics };
        if (!newDemographics[id]) {
          newDemographics[id] = {};
        }
        newDemographics[id]['village'] = response.payload;
        setDemographics(newDemographics);
        setLoadings({
          ...loadings,
          villageLoading: false,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      setLoadings({
        ...loadings,
        villageLoading: false,
      });
    }
  };

  const getNatureWork = async () => {
    setLoadings({
      ...loadings,
      natureLoading: true,
    });
    try {
      const response = await dispatch(getNatureWorkDetails());
      console.log(response);
      setNatureWork(response.payload);
      setLoadings({
        ...loadings,
        natureLoading: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getIssuer = async () => {
    setLoadings({
      ...loadings,
      issuerLoading: true,
    });
    try {
      const response = await dispatch(getIssuerDetails());
      console.log(response, '=====================res');
      setIssuer(response.payload);
      setLoadings({
        ...loadings,
        issuerLoading: false,
      });
      console.log(nintyDaysDetails[0].issuerType);
      if (response.payload) {
        const res = await dispatch(getUnionDetails());
        const extractedData = res.payload.map((item) => ({
          labour_union_id: item.labour_union_id,
          name: item.name,
          registeration_no: item.registeration_no,
          phone_no: item.phone_no,
        }));
        setUnionData(extractedData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const EmploymentDetailsComponent = (
    <div>
      <img alt="..." src={close} className="closebtn" />

      {nintyDaysDetails.map((details, index) => (
        <Row className={'form-row employer-card row'} key={index}>
          {nintyDaysDetails.length > 1 && index !== 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'end',
              }}
            >
              <CancelIcon
                onClick={() => removeNintyDetails(index)}
                className="mt-2"
                style={{
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                  color: '9B1D03',
                }}
              />
            </div>
          )}
          <Col xs={12} md={6}>
            <Required className="mt-3 mb-2" title={en.employerDetails} />
            <FormControl variant="outlined" fullWidth className="formcontrol5">
              <Select
                className="select-marital"
                name={`employerDetails-${index}`}
                onChange={(e) => handleChangeData(e, index, 'employerDetails')}
                value={details.employerDetails}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  <ListItemText primary="--Select--" />
                </MenuItem>
                <MenuItem value={25}>
                  <ListItemText primary={`Present`} />
                </MenuItem>
                <MenuItem value={26}>
                  <ListItemText primary={`Previous`} />
                </MenuItem>
              </Select>
            </FormControl>
            {validationErrors[`nintyDaysDetails[${index}].employerDetails`] && (
              <span className="text-danger">
                {validationErrors[`nintyDaysDetails[${index}].employerDetails`]}
              </span>
            )}
          </Col>

          <Col xs={12} md={6}>
            <Required
              className="mt-3 mb-2"
              title={en.nameofContractorDeveloper}
            />
            <FormControl fullWidth className="formcontrol1">
              <TextField
                variant="outlined"
                placeholder="Enter Your Employer/Owner Name"
                name="contractorDeveloperName"
                value={details.contractorDeveloperName}
                onChange={(e) => {
                  handleChangeData(e, index, 'contractorDeveloperName');
                }}
              />
            </FormControl>
            {validationErrors[
              `nintyDaysDetails[${index}].contractorDeveloperName`
            ] && (
              <span className="text-danger">
                {
                  validationErrors[
                    `nintyDaysDetails[${index}].contractorDeveloperName`
                  ]
                }
              </span>
            )}
          </Col>

          <Col xs={12} md={6}>
            <Required className="mt-3 mb-2" title={en.workplaceSiteAddress} />
            <FormControl fullWidth className="formcontrol1">
              <TextareaAutosize
                variant="outlined"
                multiline
                minRows={1}
                maxRows={4}
                placeholder="Enter Your Workplace/Site Address"
                name="workplaceSiteaddress"
                style={{ height: '46px' }}
                onChange={(e) => {
                  handleChangeData(e, index, 'workplaceSiteaddress');
                }}
                value={details.workplaceSiteaddress}
              />
            </FormControl>
            {validationErrors[
              `nintyDaysDetails[${index}].workplaceSiteaddress`
            ] && (
              <span className="text-danger">
                {
                  validationErrors[
                    `nintyDaysDetails[${index}].workplaceSiteaddress`
                  ]
                }
              </span>
            )}
          </Col>

          <Col xs={12} md={6}>
            <Required className="mt-3 mb-2" title={en.contractorCompanyName} />
            <FormControl fullWidth className="formcontrol1">
              <TextField
                variant="outlined"
                placeholder="Enter Employer/Owner Company Name"
                name="contractorCompanyName"
                onChange={(e) => {
                  handleChangeData(e, index, 'contractorCompanyName');
                }}
                value={details.contractorCompanyName}
              />
            </FormControl>
            {validationErrors[
              `nintyDaysDetails[${index}].contractorCompanyName`
            ] && (
              <span className="text-danger">
                {
                  validationErrors[
                    `nintyDaysDetails[${index}].contractorCompanyName`
                  ]
                }
              </span>
            )}
          </Col>

          <Col xs={12} md={6}>
            <Required
              className="mt-3 mb-2"
              title={en.mobileNumberInchargePerson}
            />
            <FormControl fullWidth>
              <TextField
                variant="outlined"
                placeholder="987xxxxxxx"
                name="inchargePhoneNumber"
                inputProps={{ maxLength: 10 }}
                type="text"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img src={mobile} alt="..." className="phone-icon" />
                      <p className="countrycode">+91</p>
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (/^\d*$/.test(inputValue) && inputValue.length <= 10) {
                    handleChangeData(e, index, 'inchargePhoneNumber');
                  }
                }}
                value={details.inchargePhoneNumber}
                error={allValues?.issuerPhoneError}
              />
            </FormControl>
            {validationErrors[
              `nintyDaysDetails[${index}].inchargePhoneNumber`
            ] && (
              <span className="text-danger">
                {
                  validationErrors[
                    `nintyDaysDetails[${index}].inchargePhoneNumber`
                  ]
                }
              </span>
            )}
          </Col>

          {/* state */}
          <Col xs={12} md={6}>
            <Required className="mt-3 mb-2" title={en.state} />
            <FormControl variant="outlined" fullWidth className="formcontrol5">
              <Select
                className="select-marital"
                name="state"
                onChange={(e) => {
                  handleChangeData(e, index, 'state');
                }}
                value={details.state}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  <ListItemText primary="--Select--" />
                </MenuItem>
                <MenuItem value={12}>
                  <ListItemText primary={`KA | Karnataka`} />
                </MenuItem>
              </Select>
            </FormControl>
            {validationErrors[`nintyDaysDetails[${index}].state`] && (
              <span className="text-danger">
                {validationErrors[`nintyDaysDetails[${index}].state`]}
              </span>
            )}
          </Col>

          {/* District  */}
          <Col xs={12} md={6}>
            <Required
              className="mt-3 mb-2"
              title={en.selectYourDistrictoftheWorkplace}
            />
            <FormControl variant="outlined" fullWidth className="formcontrol5">
              <Select
                className="select-marital"
                name="districtWorkplace"
                displayEmpty
                sx={{ color: 'red' }}
                onChange={(e) => {
                  handleChangeData(e, index, 'districtWorkplace');
                }}
                defaultValue={
                  details?.districtWorkplace == ''
                    ? '--Select--'
                    : details?.districtWorkplace
                }
                value={
                  details?.districtWorkplace
                    ? details?.districtWorkplace
                    : '--Select--'
                }
                onOpen={() => getDistrict(index)}
              >
                <MenuItem value={details?.districtWorkplace || '--Select--'}>
                  <ListItemText
                    primary={
                      employerFetchedDetails?.[index]?.district ||
                      (loadings.districtLoading ? 'Loading...' : '--Select--')
                    }
                  />
                </MenuItem>
                {getAllDistrict.map((district) => (
                  <MenuItem value={district.id} key={district.id}>
                    <ListItemText primary={district.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {validationErrors[
              `nintyDaysDetails[${index}].districtWorkplace`
            ] && (
              <span className="text-danger">
                {
                  validationErrors[
                    `nintyDaysDetails[${index}].districtWorkplace`
                  ]
                }
              </span>
            )}
          </Col>

          {/* Taluk */}
          <Col xs={12} md={6}>
            <Required className="mt-3 mb-2" title={en.talukoftheWorkplace} />
            <FormControl variant="outlined" fullWidth className="formcontrol5">
              <Select
                className="select-marital"
                name="talukWorkplace"
                displayEmpty
                onChange={(e) => {
                  handleChangeData(e, index, 'talukWorkplace');
                }}
                defaultValue={
                  details?.talukWorkplace == ''
                    ? '--Select--'
                    : details?.talukWorkplace
                }
                value={
                  details?.talukWorkplace
                    ? details?.talukWorkplace
                    : '--Select--'
                }
                onOpen={() => getTaluk(index, details.id)}
              >
                <MenuItem value={details?.talukWorkplace || '--Select--'}>
                  <ListItemText
                    primary={
                      employerFetchedDetails?.[index]?.taluk ||
                      (loadings.TalukLoading ? 'Loading...' : '--Select--')
                    }
                  />
                </MenuItem>
                {demographics[details?.id]?.taluka?.map((getTalukdata) => (
                  <MenuItem key={`${getTalukdata.id}`} value={getTalukdata.id}>
                    <ListItemText primary={getTalukdata.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {validationErrors[`nintyDaysDetails[${index}].talukWorkplace`] && (
              <span className="text-danger">
                {validationErrors[`nintyDaysDetails[${index}].talukWorkplace`]}
              </span>
            )}
          </Col>

          {/* city */}
          <Col xs={12} md={6}>
            <Required className="mt-3 mb-2" title={en.townCityGramPanchayat} />
            <FormControl variant="outlined" fullWidth className="formcontrol1">
              <Select
                className="select-marital"
                name="cityGram"
                displayEmpty
                onChange={(e) => {
                  handleChangeData(e, index, 'cityGram');
                }}
                // value={details.cityGram}
                defaultValue={
                  details?.cityGram == '' ? '--Select--' : details?.cityGram
                }
                value={details?.cityGram ? details?.cityGram : '--Select--'}
                onOpen={() => getCityName(index, details.id)}
              >
                <MenuItem value={details?.cityGram || '--Select--'}>
                  <ListItemText
                    primary={
                      employerFetchedDetails?.[index]?.panhayat_city_town ||
                      (loadings.cityLoading ? 'Loading...' : '--Select--')
                    }
                  />
                </MenuItem>
                {demographics[details?.id]?.city?.map((cityName) => (
                  <MenuItem key={cityName.id} value={cityName.id}>
                    <ListItemText primary={cityName.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {validationErrors[`nintyDaysDetails[${index}].cityGram`] && (
              <span className="text-danger">
                {validationErrors[`nintyDaysDetails[${index}].cityGram`]}
              </span>
            )}
          </Col>

          {/* village */}
          <Col xs={12} md={6}>
            <Required className="mt-3 mb-2" title={en.villageWardCircle} />
            <FormControl variant="outlined" fullWidth className="formcontrol1">
              <Select
                className="select-marital"
                name="villageWard"
                displayEmpty
                onChange={(e) => {
                  handleChangeData(e, index, 'villageWard');
                }}
                // value={details.villageWard}
                defaultValue={
                  details?.villageWard == ''
                    ? '--Select--'
                    : details?.villageWard
                }
                value={
                  details?.villageWard ? details?.villageWard : '--Select--'
                }
                onOpen={() => getVillageName(index, details.id)}
              >
                <MenuItem value={details?.villageWard || '--Select--'}>
                  <ListItemText
                    primary={
                      employerFetchedDetails?.[index]?.ward_area_village ||
                      (loadings.villageLoading ? 'Loading...' : '--Select--')
                    }
                  />
                </MenuItem>
                {demographics[details?.id]?.village?.map((village, index) => (
                  <MenuItem key={`${village.id}`} value={village.id}>
                    <ListItemText primary={village.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {validationErrors[`nintyDaysDetails[${index}].villageWard`] && (
              <span className="text-danger">
                {validationErrors[`nintyDaysDetails[${index}].villageWard`]}
              </span>
            )}
          </Col>

          <Col xs={12} md={6}>
            <Required className="mt-3 mb-2" title={en.pincode} />
            <FormControl fullWidth className="formcontrol1">
              <TextField
                variant="outlined"
                placeholder="Enter Your Pincode"
                name="pincode"
                type="text"
                inputProps={{ maxLength: 6 }}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (/^\d*$/.test(inputValue) && inputValue.length <= 10) {
                    handleChangeData(e, index, 'pincode');
                  }
                }}
                value={details.pincode}
              />
            </FormControl>
            {validationErrors[`nintyDaysDetails[${index}].pincode`] && (
              <span className="text-danger">
                {validationErrors[`nintyDaysDetails[${index}].pincode`]}
              </span>
            )}
          </Col>

          {/* nature */}
          <Col xs={12} md={6}>
            <Required className="mt-3 mb-2" title={en.natureoftheWorkplace} />
            <FormControl variant="outlined" fullWidth className="formcontrol5">
              <Select
                className="select-marital"
                name="natureWorkplace"
                displayEmpty
                onChange={(e) => {
                  handleChangeData(e, index, 'natureWorkplace');
                }}
                // value={details.natureWorkplace}
                defaultValue={
                  details?.natureWorkplace == ''
                    ? '--Select--'
                    : details?.natureWorkplace
                }
                value={
                  details?.natureWorkplace
                    ? details?.natureWorkplace
                    : '--Select--'
                }
                onOpen={getNatureWork}
              >
                <MenuItem value={details?.natureWorkplace || '--Select--'}>
                  <ListItemText
                    primary={
                      employerFetchedDetails?.[index]?.nature_of_work ||
                      (loadings.natureLoading ? 'Loading...' : '--Select--')
                    }
                  />
                </MenuItem>
                {getNatureWorkData.length > 0 &&
                  getNatureWorkData.map((data, index) => (
                    <MenuItem
                      key={`${data.value_id}-${index}`}
                      value={data.value_id}
                    >
                      <ListItemText primary={data.value} />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            {validationErrors[`nintyDaysDetails[${index}].natureWorkplace`] && (
              <span className="text-danger">
                {validationErrors[`nintyDaysDetails[${index}].natureWorkplace`]}
              </span>
            )}
          </Col>
        </Row>
      ))}
    </div>
  );

  const LabourInspectorForm = () => {
    if (getInspectorData?.name === '') {
      const data = async () => {
        const payload = {
          board_id: 1,
          key: 'user_id',
          value: Cookies.get('id'),
          procedure_name: 'address_details',
        };
        const res = await dispatch(getUserRegistration(payload));
        if (res.payload[0].village_area_id) {
          const data = await dispatch(
            getInspectorDetails(res.payload[0].village_area_id),
          );
          if (data.payload[0]) {
            setInspectorData({
              name:
                data.payload[0].first_name +
                ' ' +
                data.payload[0].middle_name +
                ' ' +
                data.payload[0].last_name,
              circleId: data.payload[0].circle_id,
              mobile: data.payload[0].mobile_no,
              department_user_id: data.payload[0].department_user_id,
            });
          }
          console.log(data.payload, 'hujgyfhtdgxdg');
        }
        console.log(
          res.payload[0].village_area_id,
          'ers===============================',
        );
      };
      data();
    }

    return (
      <div>
        <div>
          <Col xs={12} md={6} className="issuerTypeForm">
            <p className="mt-5 mb-2">{en.labourInspectorName}</p>
            <FormControl fullWidth>
              <TextField
                name="inspectorName"
                value={getInspectorData?.name}
                disabled
              />
            </FormControl>

            <p className="mt-4 mb-2">{en.circleoftheLabourInspector}</p>
            <FormControl fullWidth>
              <TextField
                name="inspectorCircle"
                value={getInspectorData?.circleId}
                disabled
              />
            </FormControl>

            <p className="mt-4 mb-2">{en.mobileNumberoftheLabourInspector}</p>
            <FormControl fullWidth>
              <TextField
                name="inspectorPhone"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img src={mobile} alt="..." className="phone-icon" />
                      <p className="countrycode">+91</p>
                    </InputAdornment>
                  ),
                }}
                value={getInspectorData?.mobile}
                disabled
              />
            </FormControl>
          </Col>
        </div>
      </div>
    );
  };

  const [handleLabourUnion, setHandleLabourUnion] = useState('');

  const handleLabourChange = (event, newValue) => {
    console.log('546851');
    setHandleLabourUnion(newValue);
    console.log(newValue, 'ijhujgv');
    const data = unionData.filter((ev) => ev.name === newValue.name);
    setTradeUnionData(data);
  };

  const LabourUnionForm = () => {
    if (getInspectorUnionData?.name === '') {
      const data = async () => {
        const payload = {
          board_id: 1,
          key: 'user_id',
          value: Cookies.get('id'),
          procedure_name: 'address_details',
        };
        const res = await dispatch(getUserRegistration(payload));
        if (res.payload[0].village_area_id) {
          const data = await dispatch(
            getInspectorDetails(res.payload[0].village_area_id),
          );
          if (data.payload[0]) {
            setInspectorUnionData({
              name:
                data.payload[0].first_name +
                ' ' +
                data.payload[0].middle_name +
                ' ' +
                data.payload[0].last_name,
            });
          }
          console.log(data.payload, 'hujgyfhtdgxdg');
        }
        console.log(
          res.payload[0].village_area_id,
          'ers===============================',
        );
      };
      data();
    }
    return (
      <>
        <Col xs={12} md={6} className="issuerTypeForm">
          <p className="mt-5 mb-2">{en.unionName}</p>

          <FormControl
            variant="outlined"
            fullWidth="true"
            className="formcontrol5"
          >
            <Autocomplete
              className="select-marital"
              value={handleLabourUnion}
              onChange={(event, newValue) =>
                handleLabourChange(event, newValue)
              }
              options={unionData || []}
              getOptionLabel={(option) => option.name || ''}
              getOptionSelected={(option, value) =>
                option.labour_union_id === value.labour_union_id
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={!handleLabourUnion && 'Select'}
                  placeholder="Search"
                />
              )}
              key={(option) => option.labour_union_id}
            />
          </FormControl>

          <p className="mt-4 mb-2">{en.unionRegistrationNumber}</p>
          <FormControl fullWidth>
            <TextField
              name="unionRegistrationNumber"
              value={getTradeUnionData?.[0]?.registeration_no}
              disabled
            />
          </FormControl>

          <p className="mt-4 mb-2">{en.nameofIssuer}</p>
          <FormControl fullWidth>
            <TextField
              name="unionIssuerName"
              value={getInspectorUnionData?.name}
              disabled
            />
          </FormControl>

          <p className="mt-4 mb-2">{en.mobileNumberIfAvailable}</p>
          <FormControl fullWidth>
            <TextField
              name="unionPhone"
              // onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img src={mobile} alt="..." className="phone-icon" />
                    <p className="countrycode">+91</p>
                  </InputAdornment>
                ),
              }}
              value={getTradeUnionData?.[0]?.phone_no}
              disabled
            />
          </FormControl>
        </Col>
      </>
    );
  };

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
        <form onSubmit={handleSubmit}>
          <ToastContainer />
          <Row className="m-0">
            <Row className="family-title-row">
              <Col
                xs={12}
                className="profile-title"
                style={{ marginBottom: '-20px' }}
              >
                <h1>{en.nintyDays}</h1>
              </Col>
            </Row>
            <Row className="family-title-row">
              <Col xs={12} className="family-col-4">
                {EmploymentDetailsComponent}
              </Col>
            </Row>
            <Row className="form-row">
              <Col
                xs={12}
                className="addMemberCol mt-4 "
                onClick={() => addNewEmploymentDetail()}
              >
                <AddCircleRounded />
                <p>{en.addMoreEmplymentDetails}</p>
              </Col>

              <Col xs={12} className="note2 text-center mt-5 personal-col-7">
                <p>
                  <span>{en.note} </span>
                  {
                    en.afterthecompletionofthemandatoryfieldsinPersonalDetailsthenonlythesystemwillallowthefurtherprocess2
                  }
                </p>
              </Col>
            </Row>

            <div>
              <Row className="nintydays-cert-title-row">
                <Col xs={12} className="profile-title">
                  <h1 style={{ color: '#ca0027' }}>
                    {en.daysWorkCertificateDetails}
                  </h1>
                </Col>
              </Row>

              {/* type of issuer  */}
              <Row className="form-row ninydays-row">
                <Col xs={12} className="nintydays-col-5">
                  <Row className="form-inner-card-plain">
                    <Col xs={12} md={6}>
                      <Required className="mt-2 mb-2" title={en.typeofIssuer} />
                      <FormControl variant="outlined" fullWidth>
                        <Select
                          className="select-marital"
                          name="issuerType"
                          displayEmpty
                          onChange={(e) => handleChangeData(e, 0, 'issuerType')}
                          // value={nintyDaysDetails[0].issuerType}
                          defaultValue={
                            nintyDaysDetails?.[0]?.issuerType == ''
                              ? '--Select--'
                              : nintyDaysDetails?.[0]?.issuerType
                          }
                          value={
                            nintyDaysDetails?.[0]?.issuerType
                              ? nintyDaysDetails?.[0]?.issuerType
                              : '--Select--'
                          }
                          onOpen={getIssuer}
                        >
                          <MenuItem
                            value={
                              nintyDaysDetails?.[0]?.issuerType || '--Select--'
                            }
                          >
                            <ListItemText
                              primary={
                                certificateFetchedDetails?.[0]?.issuer_type ||
                                (loadings.issuerLoading
                                  ? 'Loading...'
                                  : '--Select--')
                              }
                            />
                          </MenuItem>
                          {getIssuerData?.length > 0 &&
                            getIssuerData?.map((data, index) => (
                              <MenuItem
                                key={`${data.value_id}-${index}`}
                                value={data.value_id}
                              >
                                <ListItemText primary={data.value} />
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                      {validationErrors[
                        `nintyDaysDetails[${0}].issuerType`
                      ] && (
                        <span className="text-danger">
                          {
                            validationErrors[
                              `nintyDaysDetails[${0}].issuerType`
                            ]
                          }
                        </span>
                      )}
                    </Col>

                    <Col xs={12} md={6}>
                      <Required className="mt-2 mb-2" title={en.issuedDate} />
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                          <DatePicker
                            name="issueDate"
                            className="datepicker"
                            format="DD-MM-YYYY"
                            value={dayjs(nintyDaysDetails?.[0]?.issueDate)}
                            onChange={(e) =>
                              handleChangeData(e, 0, 'issueDate')
                            }
                          />
                        </DemoContainer>
                        {validationErrors[
                          `nintyDaysDetails[${0}].issueDate`
                        ] && (
                          <span className="text-danger">
                            {
                              validationErrors[
                                `nintyDaysDetails[${0}].issueDate`
                              ]
                            }
                          </span>
                        )}
                      </LocalizationProvider>
                    </Col>
                    {
                      {
                        55: <LabourInspectorForm />,
                        56: <LabourUnionForm />,
                        57: (
                          <Col xs={12} md={6} className="issuerTypeForm">
                            <p className="mt-4 mb-2">{en.nameofIssuer}</p>
                            <FormControl fullWidth>
                              <TextField
                                placeholder="Enter Issuer Name"
                                name="issuerName"
                                onChange={(e) => {
                                  handleChange(e);
                                }}
                                value={allValues?.issuerName}
                                helperText={
                                  allValues?.issuerNameError
                                    ? 'Please enter in correct format'
                                    : ''
                                }
                                error={allValues?.issuerNameError}
                              />
                            </FormControl>

                            <p className="mt-4 mb-2">{en.placeofIssuer}</p>
                            <FormControl fullWidth>
                              <TextField
                                placeholder="Enter Place of Issuer"
                                name="issuerPlace"
                                onChange={handleChange}
                                value={allValues?.issuerPlace}
                                helperText={
                                  allValues?.issuerPlaceError
                                    ? 'Please enter in correct format'
                                    : ''
                                }
                                error={allValues?.issuerPlaceError}
                              />
                            </FormControl>

                            <p className="mt-4 mb-2">
                              {en.mobileNumberIfAvailable}
                            </p>
                            <FormControl fullWidth>
                              <TextField
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <img
                                        src={mobile}
                                        alt="..."
                                        className="phone-icon"
                                      />
                                      <p className="countrycode">+91</p>
                                    </InputAdornment>
                                  ),
                                }}
                                placeholder="Enter Mobile Number of Issuer"
                                name="issuerPhone"
                                inputProps={{ maxLength: 10 }}
                                type="text"
                                onChange={(event) => {
                                  const inputValue = event.target.value;
                                  if (
                                    /^\d*$/.test(inputValue) &&
                                    inputValue.length <= 10
                                  ) {
                                    handleChange(event);
                                  }
                                }}
                                value={allValues?.issuerPhone}
                                helperText={
                                  allValues?.issuerPhoneError
                                    ? 'Please enter in correct format'
                                    : ''
                                }
                                error={allValues?.issuerPhoneError}
                              />
                            </FormControl>
                          </Col>
                        ),
                        58: (
                          <Col xs={12} md={6} className="issuerTypeForm">
                            <p className="mt-4 mb-2">{en.nameofIssuer}</p>
                            <FormControl fullWidth>
                              <TextField
                                placeholder="Enter Name of Issuer"
                                name="issuerName"
                                onChange={handleChange}
                                value={allValues?.issuerName}
                                helperText={
                                  allValues.issuerNameError
                                    ? 'Please enter in correct format'
                                    : ''
                                }
                                error={allValues.issuerNameError}
                              />
                            </FormControl>

                            <p className="mt-4 mb-2">
                              {en.designationofIssuer}
                            </p>
                            <FormControl fullWidth>
                              <TextField
                                placeholder="Enter Designation of Issuer"
                                name="issuerDesignation"
                                type="text"
                                onChange={handleChange}
                                value={allValues?.issuerDesignation}
                                helperText={
                                  allValues.issuerDesignationError
                                    ? 'Please enter in correct format'
                                    : ''
                                }
                                error={allValues.issuerDesignationError}
                              />
                            </FormControl>

                            <p className="mt-4 mb-2">
                              {en.mobileNumberIfAvailable}
                            </p>
                            <FormControl fullWidth>
                              <TextField
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <img
                                        src={mobile}
                                        alt="..."
                                        className="phone-icon"
                                      />
                                      <p className="countrycode">+91</p>
                                    </InputAdornment>
                                  ),
                                }}
                                placeholder="Enter Mobile Number of Issuer"
                                name="issuerPhone"
                                onChange={(event) => {
                                  const inputValue = event.target.value;
                                  if (
                                    /^\d*$/.test(inputValue) &&
                                    inputValue.length <= 10
                                  ) {
                                    handleChange(event);
                                  }
                                }}
                                inputProps={{ maxLength: 10 }}
                                type="text"
                                value={allValues?.issuerPhone}
                                helperText={
                                  allValues?.issuerPhoneError
                                    ? 'Please enter in correct format'
                                    : ''
                                }
                                error={allValues?.issuerPhoneError}
                              />
                            </FormControl>
                          </Col>
                        ),
                      }[nintyDaysDetails[0].issuerType]
                    }
                  </Row>
                </Col>

                <Col xs={12} className="nintydays-col-6">
                  <Required
                    className="mt-3 mb-2"
                    title={en.uploadYourDaysWorkingCertificate}
                  />
                  <div className="browsebutton-outerdiv">
                    <div className="browsebutton2-div filesNames">
                      {NintyDaysDoc !== null &&
                        NintyDaysDoc.length > 0 &&
                        NintyDaysDoc?.map((i, index) => (
                          <FormControl key={index}>
                            <TextField
                              variant="outlined"
                              name="passbookDocumentName"
                              onChange={handleChange}
                              value={i.file_name}
                              disabled
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="start">
                                    <img
                                      alt="..."
                                      src={closeicon}
                                      className="removefilebtn"
                                      onClick={() => removefile(index)}
                                    />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </FormControl>
                        ))}
                    </div>
                    <div className="browsebutton2-div">
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
                          NintyDaysDoc?.[0]?.file_name
                            ? NintyDaysDoc?.[0]?.file_name
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
            </div>

            <Row className="button-inside-form-row mb-5">
              <Col xs={12} className="next-back-button-row mt-4 ">
                {!employerFetchedDetails?.length > 0 ? (
                  <>
                    <Button
                      variant="danger"
                      className="back-button"
                      onClick={() => setRenderComponent(3)}
                    >
                      {en.back}
                    </Button>
                    <Button
                      variant="outline-primary"
                      className="next-button"
                      onClick={handleSubmit}
                    >
                      {en.saveandContinue}
                    </Button>
                  </>
                ) : (
                  <div>
                    <Button
                      variant="outline-primary"
                      className="next-button"
                      onClick={handleUpdate}
                    >
                      {en.saveyourDetails}
                    </Button>
                  </div>
                )}
              </Col>
            </Row>
          </Row>
        </form>
      </Row>
    </div>
  );
};

export default NintyDays;
