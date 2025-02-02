import { Delete, Edit, } from "@mui/icons-material"
import { Button, Chip, Input } from "@mui/joy";
import { Divider, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material"
import LSBox from "components/Card/LSBox";
import { db } from "./../../firebase";
import firebase from "firebase"
import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
export interface ClassType {
  classId: string;
  name: string;
  status:string;
}

function AddClasses() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [newClass, setNewClass] = useState<string>("");

  const handleSaveNewClass = async () => {
    if (newClass.trim() === "") {
      enqueueSnackbar("Please enter class name", { variant: "error" });
      return;
    }
    const masterDataRef = db.collection("MASTER_DATA").doc("masterData");

    const newClassData: ClassType = {
      classId:
        Math.floor(1000 + Math.random() * 9000).toString(),
      name: newClass,
      status:"active"
    }
    const doc = await masterDataRef.get();
    if (!doc.exists) {
      await masterDataRef.set({ classes: [newClassData] });
    } else {
      await masterDataRef.update({
      classes: firebase.firestore.FieldValue.arrayUnion(newClassData)
      });
    }
    setNewClass("");
    setClasses([...classes, newClassData]);
    enqueueSnackbar("Class added successfully", { variant: "success" });
  }

  useEffect(()=>{
    const fetchClasses = ()=>{
      db.collection("MASTER_DATA").doc("masterData").get().then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          setClasses(data?.classes.map((item: ClassType) => item));
        }
      });
    }
    fetchClasses();
  })

  return (
    <>
      <LSBox>
        <Stack width={"400px"} spacing={1}>
          <Typography variant="body1">Add New Class</Typography>
          <Divider />
          <Input placeholder="Enter class name.." value={newClass} onChange={(e) => setNewClass(e.target.value)} />
          <Button sx={{ width: "fit-content" }} color="primary" onClick={handleSaveNewClass}>Add </Button>
        </Stack>
      </LSBox>
      <br />
      <Paper>
        <Stack direction="row" justifyContent="space-between" alignItems="center" p={2}>
          <Typography variant="body1">Class List</Typography>
          <Input placeholder="search class.." value={searchInput} onChange={(e) => setSearchInput(e.target.value)}></Input>
        </Stack>
        <Divider />
        <TableContainer component={Paper} sx={{ mt: 1 }} >
          <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell align="left">S/N</TableCell>
                <TableCell align="center" >Class Name</TableCell>
                <TableCell align="center" >Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody >
              {classes.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography>{index + 1}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center" >{row.name}</TableCell>
                  <TableCell align="center" >{row.status==="active"?<Chip color="success">Active</Chip>:<Chip color="danger">In-Active</Chip>}</TableCell>
                  <TableCell align="right">
                    <Stack direction={"row"} spacing={1} justifyContent={"end"}>
                      <Tooltip title="Edit">
                        <IconButton>
                          <Edit color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton >
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
              }

            </TableBody>
          </Table>
        </TableContainer >
      </Paper>
    </>
  )
}

export default AddClasses