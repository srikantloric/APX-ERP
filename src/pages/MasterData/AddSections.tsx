import { Delete, Edit, } from "@mui/icons-material"
import { Button, Chip, Input } from "@mui/joy";
import { Divider, IconButton, Paper, Stack, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material"
import LSBox from "components/Card/LSBox";
import { db } from "./../../firebase";
import firebase from "firebase"
import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import  { tableCellClasses  } from '@mui/material/TableCell';
export interface SectionType {
  sectionId: string;
  name: string;
  status:string;
}



const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function AddSections() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [sections, setSections] = useState<SectionType[]>([]);
  const [newSection, setNewSection] = useState<string>("");

  const handleSaveNewClass = async () => {
    if (newSection.trim() === "") {
      enqueueSnackbar("Please enter class name", { variant: "error" });
      return;
    }
    const masterDataRef = db.collection("MASTER_DATA").doc("masterData");

    const newSectionData: SectionType = {
      sectionId:
        Math.floor(1000 + Math.random() * 9000).toString(),
      name: newSection,
      status:"active"
    }
    const doc = await masterDataRef.get();
    if (!doc.exists) {
      await masterDataRef.set({ sections: [newSectionData] });
    } else {
      await masterDataRef.update({
      sections: firebase.firestore.FieldValue.arrayUnion(newSectionData)
      });
    }
    setNewSection("");
    setSections([...sections, newSectionData]);
    enqueueSnackbar("Class added successfully", { variant: "success" });
  }

  useEffect(()=>{
    const fetchClasses = ()=>{
      db.collection("MASTER_DATA").doc("masterData").get().then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          setSections(data?.sections.map((item: SectionType) => item));
        }
      });
    }
    fetchClasses();
  })

  return (
    <>
      <LSBox>
        <Stack width={"400px"} spacing={1}>
          <Typography variant="body1">Add New Section</Typography>
          <Divider />
          <Input placeholder="Enter section name.." value={newSection} onChange={(e) => setNewSection(e.target.value)} />
          <Button sx={{ width: "fit-content" }} color="primary" onClick={handleSaveNewClass}>Add </Button>
        </Stack>
      </LSBox>
      <br />
      <Paper>
        <Stack direction="row" justifyContent="space-between" alignItems="center" p={2}>
          <Typography variant="body1">Class List</Typography>
          <Input placeholder="search section.." value={searchInput} onChange={(e) => setSearchInput(e.target.value)}></Input>
        </Stack>
        <Divider />
        
        <TableContainer component={Paper} sx={{ mt: 1 }} >
          <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align="left">S/N</StyledTableCell>
                <StyledTableCell align="center" >Section Name</StyledTableCell>
                <StyledTableCell align="center" >Status</StyledTableCell>
                <StyledTableCell align="right">Action</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody >
              {sections.map((row, index) => (
                <StyledTableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <StyledTableCell component="th" scope="row">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography>{index + 1}</Typography>
                    </Stack>
                  </StyledTableCell>
                  <StyledTableCell align="center" >{row.name}</StyledTableCell>
                  <StyledTableCell align="center" >{row.status==="active"?<Chip color="success">Active</Chip>:<Chip color="danger">In-Active</Chip>}</StyledTableCell>
                  <StyledTableCell align="right">
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
                  </StyledTableCell>
                </StyledTableRow>
              ))
              }

            </TableBody>
          </Table>
        </TableContainer >
      </Paper>
    </>
  )
}

export default AddSections