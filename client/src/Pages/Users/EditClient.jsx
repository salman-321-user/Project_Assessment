import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/action/user";
import {
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  DialogActions,
  TextField,
} from "@mui/material";
import { PiNotepad, PiXLight } from "react-icons/pi";
import { CFormSelect } from "@coreui/react";
import { pakistanCities } from "../../constant";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const EditClient = ({ open, setOpen }) => {
  /////////////////////////////////////// VARIABLES ///////////////////////////////////////
  const dispatch = useDispatch();
  const { currentEmployee: currentClient, isFetching } = useSelector((state) => state.user);

  /////////////////////////////////////// STATES ///////////////////////////////////////
  const [clientData, setClientData] = useState({});
  const [errors, setErrors] = useState({});

  /////////////////////////////////////// USE EFFECT ///////////////////////////////////////
  useEffect(() => {
    setClientData({
      firstName: currentClient?.firstName || "",
      lastName: currentClient?.lastName || "",
      username: currentClient?.username || "",
      phone: currentClient?.phone || "",
      email: currentClient?.email || "",
      city: currentClient?.city || "",
    });
    setErrors({});
  }, [currentClient]);

  /////////////////////////////////////// FUNCTIONS ///////////////////////////////////////
  const validateForm = () => {
    const { firstName, lastName, username, phone, email } = clientData;
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = "First Name is required";
    if (!lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!username.trim()) newErrors.username = "User Name is required";
    if (!phone) newErrors.phone = "Phone is required";
    if (email && !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Please provide a valid email";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch(updateUser(currentClient._id, clientData, currentClient.role));
    setOpen(false);
  };

  const handleChange = (field, value) => {
    setClientData((prevData) => ({ ...prevData, [field]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  const handleClose = () => {
    setOpen(false);
    setErrors({});
  };

  return (
    <Dialog
      scroll={"paper"}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      fullWidth="sm"
      maxWidth="sm"
      aria-describedby="alert-dialog-slide-description">
      <DialogTitle className="flex items-center justify-between">
        <div className="text-sky-400 font-primary">Edit Client</div>
        <div className="cursor-pointer" onClick={handleClose}>
          <PiXLight className="text-[25px]" />
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-2 p-3 text-gray-500 font-primary">
          <div className="text-xl flex justify-start items-center gap-2 font-normal">
            <PiNotepad size={23} />
            <span>Client Details</span>
          </div>
          <Divider />
          <table className="mt-4">
            <tr>
              <td className="flex items-start pt-2 text-lg">First Name </td>
              <td className="pb-4">
                <TextField
                  size="small"
                  fullWidth
                  value={clientData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName}
                />
              </td>
            </tr>
            <tr>
              <td className="flex items-start pt-2 text-lg">Last Name </td>
              <td className="pb-4">
                <TextField
                  size="small"
                  fullWidth
                  value={clientData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName}
                />
              </td>
            </tr>
            <tr>
              <td className="flex items-start pt-2 text-lg">User Name </td>
              <td className="pb-4">
                <TextField
                  size="small"
                  fullWidth
                  value={clientData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  error={Boolean(errors.username)}
                  helperText={errors.username}
                />
              </td>
            </tr>
            <tr>
              <td className="flex items-start pt-2 text-lg">Email </td>
              <td className="pb-4">
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Optional"
                  value={clientData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                />
              </td>
            </tr>
            <tr>
              <td className="flex items-start pt-2 text-lg">Phone </td>
              <td className="pb-4">
                <TextField
                  type="number"
                  size="small"
                  fullWidth
                  value={clientData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  error={Boolean(errors.phone)}
                  helperText={errors.phone}
                />
              </td>
            </tr>
            <tr>
              <td className="flex items-start pt-2 text-lg">City </td>
              <td className="pb-4">
                <CFormSelect
                  value={clientData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="border-[1px] p-2 rounded-[4px] border-[#c4c4c4] cursor-pointer text-black w-full">
                  <option value="">Optional</option>
                  {pakistanCities.map((city, key) => (
                    <option key={key} value={city}>
                      {city}
                    </option>
                  ))}
                </CFormSelect>
              </td>
            </tr>
          </table>
        </div>
      </DialogContent>
      <DialogActions>
        <button
          onClick={handleClose}
          variant="contained"
          type="reset"
          className="bg-[#d7d7d7] px-4 py-2 rounded-lg text-gray-500 mt-4 hover:text-white hover:bg-[#6c757d] border-[2px] border-[#efeeee] hover:border-[#d7d7d7] font-thin transition-all">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isFetching}
          variant="contained"
          className="bg-primary-red px-4 py-2 rounded-lg text-white mt-4 hover:bg-red-400 font-thin">
          {isFetching ? "Submitting..." : "Submit"}
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default EditClient;
