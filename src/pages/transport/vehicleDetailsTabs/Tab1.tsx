import MaterialTable from "@material-table/core";
import { Add, Edit } from "@mui/icons-material";
import { Button, Sheet } from "@mui/joy";
import AddVehicleModal from "components/Modals/transport/AddVehicleModal";
import { db } from "../../../firebase";
import { useEffect, useState } from "react";
import EditVehicleDetail from "components/Modals/transport/EditVehicleDetail";
import { TransportVehicleType } from "types/transport";


function Tab1() {
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [transportVehicles, setTransportVehicles] = useState<TransportVehicleType[]>([]);
  const [selectedVechile, setSelectedVehicle] = useState<TransportVehicleType | null>(null)


  const handleAddVehicleModalClose = () => {
    setIsAddVehicleModalOpen(false);
  };

  const columnMat = [
    { title: "Name", field: "vehicleName" },
    { title: "Vehicle Number", field: "registrationNumber" },
    { title: "Vehicle Contact", field: "vehicleContact" },
    { title: "Driver", field: "driverName" },
    { title: "Conductor", field: "conductorName" },
    { title: "Total Seat", field: "totalSeat" },
    { title: "Student Allocated", field: "monthlyCharge" },
    { title: "Available Seat", field: "monthlyCharge" },
  ];


  const fetchVehicleData = async () => {
    setTransportVehicles([]);
    const transportRef = db.collection("TRANSPORT").doc("transportLocations");
    const doc = await transportRef.get();
    if (doc.exists) {
      const data = doc.data();
      if (data) {
        setTransportVehicles(data.vehicles);
      } else {
        setTransportVehicles([]);
        console.log("No such document!");
      }
    }
  };
  useEffect(() => {
    fetchVehicleData();
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
          data={transportVehicles}
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
                setSelectedVehicle(rowData as TransportVehicleType);
                setIsAddVehicleModalOpen(true)
              },
            },
          ]}
        />
      </Sheet>
      <AddVehicleModal
        open={isAddVehicleModalOpen}
        onClose={handleAddVehicleModalClose}
        fetchVehicleData={fetchVehicleData}
      />
      {selectedVechile &&
        <EditVehicleDetail open={isAddVehicleModalOpen}
          onClose={handleAddVehicleModalClose}
          selectedVehicle={selectedVechile}
          fetchVehicleData={fetchVehicleData}
          vehicleData={transportVehicles}
        />
      }
    </>
  );
}

export default Tab1;
