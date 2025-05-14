import {
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { updateUser } from "../Features/ManageUserSlice"; // تأكد من استيراد الأكشن الصحيح
import { userSchemaValidation } from "../Validations/UserValidations"; // تأكد من وجود ملف الفاليديشن

const UpdateUser = () => {
  const { id } = useParams();
  const users = useSelector((state) => state.manageUsers.allUsers);
  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userToUpdate = users.find((u) => u._id === id);

  const [name, setName] = useState(userToUpdate?.name || "");
  const [gender, setGender] = useState(userToUpdate?.gender || "");
  const [civilNumber, setCivilNumber] = useState(
    userToUpdate?.civilNumber || ""
  );
  const [birthDate, setBirthDate] = useState(
    userToUpdate?.birthDate?.split("T")[0] || ""
  );
  const [contactNo, setContactNo] = useState(userToUpdate?.contactNo || "");
  const [email, setEmail] = useState(userToUpdate?.email || "");
  const [department, setDepartment] = useState(userToUpdate?.department || "");
  const [specialization, setSpecialization] = useState(
    userToUpdate?.specialization || ""
  );
  const [userType, setUserType] = useState(userToUpdate?.userType || "User");
  const [password, setPassword] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchemaValidation),
  });

  const onSubmit = (data) => {
    try {
      const userData = {
        name: data.name,
        gender: data.gender,
        civilNumber: data.civilNumber,
        birthDate: data.birthDate,
        contactNo: data.contactNo,
        email: data.email,
        department: data.department,
        specialization: data.specialization,
        userType: data.userType,
        password: data.password,
      };

      dispatch(updateUser({ userData, id }));
      alert("User Updated Successfully.");
      navigate("/ManageUsers");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  useEffect(() => {
    if (!user.email) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <Container className="registration-container">
      <div className="form-wrapper">
        <h1 className="h1">Update User</h1>
        <Form onSubmit={handleSubmit(onSubmit)} className="form-box">
          <Row>
            <Col md={12}>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  {...register("name", {
                    onChange: (e) => setName(e.target.value),
                  })}
                  value={name}
                />
                <p className="error">{errors.name?.message}</p>
              </FormGroup>

              <FormGroup>
                <Label>Gender</Label>
                <Input
                  {...register("gender", {
                    onChange: (e) => setGender(e.target.value),
                  })}
                  value={gender}
                />
                <p className="error">{errors.gender?.message}</p>
              </FormGroup>

              <FormGroup>
                <Label>Civil Number</Label>
                <Input
                  {...register("civilNumber", {
                    onChange: (e) => setCivilNumber(e.target.value),
                  })}
                  value={civilNumber}
                />
                <p className="error">{errors.civilNumber?.message}</p>
              </FormGroup>

              <FormGroup>
                <Label>Birth Date</Label>
                <Input
                  type="date"
                  {...register("birthDate", {
                    onChange: (e) => setBirthDate(e.target.value),
                  })}
                  value={birthDate}
                />
                <p className="error">{errors.birthDate?.message}</p>
              </FormGroup>

              <FormGroup>
                <Label>Contact Number</Label>
                <Input
                  {...register("contactNo", {
                    onChange: (e) => setContactNo(e.target.value),
                  })}
                  value={contactNo}
                />
                <p className="error">{errors.contactNo?.message}</p>
              </FormGroup>

              <FormGroup>
                <Label>Email</Label>
                <Input
                  {...register("email", {
                    onChange: (e) => setEmail(e.target.value),
                  })}
                  value={email}
                />
                <p className="error">{errors.email?.message}</p>
              </FormGroup>

              <FormGroup>
                <Label>Department</Label>
                <Input
                  {...register("department", {
                    onChange: (e) => setDepartment(e.target.value),
                  })}
                  value={department}
                />
                <p className="error">{errors.department?.message}</p>
              </FormGroup>

              <FormGroup>
                <Label>Specialization</Label>
                <Input
                  {...register("specialization", {
                    onChange: (e) => setSpecialization(e.target.value),
                  })}
                  value={specialization}
                />
                <p className="error">{errors.specialization?.message}</p>
              </FormGroup>

              <FormGroup>
                <Label>User Type</Label>
                <Input
                  type="select"
                  {...register("userType", {
                    onChange: (e) => setUserType(e.target.value),
                  })}
                  value={userType}
                >
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                  <option value="Nurse">Nurse</option>
                </Input>
                <p className="error">{errors.userType?.message}</p>
              </FormGroup>

              <FormGroup>
                <Label>Password</Label>
                <Input
                  type="password"
                  {...register("password", {
                    onChange: (e) => setPassword(e.target.value),
                  })}
                  value={password}
                />
                <p className="error">{errors.password?.message}</p>
              </FormGroup>

              <Button color="primary" size="lg" type="submit">
                Save User
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </Container>
  );
};

export default UpdateUser;
