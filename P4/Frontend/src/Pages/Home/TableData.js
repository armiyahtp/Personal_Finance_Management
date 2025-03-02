import React, { useEffect, useState } from "react";
import { Button, Container, Form, Modal, Table, Row, Col } from "react-bootstrap";
import moment from "moment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./home.css";
import { deleteTransactions, editTransactions} from "../../utils/ApiRequest";
import axios from "axios";

const TableData = (props) => {
  const [show, setShow] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [currId, setCurrId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedTransactions, setSelectedTransactions] = useState([]);

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  useEffect(() => {
    setUser(props.user);
    setTransactions(props.data);
  }, [props.data, props.user, refresh]);

  // Open modal and populate form fields
  const handleEditClick = (itemId) => {
    const editTran = transactions.find((item) => item._id === itemId);
    if (editTran) {
      setCurrId(itemId);
      setEditingTransaction(editTran);
      setValues({
        title: editTran.title || "",
        amount: editTran.amount || "",
        description: editTran.description || "",
        category: editTran.category || "",
        date: moment(editTran.date).format("YYYY-MM-DD") || "",
        transactionType: editTran.transactionType || "",
      });
      setShow(true);
    }
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`${editTransactions}/${currId}`, values);
      if (data.success) {
        setShow(false);
        setRefresh((prev) => !prev);
      } else {
        console.error("Edit transaction failed.");
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  useEffect(() => {
    setUser(props.user);
    setTransactions(props.data);
  }, [props.data, props.user, refresh])

  const handleSelectAll = () => {
    if (selectedTransactions.length === transactions.length) {
      setSelectedTransactions([]); // Deselect all
    } else {
      setSelectedTransactions(transactions.map((item) => item._id)); // Select all
    }
  };

  const handleCheckboxChange = (itemId) => {
    setSelectedTransactions((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId) // Remove if already selected
        : [...prev, itemId] // Add if not selected
    );
  };

  // Handle delete transaction
  const handleDeleteClick = async (itemId) => {
    try {
      const { data } = await axios.post(`${deleteTransactions}/${itemId}`, {
        userId: user?._id,
      });
  
      if (data.success) {
        // Remove the deleted transaction from the state
        setTransactions((prevTransactions) => prevTransactions.filter(item => item._id !== itemId));
      } else {
        console.error("Delete transaction failed.");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handlemulDeleteClick = async () => {
    if (!Array.isArray(selectedTransactions) || selectedTransactions.length === 0) {
      console.error("No transactions selected for deletion.");
      return;
    }
  
    if (!user?._id) {
      console.error("User ID is missing.");
      return;
    }
  
    try {
      const { data } = await axios.post("http://localhost:4000/api/v1/deletemulTransactions", {
        transactionIds: selectedTransactions,
        userId: user._id,
      });
  
      if (data.success) {
        setTransactions((prevTransactions) =>
          prevTransactions.filter(item => !selectedTransactions.includes(item._id))
        );
        
      } else {
        console.error("Delete multiple transactions failed.");
      }
    } catch (error) {
      console.error("Error deleting transactions:", error);
    }
  };
  
  

  return (
    <Container>
      <Table responsive="md" className="data-table text-black shadow-lg">
        <thead className="text-white">
          <tr>
          <th>
              <input
                type="checkbox"
                checked={selectedTransactions.length === transactions.length}
                onChange={handleSelectAll}
              />
            </th>
            <th>Date</th>
            <th>Title</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Category</th>
            <th>Action</th>
            <th> 
              <DeleteForeverIcon
                  sx={{
                    color: selectedTransactions.length > 0 ? "white" : "gray",
                    cursor: selectedTransactions.length > 0 ? "pointer" : "not-allowed",
                  }}
                  onClick={selectedTransactions.length > 0 ? handlemulDeleteClick : null}
             /> 
            </th>
          </tr>
        </thead>
        <tbody className="text-black">
          {transactions.map((item, index) => (
            <tr key={index}>
               <td>
                <input
                  type="checkbox"
                  checked={selectedTransactions.includes(item._id)}
                  onChange={() => handleCheckboxChange(item._id)}
                />
              </td>
              <td>{moment(item.date).format("YYYY-MM-DD")}</td>
              <td>{item.title}</td>
              <td>{item.amount}</td>
              <td>{item.transactionType}</td>
              <td>{item.category}</td>
              <td>
                <div className="icons-handle">
                  <EditNoteIcon
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleEditClick(item._id)}
                  />
                  <DeleteForeverIcon
                    sx={{ color: "red", cursor: "pointer" }}
                    onClick={() => handleDeleteClick(item._id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {editingTransaction && (
        <Modal show={show} onHide={() => setShow(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Update Transaction Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEditSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      name="title"
                      type="text"
                      value={values.title}
                      onChange={(e) => setValues({ ...values, title: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      name="amount"
                      type="number"
                      value={values.amount}
                      onChange={(e) => setValues({ ...values, amount: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={values.category}
                  onChange={(e) => setValues({ ...values, category: e.target.value })}
                  required
                >
                  <option value="" disabled>Select Category</option>
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

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={values.description}
                  onChange={(e) => setValues({ ...values, description: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Transaction Type</Form.Label>
                <Form.Select
                  name="transactionType"
                  value={values.transactionType}
                  onChange={(e) => setValues({ ...values, transactionType: e.target.value })}
                  required
                >
                  <option value="" disabled>Select Type</option>
                  <option value="Credit">Credit</option>
                  <option value="Expense">Expense</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={values.date}
                  onChange={(e) => setValues({ ...values, date: e.target.value })}
                  required
                />
              </Form.Group>

              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                  Close
                </Button>
                <Button variant="primary" type="submit">
                  Update Transaction
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};

export default TableData;
