import { DialogTitle, Modal, ModalDialog, Stack } from "@mui/joy";
import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@mui/joy";
import { useState } from "react";
import { db } from "../../../firebase";
import firebase from "firebase";
import { enqueueSnackbar } from "notistack";

type SerialNumber = {
  serialNo?: number;
  vehicleId?: string;
};

type TransportData = SerialNumber & {
  vehicleName: string;

  driverName: string;
  conductorName: string;
  registerNumber: string;
  totalSeat: string;
  licenseDate: string;
  rcDate: string;

  insuranceDate: string;
  pollutionDate: string;
};

type EditVehicleDetailProps = {
  open: boolean;
  onClose: () => void;
  VehicleData:TransportData[],
  selectedVehicle:TransportData,
};

function EditVehicleDetail(props: EditVehicleDetailProps) {
  const { open, onClose,VehicleData,selectedVehicle } = props;
  const [formState, setFormState] = useState<TransportData>({
    vehicleName: selectedVehicle.vehicleName ,

    driverName: selectedVehicle.driverName,
    conductorName: selectedVehicle.conductorName,
    registerNumber: selectedVehicle.registerNumber,
    totalSeat: selectedVehicle.totalSeat,
    licenseDate: selectedVehicle.licenseDate,

    rcDate:selectedVehicle.rcDate,
    insuranceDate: selectedVehicle.insuranceDate,
    pollutionDate: selectedVehicle.pollutionDate,
  });

  const [formError, setFormError] = useState({
    vehicleName:"",

    driverName: "",
    conductorName: "",
    registerNumber: "",
    totalSeat: "",
    licenseDate: "",

    rcDate: "",
    insuranceDate: "",
    pollutionDate: "",
  });

  const handleFormChange = (e: any) => {
    setFormError({
      ...formError,
      [e.target.name]: "",
    });
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };
  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    let error = false;
    const newFormError = {
      vehicleName: formState.vehicleName ? "" : "Vehicle Name is Required",

      driverName: formState.driverName ? "" : "Driver Name is Required",
      conductorName: formState.conductorName
        ? ""
        : "Conducter Name is Required",

      registerNumber: formState.registerNumber
        ? ""
        : "Register Number Required",
      totalSeat: formState.totalSeat ? "" : "Total Seat is Required",
      licenseDate: formState.licenseDate ? "" : "Lincense sate is required",
      rcDate: formState.rcDate ? "" : "Rc Date is required",
      insuranceDate: formState.insuranceDate ? "" : "Insurance Date required",
      pollutionDate: formState.pollutionDate
        ? ""
        : " Pollution Dateis required",
    };
    setFormError(newFormError);
    error = Object.values(newFormError).some((err) => err !== "");
    if (!error) {
      const generateUniqueNumber = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
      };

      const vehicleId = generateUniqueNumber(); // Generate a unique 6 digit transport ID

      const transportDataForSave: TransportData = {
        vehicleId,
        ...formState,
      };
      const VechileIndex=VehicleData.findIndex(Vehicle=>Vehicle.vehicleId ===selectedVehicle.vehicleId)
      VehicleData[VechileIndex]=transportDataForSave
  const transportRef = db.collection("TRANSPORT").doc("transportLocations");
      transportRef.update({
           vehicle:VehicleData       
      });
      setFormState({
        vehicleId: vehicleId,
        vehicleName: "",
        driverName: "",
        conductorName: "",
        registerNumber: "",
        totalSeat: "",
        licenseDate: "",
        rcDate: "",
        insuranceDate: "",
        pollutionDate: "",
      });
      onClose();
      enqueueSnackbar("Vechicle updated Successfully", {
        variant: "success",
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog minWidth="md" sx={{ overflow: "scroll" }}>
        <DialogTitle>Create New Pickup Point</DialogTitle>
        <form onSubmit={handleFormSubmit}>
          <Stack spacing={2}>
            <FormControl error={formError.vehicleName ? true : false}>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Bus/Vechile Name"
                onChange={handleFormChange}
                name="vehicleName"
                value={formState.vehicleName}
              />
              {formError.vehicleName && (
                <FormHelperText>{formError.vehicleName}</FormHelperText>
              )}
            </FormControl>
            <FormControl error={formError.registerNumber ? true : false}>
              <FormLabel>Number</FormLabel>
              <Input
                placeholder="Registration Number"
                onChange={handleFormChange}
                name="registerNumber"
                value={formState.registerNumber}
              />
              {formError.registerNumber && (
                <FormHelperText>{formError.registerNumber}</FormHelperText>
              )}
            </FormControl>
            <FormControl error={formError.driverName ? true : false}>
              <FormLabel>Driver Name</FormLabel>
              <Input
                placeholder="Name"
                onChange={handleFormChange}
                name="driverName"
                value={formState.driverName}
              />
              {formError.driverName && (
                <FormHelperText>{formError.driverName}</FormHelperText>
              )}
            </FormControl>
            <FormControl error={formError.conductorName ? true : false}>
              <FormLabel>Conduter</FormLabel>
              <Input
                placeholder="Conduter Name"
                name="conductorName"
                value={formState.conductorName}
                onChange={handleFormChange}
              />
              {formError.conductorName && (
                <FormHelperText>{formError.conductorName}</FormHelperText>
              )}
            </FormControl>
            <FormControl error={formError.totalSeat ? true : false}>
              <FormLabel>Total seat</FormLabel>
              <Input
                placeholder="Total Seat"
                name="totalSeat"
                value={formState.totalSeat}
                onChange={handleFormChange}
              />
              {formError.totalSeat && (
                <FormHelperText>{formError.totalSeat}</FormHelperText>
              )}
            </FormControl>
            <FormControl error={formError.totalSeat ? true : false}>
              <FormLabel>License Date</FormLabel>
              <Input
                placeholder="dd-mm-yyyy"
                name="licenseDate"
                type="date"
                value={formState.licenseDate}
                onChange={handleFormChange}
              />
              {formError.licenseDate && (
                <FormHelperText>{formError.licenseDate}</FormHelperText>
              )}
            </FormControl>
            <FormControl error={formError.rcDate ? true : false}>
              <FormLabel>Rc Date</FormLabel>
              <Input
                placeholder="dd-mm-yyyy"
                name="rcDate"
                type="date"
                value={formState.rcDate}
                onChange={handleFormChange}
              />
              {formError.rcDate && (
                <FormHelperText>{formError.rcDate}</FormHelperText>
              )}
            </FormControl>
            <FormControl error={formError.insuranceDate ? true : false}>
              <FormLabel>Insurance Date</FormLabel>
              <Input
                placeholder="dd-mm-yyyy"
                name="insuranceDate"
                type="date"
                value={formState.insuranceDate}
                onChange={handleFormChange}
              />
              {formError.insuranceDate && (
                <FormHelperText>{formError.insuranceDate}</FormHelperText>
              )}
            </FormControl>
            <FormControl error={formError.insuranceDate ? true : false}>
              <FormLabel>Pollution Date</FormLabel>
              <Input
                placeholder="dd-mm-yyyy"
                name="pollutionDate"
                type="date"
                value={formState.pollutionDate}
                onChange={handleFormChange}
              />
              {formError.pollutionDate && (
                <FormHelperText>{formError.pollutionDate}</FormHelperText>
              )}
            </FormControl>
            <Divider sx={{ mt: 1 }} />
            <Button type="submit" color="primary">
              Add
            </Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
}

export default EditVehicleDetail;

