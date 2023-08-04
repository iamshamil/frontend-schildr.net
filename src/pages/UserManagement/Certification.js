import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import LoadingButton from "@mui/lab/LoadingButton";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

import { StyledTableCell, StyledTableRow } from "../Profile/tableComponent";
import {
  updateOurCert,
  createOurCert,
  getOurCertbyOwner,
  deleteOurCert,
} from "../../utilis/request";
import { domain } from "../../config/constant";

const Experience = ({ showTitle, allowAdd, showAction, user }) => {
  const [isUpdate, setIsUpdate] = useState("");
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(false);

  const [values, setValues] = useState({
    name: "",
    field: "",
    firstName: "",
    lastName: "",
    duration: 1,
    certificationId: "",
    check: false,
  });

  const { name, field, firstName, lastName, duration, certificationId, check } =
    values;

  const handleValue = (data) => {
    setValues((pre) => ({ ...pre, ...data }));
  };

  const clearValue = () => {
    setValues({
      field: "",
      firstName: "",
      lastName: "",
      duration: 1,
      certificationId: "",
      check: false,
    });
    setIsUpdate("");
  };

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    clearValue();
  };

  const editModal = (row) => {
    handleValue({
      firstName: row.firstName,
      lastName: row.lastName,
      name: row.name,
      field: row.field,
      duration: row.duration,
      certificationId: row.certificationId,
    });
    setIsUpdate(row._id);
    setModal(true);
  };

  const getData = async (id) => {
    const data = await getOurCertbyOwner(id);
    if (data.status) {
      setRows(data.data);
    } else {
      toast.error("Getting experience data is failed");
    }
  };

  const createAndUpdate = async () => {
    handleValue({ check: true });
    if (!name || !field || !duration) return;

    if (isUpdate) {
      const data = await updateOurCert({ id: isUpdate, name, field, duration });
      if (data.status) {
        closeModal();
        setRows((pre) =>
          pre.map((e) => {
            if (e._id === data.data._id) {
              e = { ...e, ...data.data };
            }
            return e;
          })
        );
        toast.success("Success");
      } else {
        toast.error(data.message);
      }
    } else {
      const data = await createOurCert({
        name,
        field,
        duration,
        userId: user._id,
      });
      if (data.status) {
        setRows((pre) => [...pre, data.data]);
        closeModal();
      } else {
        toast.error(data.message);
      }
    }
  };

  const deleteRow = async (id) => {
    const data = await deleteOurCert(id);
    if (data.status) {
      setRows((pre) => pre.filter((e) => e._id !== id));
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    if (user._id) getData(user._id);
  }, [user]);

  return (
    <>
      <Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          {showTitle && <Typography variant="h6">Certification</Typography>}
          {allowAdd && (
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              onClick={openModal}
            >
              Add
            </Button>
          )}
        </Stack>
        <Table
          sx={{ minWidth: 700, borderRadius: 1, overflow: "hidden" }}
          aria-label="customized table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">No</StyledTableCell>
              <StyledTableCell align="center">Title</StyledTableCell>
              <StyledTableCell align="center">Field</StyledTableCell>
              <StyledTableCell align="center">Duration</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <StyledTableRow key={i}>
                <StyledTableCell component="th" scope="row" align="center">
                  {i + 1}
                </StyledTableCell>
                <StyledTableCell align="center">{row.name}</StyledTableCell>
                <StyledTableCell align="center">{row.field}</StyledTableCell>
                <StyledTableCell align="center">{`${row.duration} years`}</StyledTableCell>
                <StyledTableCell align="center">
                  {showAction ? (
                    <>
                      <IconButton
                        component="a"
                        href={`${domain}/certified/${row.certificationId}`}
                        //href={`http://localhost:3000/certified/${row.certificationId}`}
                        target="_blank"
                      >
                        <RemoveRedEyeIcon />
                      </IconButton>
                      <IconButton onClick={() => editModal(row)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => deleteRow(row._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton
                      component="a"
                      href={`${domain}/certified/${row.certificationId}`}
                      target="_blank"
                    >
                      <RemoveRedEyeIcon />
                    </IconButton>
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>
      <Dialog open={modal} onClose={closeModal}>
        <DialogTitle>
          {isUpdate ? `Update Certification` : `Add New Certification`}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Stack
                direction="row"
                sx={{
                  width: "100%",
                  alignItems: "center",
                  "& a": { fontSize: 20, color: "#000", ml: "auto" },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    textTransform: "capitalize",
                    width: 500,
                  }}
                >{`${firstName} ${lastName}`}</Typography>
                {certificationId && (
                  <a
                    rel="noreferrer"
                    href={`${domain}/certified/${certificationId}`}
                    target="_blank"
                  >
                    {certificationId}
                  </a>
                )}
              </Stack>
              <TextField
                error={check && !name}
                value={name}
                onChange={(e) => handleValue({ name: e.target.value })}
                label="Certification Name"
              />
              <TextField
                multiline
                rows={2}
                error={check && !field}
                value={field}
                onChange={(e) => handleValue({ field: e.target.value })}
                label="Certification Field"
              />
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  type="number"
                  size="small"
                  error={check && !duration}
                  inputProps={{ min: 1, max: 10 }}
                  sx={{ width: 100 }}
                  value={duration}
                  onChange={(e) => handleValue({ duration: e.target.value })}
                  label="Duration"
                />
                <Typography>Years</Typography>
              </Stack>
            </Stack>
          </Stack>
          <Stack direction="row" justifyContent="space-between" sx={{ pt: 2 }}>
            {isUpdate && (
              <Button
                variant="contained"
                sx={{ mr: 2 }}
                onClick={() => deleteRow(isUpdate)}
                startIcon={<DeleteIcon />}
                color="error"
              >
                Delete
              </Button>
            )}
            <Box>
              <Button
                variant="contained"
                color="error"
                sx={{ mr: 1 }}
                onClick={closeModal}
              >
                Cancel
              </Button>
              {
                <LoadingButton
                  variant="contained"
                  color="info"
                  onClick={createAndUpdate}
                >
                  {isUpdate ? "Udpate" : "Add"}
                </LoadingButton>
              }
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Experience;
