import { DialogTitle, Modal, ModalDialog, Stack } from "@mui/joy";

import { db } from "../../../firebase";
import firebase from "firebase";
import { enqueueSnackbar } from "notistack";
import { TransportVehicleType } from "types/transport";

//form imports
import * as Yup from "yup"
import { Formik } from "formik";

//custom Ui Components
import Textfield from "components/FormsUi/Textfield";
import DateTimePicker from "components/FormsUi/DateTimePicker";

import LoadingButton from "components/FormsUi/LoadingButton"

import { Divider } from "@mui/material";
import { useState } from "react";



const FormValidationSchema = Yup.object().shape({
  vehicleName: Yup.string().required("Vehicle name is required"),
  vehicleContact: Yup.string().required("Contact number is required").min(10, "Please enter 10 digit number").max(10, "Please enter 10 digit number"),
  driverName: Yup.string().required("Driver name is required"),
  conductorName: Yup.string().optional(),
  registrationNumber: Yup.string().required("Registration number required"),
  totalSeat: Yup.string().required("Total number of seat in vehicle is required"),
  licenseDate: Yup.string().optional(),
  rcDate: Yup.string().optional(),
  insuranceDate: Yup.string().optional(),
  pollutionDate: Yup.string().optional(),
})

type AddPickupPointDialogProps = {
  open: boolean;
  onClose: () => void;
  fetchVehicleData: () => void;
};

function AddVehicleModal(props: AddPickupPointDialogProps) {
  const { open, onClose ,fetchVehicleData} = props;
  const [loading, setLoading] = useState(false);

  const FormInitialState: TransportVehicleType = {
    vehicleName: "",
    driverName: "",
    vehicleContact: "",
    conductorName: "",
    registrationNumber: "",
    totalSeat: "",
    licenseDate: "",
    rcDate: "",
    insuranceDate: "",
    pollutionDate: "",
  }

  const saveVehicleToDb = async (vehicle: TransportVehicleType) => {
    try {
      setLoading(true);
      const generateUniqueNumber = () => Math.floor(100000 + Math.random() * 900000).toString();

      const vehicleId = generateUniqueNumber();
      const transportDataForSave: TransportVehicleType = { vehicleId, ...vehicle };
      const transportRef = db.collection("TRANSPORT").doc("transportLocations");

      await transportRef.set(
        {
          vehicles: firebase.firestore.FieldValue.arrayUnion(transportDataForSave),
        },
        { merge: true }
      );
      setLoading(false);
      enqueueSnackbar("Vehicle added successfully", { variant: "success" });
      fetchVehicleData();
      onClose();
    } catch (error) {
      console.error("Error adding vehicle:", error);
      enqueueSnackbar("Failed to add vehicle. Please try again.", { variant: "error" });
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog minWidth="md" sx={{ overflow: "scroll" }}>
        <DialogTitle>Create New Vehicle Data</DialogTitle>
        <Divider />
        <Formik
          initialValues={{ ...FormInitialState }}
          validationSchema={FormValidationSchema}
          onSubmit={(values) => {
            saveVehicleToDb(values);
          }}
        >
          <Stack spacing={2}>
            <Stack direction={"row"} spacing={2}>
              <Textfield
                label="Bus/Vechile Name"
                name="vehicleName"
                required
              />
              <Textfield
                label="Vehicle Registration Number"
                name="registrationNumber"
              />
            </Stack>
            <Stack direction={"row"} spacing={2}>
              <Textfield
                label="Driver Name"
                name="driverName"
                required
              />
              <Textfield
                label="Vehicle Contact"
                name="vehicleContact"
                required
              />
            </Stack>
            <Stack direction={"row"} spacing={2}>
              <Textfield
                label="Conductor Name"
                name="conductorName"
              />
              <Textfield
                label="Total Seat"
                name="totalSeat"
                required
              />
            </Stack>
            <Stack direction={"row"} gap={2}>
              <DateTimePicker
                label="License Date"
                name="licenseDate"
              />
              <DateTimePicker
                label="RC Date"
                name="rcDate"
              />
            </Stack>

            <Stack direction={"row"} gap={2}>

              <DateTimePicker
                label="Insurance Date"
                name="insuranceDate"
              />
              <DateTimePicker
                label="Pollution Date"
                name="pollutionDate"
              />
            </Stack>
            <Divider sx={{ mt: 1 }} />
            <LoadingButton loading={loading}>
              Submit
            </LoadingButton>
          </Stack>
        </Formik>
      </ModalDialog>
    </Modal>
  );
}

export default AddVehicleModal;
