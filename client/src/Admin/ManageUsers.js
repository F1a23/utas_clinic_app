import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Table,
  Input,
  Form,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";
import { SERVER_URL } from "../config";
import "../Styles/ManageUsers.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const user = useSelector((state) => state.users?.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.userType !== "Admin") {
      navigate("/unauthorized");
    }
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/getUsers`);
      setUsers(res.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${SERVER_URL}/deleteUser/${id}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser({ ...user });
  };

  const handleUpdateChange = (field, value) => {
    setEditingUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${SERVER_URL}/updateUser/${editingUser._id}`,
        editingUser
      );
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error(
        "Error updating user:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.civilNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.contactNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid className="users-main-container">
      <h2 className="users-page-title"> Manage Users</h2>
      <Input
        type="text"
        placeholder="🔍 Search by Civil Number or Contact Number"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="users-search-input"
      />

      <Table responsive className="users-table">
        <thead className="users-table-header">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>User Type</th>
            <th>Gender</th>
            <th>Civil Number</th>
            <th>Birth Date</th>
            <th>Contact No</th>
            <th>Department</th>
            <th>Specialization</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u._id} className="users-table-row">
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.userType}</td>
              <td>{u.gender}</td>
              <td>{u.civilNumber}</td>
              <td>{new Date(u.birthDate).toLocaleDateString()}</td>
              <td>{u.contactNo}</td>
              <td>{u.department}</td>
              <td>{u.specialization}</td>
              <td>
                <Button
                  className="users-btn users-btn-delete"
                  onClick={() => deleteUser(u._id)}
                >
                  Delete
                </Button>
                <Button
                  className="users-btn users-btn-edit"
                  onClick={() => handleEdit(u)}
                >
                  Update
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {editingUser && (
        <div className="users-edit-overlay">
          <Card className="users-edit-modal">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <CardTitle tag="h5" className="users-edit-title">
                  Update User: {editingUser.name}
                </CardTitle>
                <Button close onClick={() => setEditingUser(null)} />
              </div>
              <Form onSubmit={handleUpdateSubmit}>
                <Row className="mb-3">
                  <Col md={4}>
                    <Input
                      value={editingUser.name}
                      onChange={(e) =>
                        handleUpdateChange("name", e.target.value)
                      }
                      placeholder="Full Name"
                    />
                  </Col>
                  <Col md={4}>
                    <Input
                      value={editingUser.email}
                      onChange={(e) =>
                        handleUpdateChange("email", e.target.value)
                      }
                      placeholder="Email"
                      type="email"
                    />
                  </Col>
                  <Col md={4}>
                    <Input
                      type="select"
                      value={editingUser.userType}
                      onChange={(e) =>
                        handleUpdateChange("userType", e.target.value)
                      }
                    >
                      <option>User</option>
                      <option>Admin</option>
                      <option>Nurse</option>
                    </Input>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={4}>
                    <Input
                      type="select"
                      value={editingUser.gender}
                      onChange={(e) =>
                        handleUpdateChange("gender", e.target.value)
                      }
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </Input>
                  </Col>
                  <Col md={4}>
                    <Input
                      value={editingUser.civilNumber}
                      onChange={(e) =>
                        handleUpdateChange("civilNumber", e.target.value)
                      }
                      placeholder="Civil Number"
                    />
                  </Col>
                  <Col md={4}>
                    <Input
                      type="date"
                      value={editingUser.birthDate?.slice(0, 10)}
                      onChange={(e) =>
                        handleUpdateChange("birthDate", e.target.value)
                      }
                    />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={4}>
                    <Input
                      value={editingUser.contactNo}
                      onChange={(e) =>
                        handleUpdateChange("contactNo", e.target.value)
                      }
                      placeholder="Contact Number"
                    />
                  </Col>
                  <Col md={4}>
                    <Input
                      value={editingUser.department}
                      onChange={(e) =>
                        handleUpdateChange("department", e.target.value)
                      }
                      placeholder="Department"
                    />
                  </Col>
                  <Col md={4}>
                    <Input
                      value={editingUser.specialization}
                      onChange={(e) =>
                        handleUpdateChange("specialization", e.target.value)
                      }
                      placeholder="Specialization"
                    />
                  </Col>
                </Row>
                <div className="text-end">
                  <Button type="submit" className="users-btn users-btn-save">
                    Save Changes
                  </Button>{" "}
                  <Button
                    className="users-btn users-btn-cancel"
                    onClick={() => setEditingUser(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </div>
      )}
    </Container>
  );
};

export default ManageUsers;
