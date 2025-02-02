import {
  Alert,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
} from "@mui/joy";
import { Warning2 } from "iconsax-react";
import { useState } from "react";
import LockIcon from "@mui/icons-material/Lock";
import { enqueueSnackbar } from "notistack";
import { db } from "../../firebase";
import firebase from "../../firebase";
interface Props {
  open: boolean;
  setOpen: (props: boolean) => void;
  studentId: string;
  challanId: string;
}

const DeleteChallanConfirmationDialog: React.FC<Props> = ({
  open,
  setOpen,
  studentId,
  challanId,
}) => {
  const [accessKeyInput, setAccessKeyInput] = useState<string>("");
  const [accessKeyError, setAccessKeyError] = useState<string>("");

  const handleConfirmButton = async () => {
    if (accessKeyInput === "123456") {
      if (studentId && challanId) {
        let batch = db.batch();

        let challanRef = db
          .collection("STUDENTS")
          .doc(studentId)
          .collection("CHALLANS")
          .doc(challanId);
        let paymentRefNl = db
          .collection("STUDENTS")
          .doc(studentId)
          .collection("PAYMENTS")
          .where("challanId", "==", challanId);
        let paymentRefGl = db
          .collection("MY_PAYMENTS")
          .where("challanId", "==", challanId);

        let studentDocRef = db.collection("STUDENTS").doc(studentId);

        try {
          const snapshot1 = await paymentRefGl.get();
          snapshot1.forEach((doc) => {
            batch.delete(doc.ref);
          });
          const snapshot2 = await paymentRefNl.get();
          snapshot2.forEach((doc) => {
            batch.delete(doc.ref);
          });

          batch.delete(challanRef);

          batch.update(studentDocRef, {
            generatedChallans:
              firebase.firestore.FieldValue.arrayRemove(challanId),
          });
          await batch.commit();
          enqueueSnackbar("Challan deleted successfully !", {
            variant: "success",
          });
          setOpen(false);
        } catch (e) {
          enqueueSnackbar("Failed to delete document!");
          console.error("Error deleting document using batch: ", e);
          setOpen(false);
        }
      } else {
        enqueueSnackbar("Unable to delete please try refreshing !", {
          variant: "error",
        });
      }
    } else {
      setAccessKeyError("Access Key is incorrect !");
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>
          <Warning2 />
          Information
        </DialogTitle>
        <Divider />
        <DialogContent>
          Warning! it seems you are going to do ciritical change, are you sure ?
          <FormControl sx={{ mt: "1rem", mb: "1rem" }}>
            <FormLabel>Enter Change Key</FormLabel>
            <Input
              placeholder="enter change key"
              value={accessKeyInput}
              onChange={(e) => setAccessKeyInput(e.target.value)}
            ></Input>
            <FormHelperText>
              Key will be required to change these values, please contact admin.
            </FormHelperText>
            {accessKeyError === "" ? null : (
              <Alert
                variant="soft"
                color="danger"
                sx={{ mt: "1rem" }}
                startDecorator={<LockIcon />}
              >
                {accessKeyError}
              </Alert>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="solid" color="danger" onClick={handleConfirmButton}>
            Agree
          </Button>
          <Button
            variant="plain"
            color="neutral"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};

export default DeleteChallanConfirmationDialog;
