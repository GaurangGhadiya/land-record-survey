// actions/someActions.js
import axios from "../api";

import { FAMILIES_LIST_SUCCESS, FAMILIES_LIST_FALIURE, HOTELS_LIST_SUCCESS, HOTELS_LIST_FALIURE } from "../action_types";
import { decryptData, encryptDataGet } from "../../utils/encryptDecrypt";
import { Hotel } from "@mui/icons-material";
// Action Creators
export const fetchFamiliesListSuccess = (data) => ({
    type: HOTELS_LIST_SUCCESS,
    payload: data,
});

export const fetchHotelListFailure = (error) => ({
    type: HOTELS_LIST_FALIURE,
    payload: error,
});

export const onHotelList = (setLoader,page = 0, size = 20, body) => {
    return async (dispatch) => {
        console.log("table body", body)
        // debugger
        try {
            setLoader(true)
            let url = `/dashboard/survey/summary?page=${encryptDataGet(page + "")}&size=${encryptDataGet(size + "")}`
            if (body?.district?.ehimbhoomiDistrictId) {
                let value = typeof body?.district?.ehimbhoomiDistrictId == "number" ? JSON.stringify(body?.district?.ehimbhoomiDistrictId) : body?.district?.ehimbhoomiDistrictId
                url = url + `&districtId=${encryptDataGet(value)}`
            }
            if (body?.patwar?.id) {
                let value = typeof body?.patwar?.id == "number" ? JSON.stringify(body?.patwar?.id) : body?.patwar?.id
                url = url + `&patwarId=${encryptDataGet(value)}`
            }
            if (body?.tehsil?.ehimbhoomiTehsilId) {
                let value = typeof body?.tehsil?.ehimbhoomiTehsilId == "number" ? JSON.stringify(body?.tehsil?.ehimbhoomiTehsilId) : body?.tehsil?.ehimbhoomiTehsilId
                url = url + `&tehsilId=${encryptDataGet(value)}`
            }
            if (body?.village?.value) {
                let value = typeof body?.village?.value == "number" ? JSON.stringify(body?.village?.value) : body?.village?.value

                url = url + `&villageId=${encryptDataGet(value)}`
            }
            if (body?.fromDate && body?.toDate && body?.district?.ehimbhoomiDistrictId && body?.patwar?.id && body?.tehsil?.ehimbhoomiTehsilId ) {
                url = url + `&fromDate=${encryptDataGet(body?.fromDate)}`
            }
            if (body?.fromDate && body?.toDate && body?.district?.ehimbhoomiDistrictId && body?.patwar?.id && body?.tehsil?.ehimbhoomiTehsilId ) {
                url = url + `&toDate=${encryptDataGet(body?.toDate)}`
            }
            const response = await axios.get(url);

            let resData = decryptData(response?.data?.data)
            dispatch(fetchFamiliesListSuccess(resData));
            setLoader(false)
        } catch (error) {
            setLoader(false)
            dispatch(fetchHotelListFailure(error));
        }
    };
};
