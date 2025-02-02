import MaterialTable from "@material-table/core"
import { Add, Edit } from "@mui/icons-material"
import { Button, Sheet } from "@mui/joy"
import AddVehicleModal from "components/Modals/transport/AddVehicleModal"
import { useState } from "react"


function Tab1() {
    const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false)

    const handleAddVehicleModalClose = () => {
        setIsAddVehicleModalOpen(false)
    }

    const columnMat = [
        { title: "Name", field: "serialNo" },
        { title: "Vehicle Number", field: "pickupPointName" },
        { title: "Driver", field: "distance" },
        { title: "Conductor", field: "monthlyCharge" },
        { title: "Total Seat", field: "monthlyCharge" },
        { title: "Student Allocated", field: "monthlyCharge" },
        { title: "Available Seat", field: "monthlyCharge" },
    ]

    const transportData = [
        { serialNo: 1, pickupPointName: "Pickup Point 1", distance: "5 km", monthlyCharge: "1000" },
        { serialNo: 2, pickupPointName: "Pickup Point 2", distance: "10 km", monthlyCharge: "1500" },
        { serialNo: 3, pickupPointName: "Pickup Point 3", distance: "15 km", monthlyCharge: "2000" },
        { serialNo: 4, pickupPointName: "Pickup Point 4", distance: "20 km", monthlyCharge: "2500" },
        { serialNo: 5, pickupPointName: "Pickup Point 5", distance: "25 km", monthlyCharge: "3000" },
    ]

    return (
        <>
            <Sheet sx={{ display: "flex", justifyContent: "end" }}>
                <Button variant="solid" color="primary" startDecorator={<Add />} onClick={()=>setIsAddVehicleModalOpen(true)}>Add Vehicle</Button>
            </Sheet>

            <Sheet variant="outlined" sx={{ mt: 1 }}>
                <MaterialTable
                    style={{
                        display: "grid",
                    }}
                    columns={columnMat}
                    data={transportData}
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

                            },
                        },
                    ]}
                />
            </Sheet>
            <AddVehicleModal
                open={isAddVehicleModalOpen}
                onClose={handleAddVehicleModalClose}
            />
        </>
    )
}

export default Tab1