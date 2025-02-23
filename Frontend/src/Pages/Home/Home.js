import "./home.css";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { addTransaction, getTransactions } from "../../utils/ApiRequest";
import Spinner from "../../components/Spinner";
import TableData from "./TableData";
import Analytics from "./Analytics";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, Container } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BarChartIcon from "@mui/icons-material/BarChart";
const Home = () => {
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };
  const [cUser, setcUser] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [view, setView] = useState("table");

  const handleStartChange = (date) => {
    setStartDate(date);
  };

  const handleEndChange = (date) => {
    setEndDate(date);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    
  }, [navigate]);

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleChangeFrequency = (e) => {
    setFrequency(e.target.value);
  };

  const handleSetType = (e) => {
    setType(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const { title, amount, description, category, date, transactionType } = values;
  
    if (!title || !amount || !description || !category || !date || !transactionType) {
      toast.error("Please enter all the fields", toastOptions);
      return;
    }
  
    setLoading(true);
  
    // Create a new transaction object
    const newTransaction = {
      id: Date.now(), // Unique ID for frontend purposes
      title,
      amount,
      description,
      category,
      date,
      transactionType,
    };
  
    // Add the new transaction to the list
    setTransactions([...transactions, newTransaction]);
  
    // Reset form values
    setValues({
      title: "",
      amount: "",
      description: "",
      category: "",
      date: "",
      transactionType: "",
    });
  
    // Close modal
    handleClose();
  
    setLoading(false);
  };
  

  const handleReset = () => {
    setType("all");
    setStartDate(null);
    setEndDate(null);
    setFrequency("7");
  };
 
  const handleTableClick = (e) => {
    setView("table");
  };

  const handleChartClick = (e) => {
    setView("chart");
  };

  return (
    <>
      <Header />

      {loading ? (
        <>
          <Spinner />
        </>
      ) : (
        <>
          <Container
            style={{ position: "relative", zIndex: "2 !important", backgroundColor:'transperant'  }}
            className="mt-3"
          >
            <div className="container-fluid">
              <div className="row align-items-center mb-4">
                {/* Select Frequency */}
                <div className="col-md-4">
                  <Form.Group className="mb-3" controlId="formSelectFrequency">
                    <Form.Label>Select Frequency</Form.Label>
                    <Form.Select name="frequency" value={frequency} onChange={handleChangeFrequency}>
                      <option value="7">Last Week</option>
                      <option value="30">Last Month</option>
                      <option value="365">Last Year</option>
                      <option value="custom">Custom</option>
                    </Form.Select>
                  </Form.Group>
                </div>

                {/* Select Type */}
                <div className="col-md-4">
                  <Form.Group className="mb-3" controlId="formSelectType">
                    <Form.Label>Type</Form.Label>
                    <Form.Select name="type" value={type} onChange={handleSetType}>
                      <option value="all">All</option>
                      <option value="expense">Expense</option>
                      <option value="credit">Income</option>
                    </Form.Select>
                  </Form.Group>
                </div>

                {/* Reset Button */}
                <div className="col-md-4 d-flex justify-content-end align-items-end">
                  <Button variant="success" onClick={handleReset}>
                    Reset Filter
                  </Button>
                </div>
              </div>

              {/* View Toggle Buttons */}
              <div className="row mt-5">
                <div className="col-md-11 d-flex justify-content-between align-items-center">
                  <div>
                    <Button onClick={handleShow} variant="success" className="addNew me-2">
                      Add New
                    </Button>
                    <Button onClick={handleShow} variant="success" className="mobileBtn">
                      +
                    </Button>
                  </div>
                </div>
                <div className="tb item-center text-white ms-3">
                    <FormatListBulletedIcon
                      sx={{ cursor: "pointer" }}
                      onClick={handleTableClick}
                      className={`${view === "table" ? "iconActive" : "iconDeactive"} mt-1 me-2 rounded-2`} 
                    />
                    <BarChartIcon
                      sx={{ cursor: "pointer" }}
                      onClick={handleChartClick}
                      className={`${view === "chart" ? "iconActive" : "iconDeactive"} mt-1 rounded-2`}

                    />
                  </div>
              </div>

              {/* Add Transaction Modal */}
              <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Add Transaction Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group className="mb-3" controlId="formName">
                          <Form.Label>Title</Form.Label>
                          <Form.Control
                            name="title"
                            type="text"
                            placeholder="Enter Transaction Name"
                            value={values.name}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group className="mb-3" controlId="formAmount">
                          <Form.Label>Amount</Form.Label>
                          <Form.Control
                            name="amount"
                            type="number"
                            placeholder="Enter Amount"
                            value={values.amount}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <Form.Group className="mb-3" controlId="formCategory">
                      <Form.Label>Category</Form.Label>
                      <Form.Select name="category" value={values.category} onChange={handleChange}>
                        <option value="">Choose...</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Rent">Rent</option>
                        <option value="Salary">Salary</option>
                        <option value="Tip">Tip</option>
                        <option value="Food">Food</option>
                        <option value="Medical">Medical</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formDescription">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        type="text"
                        name="description"
                        placeholder="Enter Description"
                        value={values.description}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formTransactionType">
                      <Form.Label>Transaction Type</Form.Label>
                      <Form.Select name="transactionType" value={values.transactionType} onChange={handleChange}>
                        <option value="">Choose...</option>
                        <option value="credit">Credit</option>
                        <option value="expense">Expense</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formDate">
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={values.date}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleSubmit}>
                    Submit
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>

            <br style={{ color: "white" }}></br>

            {frequency === "custom" ? (
              <>
                <div className="date">
                  <div className="form-group">
                    <label htmlFor="startDate" className="text-white">
                      Start Date:
                    </label>
                    <div>
                      <DatePicker
                        selected={startDate}
                        onChange={handleStartChange}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="endDate" className="text-white">
                      End Date:
                    </label>
                    <div>
                      <DatePicker
                        selected={endDate}
                        onChange={handleEndChange}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
            {view === "table" ? (
              <>
                <TableData data={transactions} user={cUser} />
              </>
            ) : (
              <>
                <Analytics transactions={transactions} user={cUser} />
              </>
            )}
            <ToastContainer />
          </Container>
        </>
      )}
    </>
  );
};

export default Home;
