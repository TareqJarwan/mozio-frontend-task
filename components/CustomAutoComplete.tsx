// Packages
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Control, Controller, FieldValues, UseFormSetValue } from 'react-hook-form';

// MUI Components
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';

// Types
import { City } from '@/types/city.type';
import { ApiError } from '@/types/common.type';

// Custom Styles
const textFieldCS = {
  width: "100%",

  "&:not( :first-of-type )": {
    marginTop: "16px",
  },
};

interface IProps {
  label: string;
  name: string;
  multiple?: boolean;
  errors: any;
  required: string | boolean;
  setValue: UseFormSetValue<FieldValues>
  control: Control<FieldValues, any>
}

export default function CustomAutoCompleteCopy({
  label,
  name,
  errors,
  required,
  multiple = false,
  setValue,
  control
}: IProps) {
  const [options, setOptions] = useState<City[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError>({});

  const fetchCities = useCallback(() => {
    setLoading(true);
    axios
      .get(`/api/cities?keyword=${inputValue}`)
      .then(response => {
        setOptions(response.data);
        setLoading(false);
      })
      .catch(({ response }) => {
        setLoading(false);
        setError(response.data);
      });
  }, [inputValue]);

  useEffect(() => {
    let active = true;

    if (!inputValue) {
      setOptions([]);
      return undefined;
    }

    if (active) {
      fetchCities();
    }

    return () => {
      active = false;
    };

  }, [fetchCities, inputValue]);

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: required }}
      render={({
        field: { name },
      }) => (
        <Autocomplete
          id={name}
          sx={textFieldCS}
          limitTags={2}
          multiple={multiple}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          getOptionLabel={option => option.name}
          onChange={(e, values) => setValue(name, values)}
          options={options}
          loading={loading}
          renderInput={params => (
            <TextField
              {...params}
              label={label}
              variant="outlined"
              error={error.code === 400 || !!errors || false}
              helperText={error?.error || ''}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
              onChange={event => {
                setInputValue(event.target.value);
              }}
            />
          )}
        />
      )}
    />
  );
}
