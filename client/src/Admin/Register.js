import React, { useEffect } from "react";
import {
  Form,
  FormGroup,
  Label,
  Button,
  Container,
  Row,
  Input,
  Col,
} from "reactstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { userSchemaValidation } from "../Validations/UserValidations";
import { registerUser, reset } from "../Features/UserSlice";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, isSuccess, isError } = useSelector((state) => state.users);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm({
    resolver: yupResolver(userSchemaValidation),
  });

  const onSubmit = (data) => {
    console.log("Submitting data:", data); // DEBUG
    dispatch(registerUser(data));
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("User registered successfully!");
      resetForm();
      navigate("/login");
      dispatch(reset());
    }
    if (isError) {
      toast.error("Registration failed. Please check your input.");
      dispatch(reset());
    }
  }, [isSuccess, isError, dispatch, navigate, resetForm]);

  return (
    <div className="mt-4">
      <Row className="justify-content-center">
        <Col md="7">
          <h1 className="mb-4 text-center">Register</h1>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label>ID</Label>
              <Input {...register("id")} />
              <p className="text-danger">{errors.id?.message}</p>
            </FormGroup>

            <FormGroup>
              <Label>Name</Label>
              <Input {...register("name")} />
              <p className="text-danger">{errors.name?.message}</p>
            </FormGroup>

            <FormGroup>
              <Label>Gender</Label>
              <Input type="select" {...register("gender")}>
                <option value="">Select</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </Input>
              <p className="text-danger">{errors.gender?.message}</p>
            </FormGroup>

            <FormGroup>
              <Label>Civil Number</Label>
              <Input {...register("civilNumber")} />
              <p className="text-danger">{errors.civilNumber?.message}</p>
            </FormGroup>

            <FormGroup>
              <Label>Birth Date</Label>
              <Input type="date" {...register("birthDate")} />
              <p className="text-danger">{errors.birthDate?.message}</p>
            </FormGroup>

            <FormGroup>
              <Label>Contact No</Label>
              <Input {...register("contactNo")} />
              <p className="text-danger">{errors.contactNo?.message}</p>
            </FormGroup>

            <FormGroup>
              <Label>Email</Label>
              <Input type="email" {...register("email")} />
              <p className="text-danger">{errors.email?.message}</p>
            </FormGroup>

            <FormGroup>
              <Label>Department</Label>
              <Input {...register("department")} />
              <p className="text-danger">{errors.department?.message}</p>
            </FormGroup>

            <FormGroup>
              <Label>Specialization</Label>
              <Input {...register("specialization")} />
              <p className="text-danger">{errors.specialization?.message}</p>
            </FormGroup>

            <FormGroup>
              <Label>User Type</Label>
              <Input type="select" {...register("userType")}>
                <option value="">Select</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
                <option value="Nurse">Nurse</option>
              </Input>
              <p className="text-danger">{errors.userType?.message}</p>
            </FormGroup>

            <FormGroup>
              <Label>Password</Label>
              <Input type="password" {...register("password")} />
              <p className="text-danger">{errors.password?.message}</p>
            </FormGroup>

            <FormGroup>
              <Label>Confirm Password</Label>
              <Input type="password" {...register("confirmPassword")} />
              <p className="text-danger">{errors.confirmPassword?.message}</p>
            </FormGroup>

            <Button color="primary" size="lg" block disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
