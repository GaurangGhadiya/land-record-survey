import React, { useEffect, useState } from 'react';
import { Box, Card, CircularProgress, Grid, InputLabel, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin
import { useDispatch, useSelector } from 'react-redux';
import Select from "react-select";
import { getTehsilApi } from '../network/actions/getTehsilApi';
import { getdistrictCode, getKanungoCode, getPatwarCode, gettehsilCode } from '../utils/cookie';
import { onChartDataFilters } from '../network/actions/onChartData';
import { getPatwarApi } from '../network/actions/getPatwarApi';
import { getVillageApi } from '../network/actions/getVillageApi';

// Register ChartJS components and plugin
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            position: 'nearest', // Position the tooltip nearest to the active element (bar)
            yAlign: 'bottom',    // Align tooltip above the bar
            xAlign: 'center',    // Center the tooltip horizontally above the bar
            callbacks: {
                label: function (tooltipItem) {
                    return `Total Count: ${new Intl.NumberFormat('en-IN').format(tooltipItem.raw)}`;
                },
            },
        },


        datalabels: {

            color: '#000',
            font: {
                weight: 'bold',
                size: 12,
            },
            align: 'start',        // Center the label horizontally
            anchor: 'end',          // Anchor at the top of the bar
            offset: -20,             // We can keep this at a reasonable value like 10
            formatter: (value) => new Intl.NumberFormat('en-IN').format(value),

            // Manually adjust the y position to provide more spacing from the bar

            // Add custom y positioning to ensure enough space

        },
        // datalabels: {
        //     color: '#000',
        //     font: {
        //         weight: 'bold',
        //         size: 12,
        //     },
        //     formatter: (value) => new Intl.NumberFormat('en-IN').format(value),
        //     position: 'top',        // Keep the position as 'top'
        //     align: 'center',        // Center the label horizontally
        //     anchor: 'end',          // Anchor at the top of the bar
        //     offset: 10,             // We can keep this at a reasonable value like 10

        //     // Manually adjust the y position to provide more spacing from the bar
        //     align: 'center',        // Ensure it remains centered
        //     display: function (context) {
        //         return context.hovered; // Show data label when hovered
        //     },
        //     // Add custom y positioning to ensure enough space
        //     y: function (context) {
        //         const value = context.dataset.data[context.dataIndex];
        //         const base = context.chart.chartArea.top;
        //         const height = context.chart.chartArea.bottom - base;

        //         // Push the label 10 pixels above the top of the bar
        //         return base - 10;
        //     }
        // },
    },
    scales: {
        x: {
            beginAtZero: true,
            grid: {
                display: false,
            },
        },
        y: {
            beginAtZero: true,
            grid: {
                display: false,
            },
            ticks: {
                callback: function (value) {
                    return new Intl.NumberFormat('en-IN').format(value);
                },
                padding: 10, // Padding between ticks and the bars
                offset: 10,  // Add some offset to avoid the bars overlapping with the labels
            },
        },
    },
};



const Chart1 = () => {
    const dispatch = useDispatch();
    const districtListApi = useSelector((state) => state.districtReducer?.data);
    const tehsilListApi = useSelector((state) => state.tehsilReducer?.data);
    const getGenderReportData = useSelector((state) => state.onChartDataRedux?.data);
    const patwarListApi = useSelector(
        (state) => state.patwarReducer?.data
    );
    const [Loader, setLoader] = useState(false);
    const [districtOptions, setDistrictOptions] = useState([]);
    const [tehsilOptions, setTehsilOptions] = useState([]);
    const [patwarOptions, setPatwarOptions] = useState([])

    const [filterData, setFilterData] = useState({
        district: "",
        tehsil: "",
        patwar: ""
    });

    console.log('districtListApi', districtListApi)
    console.log('filterData chart', filterData)

    const setData = async () => {
        const divisionCode = await getdistrictCode();
        const divisionCode2 = await gettehsilCode();
        const divisionCode3 = await getPatwarCode();


        setFilterData({
            ...filterData, district: {
                label: await districtListApi?.find(v => v?.lgdCode == divisionCode)?.nameE,
                value: divisionCode,
                code: divisionCode,
                ehimbhoomiDistrictId: await districtListApi?.find(v => v?.lgdCode == divisionCode)?.ehimbhoomiDistrictId,

            },
            tehsil: {
                label: await tehsilListApi?.find(v => v?.lgdCode == divisionCode2)?.nameE,
                value: divisionCode2,
                code: divisionCode2,
                ehimbhoomiTehsilId: await tehsilListApi?.find(v => v?.lgdCode == divisionCode)?.ehimbhoomiTehsilId,

            },
            patwar: {
                label: await patwarListApi?.find(v => v?.rmsPatwarId == divisionCode3)?.nameE,
                value: divisionCode3,
                code: divisionCode3,
                id: await patwarListApi?.find(v => v?.rmsPatwarId == divisionCode)?.id,
            }
        })

        dispatch(onChartDataFilters({
            ...filterData, district: {
                label:  districtListApi?.find(v => v?.lgdCode == divisionCode)?.nameE,
                value: divisionCode,
                code: divisionCode,
                ehimbhoomiDistrictId:  districtListApi?.find(v => v?.lgdCode == divisionCode)?.ehimbhoomiDistrictId,

            },
            tehsil: {
                label:  tehsilListApi?.find(v => v?.lgdCode == divisionCode2)?.nameE,
                value: divisionCode2,
                code: divisionCode2,
                ehimbhoomiTehsilId:  tehsilListApi?.find(v => v?.lgdCode == divisionCode2)?.ehimbhoomiTehsilId,

            },
            patwar: {
                label:  patwarListApi?.find(v => v?.rmsPatwarId == divisionCode3)?.nameE,
                value: divisionCode3,
                code: divisionCode3,
                id:  patwarListApi?.find(v => v?.rmsPatwarId == divisionCode3)?.id,

            }
        }, setLoader));

    }

    useEffect(() => {
        const divisionCode =  getdistrictCode();
        if (divisionCode) {

            setData()
        } else {

            dispatch(onChartDataFilters(filterData, setLoader));
        }



    }, [])


    const setDistrictData = async () => {
      let district_list = [];

      if (districtListApi) {
        if (districtListApi) {

          for (let i = 0; i < districtListApi.length; i++) {
            let object = {
              label: districtListApi[i].nameE,
              value: districtListApi[i].lgdCode,
                id: districtListApi[i].lgdCode,
                ehimbhoomiDistrictId: districtListApi[i].ehimbhoomiDistrictId,

            };
            district_list.push(object);
          }
          setDistrictOptions(district_list);
        }
        const divisionCode = await getdistrictCode();
        console.log('divisionCode', divisionCode, typeof divisionCode)
        // if (divisionCode) {
        //   setFilterData({
        //     ...filterData, district: {
        //       label: await districtListApi?.find(v => v?.lgdCode == divisionCode)?.nameE,
        //       value: divisionCode,
        //       code: divisionCode,
        //     }
        //   })
        // //   dispatch(getTehsilApi(+divisionCode))

        // }
      }
    }
   useEffect(() => {
         setDistrictData()
   }, [districtListApi]);

    const setTehsilData = async () => {
      let tehsil_list = [];

      if (tehsilListApi) {
        if (tehsilListApi) {

          for (let i = 0; i < tehsilListApi.length; i++) {
            let object = {
              label: tehsilListApi[i].nameE,
              value: tehsilListApi[i].lgdCode,
                id: tehsilListApi[i].lgdCode,
                ehimbhoomiTehsilId: tehsilListApi[i].ehimbhoomiTehsilId,

            };
            tehsil_list.push(object);
          }
          setTehsilOptions(tehsil_list);
        }
        const divisionCode = await gettehsilCode();
        // if (divisionCode) {
        //   setFilterData({
        //     ...filterData, tehsil: {
        //       label:await tehsilListApi?.find(v => v?.lgdCode == divisionCode)?.nameE,
        //       value: divisionCode,
        //       code: divisionCode,
        //     }
        //   })
        //   dispatch(getPatwarApi(+divisionCode))

        // }
      }
    }
   useEffect(() => {
     setTehsilData()
   }, [tehsilListApi]);

    const setPatwatData = async () => {
        let patwar_list = [];
        if (patwarListApi) {
            if (patwarListApi) {

                for (let i = 0; i < patwarListApi.length; i++) {
                    let object = {
                        label: patwarListApi[i].nameE,
                        value: patwarListApi[i].rmsPatwarId,
                        id: patwarListApi[i].id,
                    };
                    patwar_list.push(object);
                }
                setPatwarOptions(patwar_list);
            }
            const divisionCode = await getPatwarCode();
              const divisionCode2 =await gettehsilCode();
              const divisionCode3 =await getKanungoCode();

            // if (divisionCode) {
            //     setFilterData({
            //         ...filterData, patwar: {
            //             label: await patwarListApi?.find(v => v?.rmsPatwarId == divisionCode)?.nameE,
            //             value: divisionCode,
            //             code: divisionCode,
            //         }
            //     })
            //     // dispatch(getVillageApi(+divisionCode, +divisionCode2, +divisionCode3))
            //     // searchData()
            // }
        }
    }
    useEffect(() => {
        setPatwatData()
    }, [patwarListApi]);

    const handleChangeFilter = (e, name) => {
        if (name === "district") {
            setFilterData({ ...filterData, [name]: e , tehsil : '', patwar : ''});
            dispatch(onChartDataFilters({ ...filterData, [name]: e, tehsil: '', patwar: '' }, setLoader));
            dispatch(getTehsilApi(e?.ehimbhoomiDistrictId));
        } else if (name === "tehsil") {
            setFilterData({ ...filterData,  [name]: e, patwar : ''});
            dispatch(getPatwarApi(e?.ehimbhoomiTehsilId))

            dispatch(onChartDataFilters({ ...filterData,  [name]: e , patwar : ''}, setLoader));
        }
        else if (name == "patwar") {
            // const divisionCode3 = getKanungoCode();
            setFilterData({ ...filterData, [name]: e })
            dispatch(onChartDataFilters({ ...filterData, [name]: e }, setLoader));
            // dispatch(getVillageApi(e?.value, filterData?.tehsil?.value, divisionCode3))

        }
    };

    useEffect(() => {
        // dispatch(onChartDataFilters(filterData, setLoader));
    }, []);
console.log('getGenderReportData', getGenderReportData)
    const Chartdata = {
        labels: getGenderReportData?.map((v) => v?.date) || [],
        datasets: [
            {
                label: 'Sales',
                data: getGenderReportData?.map((v) => v?.count) || [],
                backgroundColor: ['#22CFCF', '#FF6384', '#059BFF'],
                borderWidth: 0,
            },
        ],
    };

    return (
        <Card backgroundColor="white" p={2} elevation={10} sx={{ alignItems: "center", backgroundColor: "#FFF", borderRadius: 1, p: 2 }}>
            <Grid container spacing={2} mb={2}>
                <Grid item xs={6}></Grid>
                <Grid item xs={2}>
                    <InputLabel style={{ marginBottom: 5 }} id="demo-simple-select-helper-label">District</InputLabel>
                    <Select
                        styles={{ menu: (styles) => ({ ...styles, zIndex: 999 }) }}
                        closeMenuOnSelect={true}
                        value={filterData?.district || {}}
                        options={districtOptions}
                        onChange={(e) => handleChangeFilter(e, "district")}
                        isDisabled={getdistrictCode() ? true : false}

                    />
                </Grid>

                <Grid item xs={2}>
                    <InputLabel style={{ marginBottom: 5 }} id="demo-simple-select-helper-label">Tehsil</InputLabel>
                    <Select
                        styles={{ menu: (styles) => ({ ...styles, zIndex: 999 }) }}
                        closeMenuOnSelect={true}
                        value={filterData?.tehsil || {}}
                        options={tehsilOptions}
                        onChange={(e) => handleChangeFilter(e, "tehsil")}
                        isDisabled={gettehsilCode() ? true : false}

                    />
                </Grid>
                <Grid item xs={2}>
                    <InputLabel
                        style={{ marginBottom: 5 }}
                        id="demo-simple-select-helper-label"
                    >
                        Patwar{" "}
                    </InputLabel>

                    <Select
                        styles={{ menu: (styles) => ({ ...styles, zIndex: 999 }) }}
                        closeMenuOnSelect={true}
                        value={filterData?.patwar || {}}
                        options={patwarOptions}
                        onChange={(e) => handleChangeFilter(e, "patwar")}
                        isDisabled={getPatwarCode() ? true : false}
                    />
                </Grid>
            </Grid>

            {Loader ? (
                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} height={"400px"}>
                    <CircularProgress />
                </Box>
            ) : (
                <div style={{ width: "100%", height: "400px" }}>
                    <Bar data={Chartdata} options={options} />
                </div>
            )}
        </Card>
    );
};

export default Chart1;
