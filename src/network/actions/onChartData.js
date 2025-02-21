// actions/someActions.js
import axios from "../api";

import {
  DASHBOARD_REPORT_SUCCESS,
  DASHBOARD_REPORT_FALIURE,
  CHART_DATA_SUCCESS,
  CHART_DATA_FALIURE,
} from "../action_types";
import { decryptData, encryptDataGet } from "../../utils/encryptDecrypt";
// Action Creators
export const onChartDataSuccess = (data) => ({
  type: CHART_DATA_SUCCESS,
  payload: data,
});

export const onChartDataFaliure = (error) => ({
  type: CHART_DATA_FALIURE,
  payload: error,
});

// Async Action to Fetch Data
export const onChartDataFilters = (body, setLoader=()=>{}) => {
  return async (dispatch) => {
    try {
      setLoader(true)
      let url = `/dashboard/dateWiseData`

      if (body?.district?.ehimbhoomiDistrictId) {
        let value = typeof body?.district?.ehimbhoomiDistrictId == "number" ? JSON.stringify(body?.district?.ehimbhoomiDistrictId) : body?.district?.ehimbhoomiDistrictId
        url = url +  `?districtId=${encryptDataGet(value)}`
      }
      if (body?.tehsil?.ehimbhoomiTehsilId) {
        let value = typeof body?.tehsil?.ehimbhoomiTehsilId == "number" ? JSON.stringify(body?.tehsil?.ehimbhoomiTehsilId) : body?.tehsil?.ehimbhoomiTehsilId
        url = url +  `&tehsilId=${encryptDataGet(value)}`
      }
      if (body?.patwar?.id) {
        let value = typeof body?.patwar?.id == "number" ? JSON.stringify(body?.patwar?.id) : body?.patwar?.id
        url = url +  `&patwarId=${encryptDataGet(value)}`
      }

      const response = await axios.get(url);

      let data = decryptData(response?.data?.data)

      dispatch(onChartDataSuccess(data));
      setLoader(false)
    } catch (error) {
      dispatch(onChartDataFaliure(error));
      setLoader(false)
    }
  };
};
