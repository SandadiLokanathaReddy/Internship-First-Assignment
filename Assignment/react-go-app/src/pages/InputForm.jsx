import React from "react";
import styled from "styled-components";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo-fanatics.svg";

export const InputForm = () => {
	const depts = ["brands", "crm", "datascience", "hr"];
	const navigate = useNavigate();
	const [details, setDetails] = useState({
		name: "",
		email: "",
		phone: "",
		dept: "",
	});
	const [mailErr, setMailErr] = useState("");
	const [deptErr, setDeptErr] = useState("");

	// emailValidation is different in updateForm and inputForm
	const emailValidation = (email) => {
		const regex =
			/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
		if (!email || regex.test(email) === false) {
			return false;
		}
		return true;
	};

	const deptValidate = (dept) => {
		return dept.length > 0;
	};

	const createNewUser = async (newUser) => {
		const POST_URL = "http://localhost:5050/newuser";
		await axios
			.post(POST_URL, newUser)
			.then((response) => {
				// console.log(response.data);
				const params = {
					state: {
						message: response.data.message,
						id: response.data.id,
					},
				};
				if (response.status === 200) {
					navigate("/regsuccess", params);
				}
			})
			.catch((err) => {
				const params = {
					state: {
						message: err.response.data,
					},
				};
				navigate("/error", params);
			});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!emailValidation(details.email)) {
			return;
		}
		if (!deptValidate(details.dept)) {
			setDeptErr("Please select a valid department");
			return;
		}
		const newUser = {
			name: details.name,
			email: details.email,
			phone: details.phone,
			dept: details.dept,
		};
		createNewUser(newUser);
	};

	return (
		<Container>
			<div className="header-container">
				<img src={logo} alt="Fanatics Logo" className="fanatics-logo" />
				<div className="header">
					<h1 className="heading">FANATICS</h1>
					<h2 className="sub-heading">REGISTRATION FORM</h2>
				</div>
			</div>
			<div className="form-container">
				<form onSubmit={(e) => handleSubmit(e)} className="form">
					<div className="labels-container">
						<label className="label">
							<p className="text">Name</p>
							<input
								className="input-element"
								type="name"
								value={details.name}
								required
								pattern="[a-zA-Z ]{1,30}"
								title="Username should only contain lowercase, uppercase letters and spaces"
								onChange={(e) =>
									setDetails({
										...details,
										name: e.target.value,
									})
								}
							/>
						</label>

						<label
							className="label"
							style={{ marginBottom: "5px" }}
						>
							<p className="text">Mail</p>
							<input
								className="input-element"
								type="email"
								value={details.email}
								required
								onChange={(e) => {
									if (!emailValidation(e.target.value)) {
										setMailErr("Enter valid email address");
									} else {
										setMailErr("");
									}
									setDetails({
										...details,
										email: e.target.value,
									});
								}}
							/>
						</label>
						<span className="error-message">{mailErr}</span>

						<label className="label">
							<p className="text">Phone</p>
							<input
								className="input-element"
								type="tel"
								pattern="[1-9]{1}[0-9]{9}"
								title="Enter a vaid 10 digit number"
								required
								value={details.phone}
								onChange={(e) =>
									setDetails({
										...details,
										phone: e.target.value,
									})
								}
							/>
						</label>

						<label
							className="label"
							style={{ marginBottom: "5px" }}
						>
							<p className="text">Dept</p>
							<select
								className="input-element"
								onChange={(e) => {
									if (deptValidate(e.target.value)) {
										setDeptErr("");
										setDetails({
											...details,
											dept: e.target.value,
										});
									} else {
										setDeptErr(
											"Please select a valid department"
										);
									}
								}}
							>
								<option hidden disabled selected value>
									{" "}
									-- select an option --{" "}
								</option>
								{depts.map((dept, ind) => {
									return (
										<option value={dept} key={ind}>
											{dept}
										</option>
									);
								})}
							</select>
						</label>
						<span className="error-message">{deptErr}</span>
					</div>

					<div className="button-container">
						<button className="btn fan-button" type="submit">
							Submit
						</button>
					</div>
				</form>
			</div>
		</Container>
	);
};

const Container = styled.div`
	margin: 0px;
	.header-container {
		background-color: rgb(9, 32, 63);
		padding: 10px;
		display: flex;
		justify-content: center;
		.fanatics-logo {
			width: 180px;
			height: 150px;
		}
		.header {
			margin: 5px 10px;
			padding: 5px 10px;
			text-align: center;
			.heading {
				font-weight: 800;
				font-size: 60px;
				color: rgb(255, 255, 255);
			}
			.sub-heading {
				font-weight: 800;
				font-size: 35px;
				color: rgb(255, 255, 255);
			}
		}
	}
	.form-container {
		border: solid 0px blue;
		padding: 50px 20px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		.form {
			border: solid 1px;
			padding: 10px;
			width: 50%;
			text-align: center;
			.labels-container {
				border: solid 0px red;
				padding: 5px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.label {
					margin: 10px;
					font-size: 22px;
					font-weight: 600;
					border: solid 0px burlywood;
					.text {
						text-align: left;
						display: inline-block;
						width: 80px;
						min-width: 50px;
						border: solid 0px;
					}
					.input-element {
						width: 333px;
						height: 40px;
					}
				}
			}
			.error-message {
				color: red;
				font-size: 15px;
				margin: 0px;
				padding: 0px;
			}
			.button-container {
				margin: 50px 10px;
			}
		}
		.fan-button {
			background-color: rgb(28, 84, 197);
			border-color: rgb(28, 84, 197);
			color: white;
			font-family: "Trebuchet MS", sans-serif;
		}
	}
`;
