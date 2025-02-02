import { DialogTitle, Modal, ModalDialog, Stack } from "@mui/joy";
import { Button, Divider, FormControl, FormHelperText, FormLabel, Input } from "@mui/joy"
import { useState } from "react";
import { db } from "../../../firebase";
import firebase from "firebase"
import { enqueueSnackbar } from "notistack";

type SerialNumber = {
  serialNo?: number
}
type TransportData = SerialNumber & {
  locationId?: string,
  pickupPointName: string,
  distance: string,
  monthlyCharge: string
}

type AddPickupPointDialogProps = {
  open: boolean,
  onClose: () => void
  fetchTransportData: () => void
}

function AddPickupPointModal(props: AddPickupPointDialogProps) {
  const { open, onClose,fetchTransportData } = props
  const [formState, setFormState] = useState<TransportData>({
    pickupPointName: "",
    distance: "",
    monthlyCharge: ""
  })

  const [formError, setFormError] = useState({
    pickupPointName: "",
    distance: "",
    monthlyCharge: ""
  })


  const handleFormChange = (e: any) => {
    setFormError({
      ...formError,
      [e.target.name]: ""
    })
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    })
  }
  const handleFormSubmit = async (e: any) => {
    e.preventDefault()
    let error = false
    const newFormError = {
      pickupPointName: formState.pickupPointName ? "" : "Pickup Point Name is required",
      distance: formState.distance ? "" : "Distance is required",
      monthlyCharge: formState.monthlyCharge ? "" : "Monthly Charge is required"
    }
    setFormError(newFormError)
    error = Object.values(newFormError).some(err => err !== "")
    if (!error) {

      const generateUniqueNumber = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
      };

      const locationId = generateUniqueNumber(); // Generate a unique 6 digit transport ID

      const transportDataForSave: TransportData = {
        locationId,
        ...formState
      };

      const transportRef = db.collection("TRANSPORT").doc("transportLocations");
      transportRef.update({
        locations: firebase.firestore.FieldValue.arrayUnion(transportDataForSave)
      });
      setFormState({
        pickupPointName: "",
        distance: "",
        monthlyCharge: ""
      })
      onClose()
      enqueueSnackbar("Pickup Point Added Successfully", { variant: "success" })
      fetchTransportData();
    }
  }


  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog minWidth="sm">
        <DialogTitle>Create New Pickup Point</DialogTitle>
        <form
          onSubmit={handleFormSubmit}
        >
          <Stack spacing={2}>
            <FormControl error={formError.pickupPointName ? true : false}>
              <FormLabel>Pickup Point Name</FormLabel>
              <Input placeholder="Pickup Point Name" onChange={handleFormChange} name="pickupPointName" value={formState.pickupPointName} />
              {formError.pickupPointName && <FormHelperText>{formError.pickupPointName}</FormHelperText>}
            </FormControl>
            <FormControl error={formError.distance ? true : false}>
              <FormLabel>Distance</FormLabel>
              <Input placeholder="Distance" name="distance" value={formState.distance} onChange={handleFormChange} />
              {formError.distance && <FormHelperText>{formError.distance}</FormHelperText>}
            </FormControl>
            <FormControl error={formError.monthlyCharge ? true : false}>
              <FormLabel>Monthly Charge</FormLabel>
              <Input placeholder="Monthly Charge" name="monthlyCharge" value={formState.monthlyCharge} onChange={handleFormChange} />
              {formError.monthlyCharge && <FormHelperText>{formError.monthlyCharge}</FormHelperText>}
            </FormControl>
            <Divider sx={{ mt: 1 }} />
            <Button type="submit" color="primary">Add</Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  )
}

export default AddPickupPointModal