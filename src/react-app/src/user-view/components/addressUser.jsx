import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Stack,
} from "@mui/material";
import axios from "axios";
import { getThemeConfig } from "../../service/themeService";

const AddressSelector = ({
  selectedProvince,
  selectedDistrict,
  selectedWards,

  setSelectedProvince,
  setSelectedDistrict,
  setSelectedWards,
  //
  backgroundColor,
  color,
}) => {
  const apiAddress = process.env.SERVER_ADDRESS;
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  //   const [selectedProvince, setSelectedProvince] = useState(null);
  //   const [selectedDistrict, setSelectedDistrict] = useState(null);
  //   const [selectedWards, setSelectedWards] = useState(null);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const currentTheme = getThemeConfig(localStorage.getItem("THEMES") || "dark");
  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const response = await axios.get(`http://localhost:3003/provinces`);

        setProvinces(response.data.data || []);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      } finally {
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch districts when a province is selected
  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        setLoadingDistricts(true);
        try {
          const response = await axios.get(
            `http://localhost:3003/districts/${selectedProvince.code}`
          );
          setDistricts(response.data.data || []);
        } catch (error) {
          console.error("Error fetching districts:", error);
        } finally {
          setLoadingDistricts(false);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
    }
  }, [selectedProvince]);

  // Fetch wards when a district is selected
  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        setLoadingWards(true);
        try {
          const response = await axios.get(
            `http://localhost:3003/wards/${selectedDistrict.code}`
          );
          setWards(response.data.data || []);
        } catch (error) {
          console.error("Error fetching wards:", error);
        } finally {
          setLoadingWards(false);
        }
      };
      fetchWards();
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);

  return (
    <Stack spacing={3}>
      {/* Province Selector */}
      <Autocomplete
        options={provinces}
        getOptionLabel={(option) => option.name_with_type || option.name || ""}
        value={selectedProvince}
        onChange={(event, newValue) => {
          setSelectedProvince(newValue);
          setSelectedDistrict(null);
          setWards([]);
        }}
        loading={loadingProvinces}
        renderInput={(params) => (
          <TextField
            {...params}
            label={
              selectedProvince
                ? selectedProvince.full_name || selectedProvince
                : "Chọn tỉnh"
            }
            sx={{
              backgroundColor: currentTheme.backgroundColorLow || "#151b23", // Màu nền của input
              "& .MuiInputLabel-root": {
                color: currentTheme.color || "#f0ffff", // Màu chữ của label
              },
              "& .MuiInputBase-input": {
                color: currentTheme.color, // Màu chữ của input
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#3d444d", // Màu viền
                },
              },
              "& .MuiInputBase-root": {
                borderRadius: "4px", // Làm tròn góc nếu muốn
              },
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loadingProvinces ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      {/* District Selector */}
      <Autocomplete
        options={districts}
        getOptionLabel={(option) => option.full_name || option.name || ""}
        value={selectedDistrict}
        onChange={(event, newValue) => setSelectedDistrict(newValue)}
        loading={loadingDistricts}
        renderInput={(params) => (
          <TextField
            {...params}
            label={
              selectedDistrict
                ? selectedDistrict.full_name || selectedDistrict
                : "Chọn huyện"
            }
            sx={{
              backgroundColor: currentTheme.backgroundColorLow || "#151b23", // Màu nền của input
              "& .MuiInputLabel-root": {
                color: currentTheme.color || "#f0ffff", // Màu chữ của label
              },
              "& .MuiInputBase-input": {
                color: currentTheme.color, // Màu chữ của input
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#3d444d", // Màu viền
                },
              },
              "& .MuiInputBase-root": {
                borderRadius: "4px", // Làm tròn góc nếu muốn
              },
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loadingDistricts ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        disabled={!selectedProvince}
      />

      {/* Ward Selector */}
      <Autocomplete
        options={wards}
        getOptionLabel={(option) => option.full_name || option.name || ""}
        loading={loadingWards}
        value={selectedWards}
        onChange={(event, newValue) => setSelectedWards(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={
              selectedWards
                ? selectedWards.full_name || selectedWards
                : "Chọn phường xã"
            }
            sx={{
              backgroundColor: currentTheme.backgroundColorLow || "#151b23", // Màu nền của input
              "& .MuiInputLabel-root": {
                color: currentTheme.color || "#f0ffff", // Màu chữ của label
              },
              "& .MuiInputBase-input": {
                color: currentTheme.color, // Màu chữ của input
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#3d444d", // Màu viền
                },
              },
              "& .MuiInputBase-root": {
                borderRadius: "4px", // Làm tròn góc nếu muốn
              },
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loadingWards ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        disabled={!selectedDistrict}
      />
    </Stack>
  );
};

export default AddressSelector;
