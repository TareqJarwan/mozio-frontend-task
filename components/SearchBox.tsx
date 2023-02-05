// Packages
import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useForm } from "react-hook-form";
import Router from "next/router";

// MUI
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Button from "@mui/material/Button";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

// Components
import CustomAutoComplete from "@/components/CustomAutoComplete";

// Types
import { FormData } from "@/types/search.type";

// Styled Components
const SearchWrapper = styled(Paper)(({ }) => ({
  width: "460px",
  padding: 30,
}));
const DatePickerWrapper = styled("div")(({ }) => ({
  marginTop: 16,
  width: "100%",

  ".date-picker": {
    width: "100%",
  },
}));
const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  width: "100%",
  marginTop: 16,
  height: 50,
  borderRadius: 35,
}));
const AddIntermediateCityButton = styled(Button)(({ theme }) => ({
  marginTop: 16,
}));
const IntermediateField = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: 16,
  gap: 10,
}));

// Custom Styles
const textFieldCS = {
  width: "100%",

  "&:not( :first-of-type )": {
    marginTop: "16px",
  },
};

export default function SearchBox(): JSX.Element {
  const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs(new Date()));
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);
  const [hasIntermediate, setHasIntermediate] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm();

  /**
   * Submit handler
   * @param data form data
   */
  const onSubmit = (data: FormData) => {
    console.log("daaa", data)
    if (data.intermediate) data.intermediateCities = data.intermediate.map(i => i.name).toString();
    data.originCity = data?.origin?.name;
    data.destinationCity = data?.destination?.name;

    delete data.origin;
    delete data.intermediate;
    delete data.destination;

    setShowBackdrop(true);
    //@ts-ignore
    const queryParams = Object.keys(data).map((key) => `${key}=${encodeURIComponent(data[key])}`).join("&");

    setTimeout(() => {
      Router.push(`/results?${queryParams}`);
    }, 1000);
  };

  return (
    <>
      {showBackdrop && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={showBackdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <SearchWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CustomAutoComplete
            label="Enter city of origin (city)"
            name="origin"
            required='* This field is required!'
            setValue={setValue}
            control={control}
            errors={errors.origin?.message}
          />
          {hasIntermediate ? (
            <IntermediateField>
              <CustomAutoComplete
                label="Enter intermediate city/cities"
                name='intermediate'
                multiple={true}
                required={false}
                setValue={setValue}
                control={control}
                errors={errors.intermediate?.message}
              />
              <div onClick={() => setHasIntermediate(false)}>
                <ClearOutlinedIcon />
              </div>
            </IntermediateField>
          ) : (
            <AddIntermediateCityButton
              variant="text"
              onClick={() => setHasIntermediate(true)}
            >
              + Add Intermediate City/Cities
            </AddIntermediateCityButton>
          )}
          <CustomAutoComplete
            label="Enter the destination city"
            name="destination"
            required='* This field is required!'
            control={control}
            setValue={setValue}
            errors={errors.destination?.message}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePickerWrapper>
              <DatePicker
                className="date-picker"
                label="Date of the Trip"
                value={dateValue}
                minDate={dayjs()}
                inputFormat="DD/MM/YYYY"
                onChange={(newValue) => {
                  setDateValue(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    {...register("date", { required: '* This field is required!' })}
                    error={!!errors.date}
                  />
                )}
              />
            </DatePickerWrapper>
          </LocalizationProvider>
          <TextField
            type="number"
            sx={textFieldCS}
            id="outlined-basic"
            label="Number of passengers"
            {...register("passengers", { required: '* This field is required!', min: 1 })}
            inputProps={{
              min: 1,
            }}
            error={!!errors.passengers}
            variant="outlined"
            placeholder="e.g. 4"
          />
          <SubmitButton type="submit" variant="contained" disabled={!isValid}>
            Calculate distances
          </SubmitButton>
        </form>
      </SearchWrapper>
    </>
  );
}