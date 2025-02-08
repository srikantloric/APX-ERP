import MaterialTable from "@material-table/core";
import { Add, Edit } from "@mui/icons-material";
import { Button, Sheet } from "@mui/joy";
import AddVehicleModal from "components/Modals/transport/AddVehicleModal";
import { db } from "../../../firebase";
import { useEffect, useState } from "react";
import EditVehicleDetail from "components/Modals/transport/EditVehicleDetail";

type SerialNumber = {
  serialNo?: number;
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

function Tab1() {
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [transportVehicle, setTransportVehicle] = useState<TransportData[]>([]);
  const [selectedVechile, setSelectedVehicle] = useState<TransportData | null>(null)


  const handleAddVehicleModalClose = () => {
    setIsAddVehicleModalOpen(false);
  };

  const columnMat = [
    { title: "Name", field: "vehicleName" },
    { title: "Vehicle Number", field: "registerNumber" },
    { title: "Driver", field: "driverName" },
    { title: "Conductor", field: "conductorName" },
    { title: "Total Seat", field: "totalSeat" },
    { title: "Student Allocated", field: "monthlyCharge" },
    { title: "Available Seat", field: "monthlyCharge" },
  ];

 
  const fetchTransportData = async () => {
    const transportRef = db.collection("TRANSPORT").doc("transportLocations");
    const doc = await transportRef.get();
    if (doc.exists) {
      const data = doc.data();
      if (data) {
        console.log(data.vehicle);
        setTransportVehicle(data.vehicle);
      } else {
        setTransportVehicle([]);
        console.log("No such document!");
      }
    }
  };
  useEffect(() => {
    fetchTransportData();
    console.log(transportVehicle);
  }, []);

  return (
    <>
      <Sheet sx={{ display: "flex", justifyContent: "end" }}>
        <Button
          variant="solid"
          color="primary"
          startDecorator={<Add />}
          onClick={() => setIsAddVehicleModalOpen(true)}
        >
          Add Vehicle
        </Button>
      </Sheet>

      <Sheet variant="outlined" sx={{ mt: 1 }}>
        <MaterialTable
          style={{
            display: "grid",
          }}
          columns={columnMat}
          data={transportVehicle}
          title="Vehicle List"
          options={{
            // grouping: true,
            headerStyle: {
              backgroundColor: "#5d87ff",
              color: "#FFF",
              paddingLeft: "1rem",
              paddingRight: "1rem",
            },

            actionsColumnIndex: -1,
          }}
          actions={[
            {
              icon: () => <Edit sx={{ color: "var(--bs-primary)" }} />,
              tooltip: "Edit Row",
              
              onClick: (event, rowData) => {
                setSelectedVehicle(rowData as TransportData);
                setIsAddVehicleModalOpen(true)
              },
            },
          ]}
        />
      </Sheet>
      <AddVehicleModal
        open={isAddVehicleModalOpen}
        onClose={handleAddVehicleModalClose}
      />
      {selectedVechile &&
      <EditVehicleDetail open={isAddVehicleModalOpen}
       onClose={handleAddVehicleModalClose} 
       selectedVehicle={selectedVechile}
       VehicleData={transportVehicle}


       
      />
      }
    </>
  );
}

export default Tab1;
