// actions/someActions.js
import axios from "../api";

import {
  DASHBOARD_REPORT_SUCCESS,
  DASHBOARD_REPORT_FALIURE,
} from "../action_types";
import { decryptData, encryptDataGet } from "../../utils/encryptDecrypt";
// Action Creators
export const fetchDashboardSuccess = (data) => ({
  type: DASHBOARD_REPORT_SUCCESS,
  payload: data,
});

export const fetchDashboardFaliure = (error) => ({
  type: DASHBOARD_REPORT_FALIURE,
  payload: error,
});

// Async Action to Fetch Data
export const onDashboarFilters = (body, setLoader=()=>{}) => {
  return async (dispatch) => {
    try {
      console.log('body filter', body)
      setLoader(true)
      let url = `/dashboard/report`

      if (body?.district?.ehimbhoomiDistrictId) {
        let value = typeof body?.district?.ehimbhoomiDistrictId == "number" ? JSON.stringify(body?.district?.ehimbhoomiDistrictId) : body?.district?.ehimbhoomiDistrictId
        url = url +  `?districtId=${encryptDataGet(value)}`
      }
      if (body?.patwar?.id) {
        let value = typeof body?.patwar?.id == "number" ? JSON.stringify(body?.patwar?.id) : body?.patwar?.id
        url = url +  `&patwarId=${encryptDataGet(value)}`
      }
      if (body?.tehsil?.ehimbhoomiTehsilId) {
        let value = typeof body?.tehsil?.ehimbhoomiTehsilId == "number" ? JSON.stringify(body?.tehsil?.ehimbhoomiTehsilId) : body?.tehsil?.ehimbhoomiTehsilId
        url = url +  `&tehsilId=${encryptDataGet(value)}`
      }
      if (body?.village?.value) {
        let value = typeof body?.village?.value == "number" ? JSON.stringify(body?.village?.value) : body?.village?.value

        url = url +  `&villageId=${encryptDataGet(value)}`
      }
      if (body?.fromDate && body?.toDate && body?.district?.ehimbhoomiDistrictId && body?.patwar?.id && body?.tehsil?.ehimbhoomiTehsilId   ){
        url = url +  `&fromDate=${encryptDataGet(body?.fromDate)}`
      }
      if (body?.fromDate && body?.toDate && body?.district?.ehimbhoomiDistrictId && body?.patwar?.id && body?.tehsil?.ehimbhoomiTehsilId ) {
        url = url +  `&toDate=${encryptDataGet(body?.toDate)}`
      }

      const response = await axios.get(url);

      let data = decryptData(response?.data?.data)

      dispatch(fetchDashboardSuccess(data));
      setLoader(false)
    } catch (error) {
      dispatch(fetchDashboardFaliure(error));
      setLoader(false)
    }
  };
};
