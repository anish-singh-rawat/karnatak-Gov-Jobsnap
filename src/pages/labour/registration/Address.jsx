import {
  FormControl,
  TextField,
  Select,
  MenuItem,
  FormHelperText,
  ListItemText,
  CircularProgress,
  makeStyles,
  Backdrop,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Required } from '../../../utils/tools';
import { useDispatch, useSelector } from 'react-redux';
import translationsText from '../../../../src/translations';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validationSchema from './ValidationSchema';
import { getCatalogDetails } from '../../../features/personalDetails/catalogSlice';
import { getDistrictDetails } from '../../../features/OptionsSlice/districtSlice';
import { getTalukDetails } from '../../../features/OptionsSlice/talukSlice';
import { getCityDetails } from '../../../features/OptionsSlice/citySlice';
import { getVillageDetails } from '../../../features/OptionsSlice/villageSlice';
import { addLabourAddress } from '../../../features/Address-details/AddressSlice';
import { GetResidetialAddressDetails } from '../../../features/Address-details/getResidentialAdress';
import { UpdateResidentialAddressDetails } from '../../../features/Address-details/UpdateResidentialAddress';

const Address = ({ setRenderComponent }) => {
  const dispatch = useDispatch();
  const { en } = translationsText;
  const users = useSelector((state) => state.users);
  const [residence, setResidence] = useState([]);
  const [getAllDistrict, setAllDistrict] = useState([]);
  const [getTalukdata, setTalukData] = useState([]);
  const [getCityNameData, setCityName] = useState([]);
  const [getVillageNameData, setVillageName] = useState([]);
  const [edit, setEdit] = useState(false);
  const [fetchedLoading, setFetchedLoading] = useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [apiCalling, setApiCalling] = useState({
    Residence: 0,
    District: 0,
    Taluk: 0,
    City: 0,
    Village: 0,
  });

  const [loadings, setLoadings] = useState({
    ResidenceLoading: false,
    stateLoading: false,
    TalukLoading: false,
    districtLoading: false,
    cityLoading: false,
    villageLoading: false,
    submitLoading: false,
    getDetailsLoading: false,
    updateDetailsLoading: false,
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

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };

  const formik = useFormik({
    initialValues: {
      state: '',
      district: '',
      taluk: '',
      CityName: '',
      VillageName: '',
      StreetName: '',
      HouseBuildingNumber: '',
      Landmark: '',
      Pincode: '',
      Residence: '',
      residence_state: '',
      residence_district: '',
      residence_taluk: '',
      residence_CityName: '',
      residence_VillageName: '',
      residence_StreetName: '',
      residence_HouseBuildingNumber: '',
      residence_Landmark: '',
      residence_Pincode: '',

      ResidenceString: '',
      residence_stateString: '',
      residence_districtString: '',
      residence_talukString: '',
      residence_CityNameString: '',
      residence_VillageNameString: '',
      address_type_id: '',
    },
    validationSchema: validationSchema,
    validateOnMount: false,
    onSubmit: async (values) => {
      try {
        if (edit) {
          setFetchedLoading(true);
          setOpenBackdrop(true);
          setLoadings({
            ...loadings,
            updateDetailsLoading: true,
          });
          const addressPayload = {
            user_id: parseInt(Cookies.get('id')),
            addresses: [
              {
                user_id: parseInt(Cookies.get('id')),
                address_base_type_id: 10,
                address_type_id: values.Residence,
                door_no: values.residence_HouseBuildingNumber,
                street_name: values.residence_StreetName,
                village_area_id: values.residence_VillageName,
                city_town_gram_panchayat_id: values.residence_CityName,
                taluk_id: values.residence_taluk,
                district_id: values.residence_district,
                state_id: values.residence_state,
                land_mark: values.residence_Landmark,
                pin_code: values.residence_Pincode,
              },
            ],
          };
          console.log(addressPayload);
          const { payload } = await dispatch(addLabourAddress(addressPayload));
          if (payload.success) {
            toast.success('User Address Update successfully');
            setFetchedLoading(false);
            setRenderComponent(5);
          } else {
            setFetchedLoading(false);
            toast.error('Some Error occured please try after some time');
          }
          setLoadings({
            ...loadings,
            updateDetailsLoading: false,
          });
          return;
        }
        setFetchedLoading(true);
        setOpenBackdrop(true);
        setLoadings({
          ...loadings,
          submitLoading: true,
        });
        const payload = {
          user_id: Cookies.get('id'),
          addresses: [
            {
              address_base_type_id: 10,
              address_type_id: values.Residence,
              door_no: values.residence_HouseBuildingNumber,
              street_name: values.residence_StreetName,
              village_area_id: values.residence_VillageName,
              city_town_gram_panchayat_id: values.residence_CityName,
              taluk_id: values.residence_taluk,
              district_id: values.residence_district,
              state_id: values.residence_state,
              land_mark: values.residence_Landmark,
              pin_code: values.residence_Pincode,
            },
          ],
        };

        try {
          const res = await dispatch(addLabourAddress(payload));
          console.log(res, 'res');
          if (res.payload.success) {
            setFetchedLoading(false)
            setLoadings({
              ...loadings,
              submitLoading: false,
            });
            toast.success('User Address Successfully Added !');
            setRenderComponent(2);
          } else {
            setFetchedLoading(false)
            toast.error('Please Provide valid data');
          }
        } catch (error) {
          setFetchedLoading(false)
          console.log(error);
        }
      } catch (error) {
        setFetchedLoading(false)
        console.log(error);
      }
    },
  });

  const Residence = async () => {
    setLoadings({
      ...loadings,
      ResidenceLoading: true,
    });
    const payload = {
      board_id: 1,
      catalog_name: 'Type of Residence',
    };
    try {
      if (apiCalling.Residence == 0) {
        const response = await dispatch(getCatalogDetails(payload));
        if (response.payload.success) {
          setResidence(response.payload.data);
          setApiCalling({
            ...apiCalling,
            Residence: 1,
          });
        }
      }
      setLoadings({
        ...loadings,
        ResidenceLoading: false,
      });

      return response.data;
    } catch (error) {
      console.log(error, 'somthing wentr wrong');
    }
  };

  const getDistrict = async () => {
    setLoadings({
      ...loadings,
      districtLoading: true,
    });
    try {
      const payload = 12;
      if (apiCalling.District == 0) {
        const response = await dispatch(getDistrictDetails(payload));
        if (response.payload.success) {
          setAllDistrict(response.payload.data);
          setApiCalling({
            ...apiCalling,
            District: 1,
          });
        }
      }
      setLoadings({
        ...loadings,
        districtLoading: false,
      });
    } catch (error) {
      console.log(error, 'somethign went wrong');
    }
  };

  const getTaluk = async () => {
    setLoadings({
      ...loadings,
      TalukLoading: true,
    });
    try {
      if (apiCalling.Taluk == 0) {
        const response = await dispatch(
          getTalukDetails(formik.values.residence_district),
        );
        if (response.payload.success) {
          setApiCalling({
            ...apiCalling,
            Taluk: 1,
          });
          setTalukData(response.payload.data);
        }
      }
      setLoadings({
        ...loadings,
        TalukLoading: false,
      });
    } catch (error) {
      console.log(error, 'soemthing went worng');
    }
  };

  const getCityName = async () => {
    setLoadings({
      ...loadings,
      cityLoading: true,
    });
    try {
      if (apiCalling.City == 0) {
        const response = await dispatch(
          getCityDetails(formik.values.residence_taluk),
        );
        if (response.payload.success) {
          setApiCalling({
            ...apiCalling,
            City: 1,
          });
          setCityName(response.payload.data);
        }
      }
      setLoadings({
        ...loadings,
        cityLoading: false,
      });
    } catch (error) {
      console.log(error, 'somethign went worng');
    }
  };

  const getVillageName = async () => {
    setLoadings({
      ...loadings,
      villageLoading: true,
    });
    try {
      if (apiCalling.Village === 0) {
        const response = await dispatch(
          getVillageDetails(formik.values.residence_CityName),
        );
        if (response.payload.success) {
          setApiCalling({
            ...apiCalling,
            Village: 1,
          });
          setVillageName(response.payload.data);
        }
      }
      setLoadings({
        ...loadings,
        villageLoading: false,
      });
    } catch (error) {
      console.log(error, 'something went wrong');
    }
  };

  const getResidentialAdressDetails = async () => {
    setLoadings({
      ...loadings,
      getDetailsLoading: true,
    });
    const details = {
      board_id: 1,
      key: 'user_id',
      value: parseInt(Cookies.get('id')),
      procedure_name: 'address_details',
    };
    const { payload } = await dispatch(GetResidetialAddressDetails(details));
    console.log(payload, 'loll');

    formik.setValues({
      Residence: payload.data[0]?.catalog_address_base_type_id,
      residence_state: payload.data[0]?.state_id,
      residence_district: payload.data[0]?.district_id,
      residence_taluk: payload.data[0]?.taluk_id,
      residence_CityName: payload.data[0]?.city_town_gram_panchayat_id,
      residence_VillageName: payload.data[0]?.village_area_id,
      ResidenceString: payload.data[0]?.address_type,
      residence_stateString: 'Karnataka',
      residence_districtString: payload.data[0]?.district,
      residence_talukString: payload.data[0]?.taluk,
      residence_CityNameString: payload.data[0]?.panhayat_city_town,
      residence_VillageNameString: payload.data[0]?.ward_area_village,
      residence_StreetName: payload.data[0]?.street_name,
      residence_HouseBuildingNumber: payload.data[0]?.door_no,
      residence_Landmark: payload.data[0]?.land_mark,
      residence_Pincode: payload.data[0]?.pin_code,
      address_type_id: payload.data[0]?.catalog_address_type_id,
    });
    setLoadings({
      ...loadings,
      getDetailsLoading: false,
    });
    if (payload.data[0].city_town_gram_panchayat_id) {
      setEdit(true);
    }
  };
  useEffect(() => {
    getResidentialAdressDetails();
  }, []);

  return (
    <>
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
        <form onSubmit={formik.handleSubmit}>
          <Row className="m-0">
            <Row className="permanent-title-row">
              <Col xs={12} className="profile-title">
                <h1 className="mx-4">{en.permanentAddress}</h1>
              </Col>
            </Row>

            <Row className="form-row">
              <Col xs={12} md={6}>
                <Required className="mt-3 mb-2" title="state" />
                <FormControl fullWidth>
                  <TextField
                    variant="outlined"
                    placeholder="Enter Your State"
                    name="state"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                  />
                </FormControl>
                {formik.errors.state && formik.touched.state ? (
                  <p style={{ color: 'red' }}>{formik.errors.state}</p>
                ) : (
                  ''
                )}
              </Col>
              <Col xs={12} md={6}>
                <Required className="mt-3 mb-2" title="district" />
                <FormControl fullWidth>
                  <TextField
                    variant="outlined"
                    placeholder="Enter Your District"
                    name="district"
                    value={formik.values.district}
                    onChange={formik.handleChange}
                  />
                </FormControl>
                {formik.errors.district && formik.touched.district ? (
                  <p style={{ color: 'red' }}>{formik.errors.district}</p>
                ) : (
                  ''
                )}
              </Col>
              <Col xs={12} md={6}>
                <Required className="mt-3 mb-2" title="taluk" />
                <FormControl fullWidth>
                  <TextField
                    variant="outlined"
                    placeholder="Enter Your Taluk"
                    name="taluk"
                    value={formik.values.taluk}
                    onChange={formik.handleChange}
                  />
                </FormControl>
                {formik.errors.taluk && formik.touched.taluk ? (
                  <p style={{ color: 'red' }}>{formik.errors.taluk}</p>
                ) : (
                  ''
                )}
              </Col>
              <Col xs={12} md={6}>
                <Required className="mt-3 mb-2" title={en.cityName} />
                <FormControl fullWidth>
                  <TextField
                    variant="outlined"
                    placeholder="Enter Your City Name"
                    name="CityName"
                    value={formik.values.CityName}
                    onChange={formik.handleChange}
                  />
                </FormControl>
                {formik.errors.CityName && formik.touched.CityName ? (
                  <p style={{ color: 'red' }}>{formik.errors.CityName}</p>
                ) : (
                  ''
                )}
              </Col>
              <Col xs={12} md={6}>
                <Required className="mt-3 mb-2" title={en.villageName} />
                <FormControl fullWidth>
                  <TextField
                    variant="outlined"
                    placeholder="Enter Your Village Name"
                    name="VillageName"
                    value={formik.values.VillageName}
                    onChange={formik.handleChange}
                  />
                </FormControl>
                {formik.errors.VillageName && formik.touched.VillageName ? (
                  <p style={{ color: 'red' }}>{formik.errors.VillageName}</p>
                ) : (
                  ''
                )}
              </Col>
              <Col xs={12} md={6}>
                <Required className="mt-3 mb-2" title={en.streetNameRoadName} />
                <FormControl fullWidth>
                  <TextField
                    variant="outlined"
                    placeholder="Enter Your Street Name/ Road Name"
                    name="StreetName"
                    value={formik.values.StreetName}
                    onChange={formik.handleChange}
                  />
                </FormControl>
                {formik.errors.StreetName && formik.touched.StreetName ? (
                  <p style={{ color: 'red' }}>{formik.errors.StreetName}</p>
                ) : (
                  ''
                )}
              </Col>
              <Col xs={12} md={6}>
                <Required
                  className="mt-3 mb-2"
                  title={en.houseBuildingNumber}
                />
                <FormControl fullWidth>
                  <TextField
                    InputProps={{
                      startAdornment: (
                        // <InputAdornment position="start">
                        // </InputAdornment>
                        <></>
                      ),
                    }}
                    variant="outlined"
                    placeholder="Enter Your House / Building Number"
                    name="HouseBuildingNumber"
                    value={formik.values.HouseBuildingNumber}
                    onChange={formik.handleChange}
                  />
                </FormControl>
                {formik.errors.HouseBuildingNumber &&
                formik.touched.HouseBuildingNumber ? (
                  <p style={{ color: 'red' }}>
                    {formik.errors.HouseBuildingNumber}
                  </p>
                ) : (
                  ''
                )}
              </Col>
              <Col xs={12} md={6}>
                <Required className="mt-3 mb-2" title={en.landmark} />
                <FormControl fullWidth className="formcontrol2">
                  <TextField
                    variant="outlined"
                    placeholder="Enter Your Landmark"
                    name="Landmark"
                    value={formik.values.Landmark}
                    onChange={formik.handleChange}
                  />
                </FormControl>
                {formik.errors.Landmark && formik.touched.Landmark ? (
                  <p style={{ color: 'red' }}>{formik.errors.Landmark}</p>
                ) : (
                  ''
                )}
              </Col>
              <Col xs={12} md={6}>
                <Required className="mt-3 mb-2" title={en.pincode} />
                <FormControl fullWidth>
                  <TextField
                    variant="outlined"
                    placeholder="Enter Your Pincode"
                    inputProps={{ maxLength: 6 }}
                    name="Pincode"
                    value={formik.values.Pincode}
                    onChange={formik.handleChange}
                  />
                </FormControl>
                {formik.errors.Pincode && formik.touched.Pincode ? (
                  <p style={{ color: 'red' }}>{formik.errors.Pincode}</p>
                ) : (
                  ''
                )}
              </Col>
            </Row>

            <Row className="residential-title-row">
              <Col xs={12} className="profile-title">
                <h1>{en.residentialAddress}</h1>
              </Col>
            </Row>

            {/* Residence  Address*/}
            <Row className="form-row ">
              {/* Residence */}
              <Col xs={12} md={6}>
                <Required className="mt-3 mb-2" title={en.typeOfresidence} />
                <FormControl
                  variant="outlined"
                  className="formcontrol5"
                  fullWidth={true}
                >
                  <Select
                    className="select-marital"
                    labelId="demo-simple-select-required-label"
                    id="demo-simple-select-required"
                    defaultValue={
                      formik.values.Residence == ''
                        ? '--Select--'
                        : formik.values.Residence
                    }
                    value={
                      formik.values.Residence
                        ? formik.values.Residence
                        : '--Select--'
                    }
                    onChange={formik.handleChange}
                    name="Residence"
                    displayEmpty
                    onOpen={Residence}
                  >
                    <MenuItem value={formik.values.Residence || '--Select--'}>
                      <ListItemText
                        className="mt-1"
                        primary={
                          apiCalling.Residence > 0
                            ? '--Select--'
                            : formik.values.ResidenceString ||
                              (loadings.ResidenceLoading
                                ? 'Loading...'
                                : '--Select--')
                        }
                      />
                    </MenuItem>
                    {residence.length > 0 &&
                      residence.map((residenceOption) => (
                        <MenuItem
                          key={residenceOption.value_id}
                          value={residenceOption.value_id}
                        >
                          <ListItemText
                            style={{ color: 'black' }}
                            primary={residenceOption.short_name}
                          />
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                {formik.errors.Residence && formik.touched.Residence && (
                  <p style={{ color: 'red' }}>{formik.errors.Residence}</p>
                )}
              </Col>

              {/* state */}
              <Col xs={12} md={6}>
                <Required className="mt-3 mb-2" title={en.enterYourState} />
                <FormControl
                  variant="outlined"
                  className="formcontrol5"
                  fullWidth={true}
                >
                  <Select
                    className="select-marital"
                    labelId="demo-simple-select-required-label"
                    id="demo-simple-select-required"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="residence_state"
                    displayEmpty
                    value={formik.values.residence_state || ''}
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
                {formik.errors.residence_state &&
                  formik.touched.residence_state && (
                    <p style={{ color: 'red', marginTop: '4px' }}>
                      {formik.errors.residence_state}
                    </p>
                  )}
              </Col>

              {/* residence_district */}
              <Col xs={12} md={6}>
                <Required className="mt-3 mb-2" title={en.enterYourDistrict} />
                <FormControl
                  variant="outlined"
                  className="formcontrol5"
                  fullWidth={true}
                >
                  <Select
                    className="select-marital"
                    labelId="demo-simple-select-required-label"
                    id="demo-simple-select-required"
                    defaultValue={
                      formik.values.residence_district == ''
                        ? '--Select--'
                        : formik.values.residence_district
                    }
                    value={
                      formik.values.residence_district
                        ? formik.values.residence_district
                        : '--Select--'
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="residence_district"
                    onOpen={getDistrict}
                    displayEmpty
                  >
                    <MenuItem
                      value={formik.values.residence_district || '--Select--'}
                    >
                      <ListItemText
                        className="mt-2"
                        primary={
                          apiCalling.District > 0
                            ? '--Select--'
                            : formik.values.residence_districtString ||
                              (loadings.districtLoading
                                ? 'Loading...'
                                : '--Select--')
                        }
                      />
                    </MenuItem>
                    {getAllDistrict.length > 0 &&
                      getAllDistrict.map((district) => (
                        <MenuItem key={`${district.id}`} value={district.id}>
                          <ListItemText
                            style={{ color: 'black' }}
                            primary={district.name}
                          />
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                {formik.errors.residence_district &&
                  formik.touched.residence_district && (
                    <p style={{ color: 'red' }}>
                      {formik.errors.residence_district}
                    </p>
                  )}
              </Col>

              {/* Taluk */}
              <Col xs={12} md={6}>
                <Required className="mt-3 mb-2" title={en.enterYourTaluk} />
                <FormControl
                  variant="outlined"
                  className="formcontrol5"
                  fullWidth={true}
                >
                  <Select
                    className="select-marital"
                    labelId="demo-simple-select-required-label"
                    id="demo-simple-select-required"
                    defaultValue={
                      formik.values.residence_taluk == ''
                        ? '--Select--'
                        : formik.values.residence_taluk
                    }
                    value={
                      formik.values.residence_taluk
                        ? formik.values.residence_taluk
                        : '--Select--'
                    }
                    onChange={formik.handleChange}
                    name="residence_taluk"
                    onOpen={getTaluk}
                    displayEmpty
                  >
                    <MenuItem
                      value={formik.values.residence_taluk || '--Select--'}
                    >
                      <ListItemText
                        className="mt-2"
                        primary={
                          apiCalling.Taluk > 0
                            ? '--Select--'
                            : formik.values.residence_talukString ||
                              (loadings.TalukLoading ? 'Loading...' : '--Select--')
                        }
                      />
                    </MenuItem>
                    {getTalukdata?.length > 0 &&
                      getTalukdata?.map((getTalukdata) => (
                        <MenuItem
                          key={`${getTalukdata.id}`}
                          value={getTalukdata.id}
                        >
                          <ListItemText
                            style={{ color: 'black' }}
                            primary={getTalukdata.name}
                          />
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                {formik.errors.residence_taluk &&
                  formik.touched.residence_taluk && (
                    <p style={{ color: 'red' }}>
                      {formik.errors.residence_taluk}
                    </p>
                  )}
                <FormHelperText className="helperTextAadhar"></FormHelperText>
              </Col>

              {/*  City Name */}
              <Col xs={12} md={6}>
                <Required className="mt-3 mb-2" title={en.enterYourCityName} />
                <FormControl
                  variant="outlined"
                  className="formcontrol5"
                  fullWidth={true}
                >
                  <Select
                    className="select-marital"
                    labelId="demo-simple-select-required-label"
                    id="demo-simple-select-required"
                    defaultValue={
                      formik.values.residence_CityName == ''
                        ? '--Select--'
                        : formik.values.residence_CityName
                    }
                    value={
                      formik.values.residence_CityName
                        ? formik.values.residence_CityName
                        : '--Select--'
                    }
                    onChange={formik.handleChange}
                    name="residence_CityName"
                    onOpen={getCityName}
                    displayEmpty
                  >
                    <MenuItem
                      value={formik.values.residence_CityName || '--Select--'}
                    >
                      <ListItemText
                        className="mt-2"
                        primary={
                          apiCalling.City > 0
                            ? '--Select--'
                            : formik.values.residence_CityNameString ||
                              (loadings.cityLoading ? 'Loading...' : '--Select--')
                        }
                      />
                    </MenuItem>
                    {getCityNameData?.length > 0 &&
                      getCityNameData?.map((cityName) => (
                        <MenuItem key={cityName.id} value={cityName.id}>
                          <ListItemText
                            style={{ color: 'black' }}
                            primary={cityName.name}
                          />
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                {formik.errors.residence_CityName &&
                  formik.touched.residence_CityName && (
                    <p style={{ color: 'red' }}>
                      {formik.errors.residence_CityName}
                    </p>
                  )}
              </Col>

              {/* Village Name* */}
              <Col xs={12} md={6}>
                <Required
                  className="mt-3 mb-2"
                  title={en.enterYourAreaVillageName}
                />
                <FormControl
                  variant="outlined"
                  className="formcontrol5"
                  fullWidth={true}
                >
                  <Select
                    className="select-marital"
                    labelId="demo-simple-select-required-label"
                    id="demo-simple-select-required"
                    defaultValue={
                      formik.values.residence_VillageName == ''
                        ? '--Select--'
                        : formik.values.residence_VillageName
                    }
                    value={
                      formik.values.residence_VillageName
                        ? formik.values.residence_VillageName
                        : '--Select--'
                    }
                    onChange={formik.handleChange}
                    name="residence_VillageName"
                    onOpen={getVillageName}
                    displayEmpty
                  >
                    <MenuItem
                      value={
                        formik.values.residence_VillageName || '--Select--'
                      }
                    >
                      <ListItemText
                        className="mt-2"
                        primary={
                          apiCalling.Village > 0
                            ? '--Select--'
                            : formik.values.residence_VillageNameString ||
                              (loadings.villageLoading
                                ? 'Loading...'
                                : '--Select--')
                        }
                      />
                    </MenuItem>
                    {getVillageNameData?.length > 0 &&
                      getVillageNameData?.map((village, index) => (
                        <MenuItem
                          key={`${village.id}-${index}`}
                          value={village.id}
                        >
                          <ListItemText
                            style={{ color: 'black' }}
                            primary={village.name}
                          />
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                {formik.errors.residence_VillageName &&
                  formik.touched.residence_VillageName && (
                    <p style={{ color: 'red' }}>
                      {formik.errors.residence_VillageName}
                    </p>
                  )}
              </Col>

              {/* Road Name */}
              <Col xs={12} md={6}>
                <Required className="mt-3 mb-2" title={en.streetRoadName} />
                <FormControl fullWidth className="formcontrol1">
                  <TextField
                    variant="outlined"
                    placeholder="Enter Your Street/Road Name"
                    name="residence_StreetName"
                    defaultValue={formik.values.residence_StreetName}
                    value={formik.values.residence_StreetName}
                    onChange={formik.handleChange}
                  />
                </FormControl>
                {formik.errors.residence_StreetName &&
                formik.touched.residence_StreetName ? (
                  <p style={{ color: 'red' }}>
                    {formik.errors.residence_StreetName}
                  </p>
                ) : (
                  ''
                )}
              </Col>

              {/* House/Building Number */}
              <Col xs={12} md={6}>
                <Required
                  className="mt-3 mb-2"
                  title={en.houseBuildingNumber}
                />

                <FormControl fullWidth>
                  <TextField
                    InputProps={{
                      startAdornment: <></>,
                    }}
                    variant="outlined"
                    placeholder="Enter Your House / Building Number"
                    name="residence_HouseBuildingNumber"
                    value={formik.values.residence_HouseBuildingNumber}
                    onChange={formik.handleChange}
                  />
                </FormControl>
                {formik.errors.residence_HouseBuildingNumber &&
                formik.touched.residence_HouseBuildingNumber ? (
                  <p style={{ color: 'red' }}>
                    {formik.errors.residence_HouseBuildingNumber}
                  </p>
                ) : (
                  ''
                )}
              </Col>

              {/* Landmark */}
              <Col xs={12} md={6}>
                <Required className="mt-3 mb-2" title={en.landmark} />
                <FormControl fullWidth className="formcontrol2">
                  <TextField
                    variant="outlined"
                    placeholder="Enter Your Landmark"
                    name="residence_Landmark"
                    value={formik.values.residence_Landmark}
                    onChange={formik.handleChange}
                  />
                </FormControl>
                {formik.errors.residence_Landmark &&
                formik.touched.residence_Landmark ? (
                  <p style={{ color: 'red' }}>
                    {formik.errors.residence_Landmark}
                  </p>
                ) : (
                  ''
                )}
              </Col>

              {/* PINCODE */}
              <Col xs={12} md={6}>
                <Required className="mt-3 mb-2" title={en.pincode} />
                <FormControl fullWidth>
                  <TextField
                    variant="outlined"
                    inputProps={{ maxLength: 6 }}
                    placeholder="Enter Your Pincode"
                    name="residence_Pincode"
                    value={formik.values.residence_Pincode}
                    onChange={formik.handleChange}
                  />
                </FormControl>
                {formik.errors.residence_Pincode &&
                  formik.touched.residence_Pincode && (
                    <p style={{ color: 'red' }}>
                      {formik.errors.residence_Pincode}
                    </p>
                  )}

                <FormHelperText className="helperTextAadhar"></FormHelperText>
              </Col>

              <Col xs={12} className="note2 text-center mt-5 personal-col-7">
                <p>
                  <span>{en.note}</span>
                  {
                    en.afterthecompletionofthemandatoryfieldsinPersonalDetailsthenonlythesystemwillallowthefurtherprocess1
                  }
                </p>
              </Col>
            </Row>

            <Row className="button-inside-form-row mb-5">
              <Col xs={12} className="next-back-button-row mt-4 ">
                {!edit ? (
                  <div>
                    <Button
                      variant="danger"
                      className="back-button"
                      onClick={() => setRenderComponent(0)}
                    >
                      {en.back}
                    </Button>

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
      </Row>
    </>
  );
};
export default Address;
