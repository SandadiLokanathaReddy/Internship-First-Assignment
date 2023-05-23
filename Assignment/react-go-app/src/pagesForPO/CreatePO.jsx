import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../images/logo-fanatics.svg";

export const CreatePO = () => {
	const navigate = useNavigate();
	const supplierIds = ["CR001", "JS123", "KT818", "AR111"];
	const shippingServies = [
		"E-Kart",
		"FedEx",
		"DTDC",
		"Blue Dart",
		"Delhivery",
	];
	const [poHeaderDetails, setPOHeaderDetails] = useState({
		poAgent: "",
		supplierId: "",
		shipViaService: "",
		contactName: "",
		issueDate: "",
	});
	const [supplierIdErr, setSupplierIdErr] = useState("");
	const [svsErr, setSvsErr] = useState("");

	const supplierIdValidate = (sid) => {
		return sid.length > 0;
	};
	const svsValidate = (service) => {
		return service.length > 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!supplierIdValidate(poHeaderDetails.supplierId)) {
			setSupplierIdErr("Please select a valid supplier id ");
			return;
		}
		if (!svsValidate(poHeaderDetails.shipViaService)) {
			setSvsErr("Please select a shipping service ");
			return;
		}
		const poh = {
			poagent: poHeaderDetails.poAgent,
			supplierid: poHeaderDetails.supplierId,
			shipviaservice: poHeaderDetails.shipViaService,
			contactname: poHeaderDetails.contactName,
			issuedate: poHeaderDetails.issueDate,
		};
		savePOHeaderDetails(poh);
	};

	const savePOHeaderDetails = async (poh) => {
		const POST_URL = "http://localhost:5050/newpoheader";
		await axios
			.post(POST_URL, poh)
			.then((response) => {
				const { ponumber, message } = response.data;
				const params = {
					state: {
						ponumber,
						message,
					},
				};
				navigate("/successmessage", params);
			})
			.catch((err) => {
				const statusCode = err.request.status;
				const resp = err.request.response;
				const message = JSON.parse(resp).message;
				const params = {
					state: { statusCode: statusCode, message: message },
				};
				navigate("/error", params);
			});
	};

	return (
		<Container>
			<div className="header-container">
				<img src={logo} alt="Fanatics Logo" className="fanatics-logo" />
				<div className="header">
					<h1 className="heading">FANATICS</h1>
					<h2 className="sub-heading">PO DETAILS</h2>
				</div>
			</div>
			<div className="form-container">
				<form onSubmit={(e) => handleSubmit(e)} className="form">
					<h2 className="header-heading">Header Details</h2>
					<hr />
					<div className="labels-container">
						<label className="label">
							<p className="text">PO Agent</p>
							<input
								className="input-element"
								type="name"
								value={poHeaderDetails.poAgent}
								required
								pattern="[a-zA-Z ]{1,30}"
								title="PO Agent should contain lowercase, uppercase letters and spaces"
								onChange={(e) =>
									setPOHeaderDetails({
										...poHeaderDetails,
										poAgent: e.target.value,
									})
								}
							/>
						</label>
						<label
							className="label"
							style={{ marginBottom: "5px" }}
						>
							<p className="text">Supplier ID</p>
							<select
								className="input-element"
								required
								onChange={(e) => {
									if (supplierIdValidate(e.target.value)) {
										setSupplierIdErr("");
										setPOHeaderDetails({
											...poHeaderDetails,
											supplierId: e.target.value,
										});
									} else {
										setSupplierIdErr(
											"Please select a valid supplier id "
										);
									}
								}}
							>
								<option hidden disabled selected value>
									{" "}
									-- select an option --{" "}
								</option>
								{supplierIds.map((id, ind) => {
									return (
										<option value={id} key={ind}>
											{id}
										</option>
									);
								})}
							</select>
						</label>
						<span className="error-message">{supplierIdErr}</span>

						<label
							className="label"
							style={{ marginBottom: "5px" }}
						>
							<p className="text">Ship Via Service</p>
							<select
								className="input-element"
								required
								onChange={(e) => {
									if (svsValidate(e.target.value)) {
										setSvsErr("");
										setPOHeaderDetails({
											...poHeaderDetails,
											shipViaService: e.target.value,
										});
									} else {
										setSvsErr(
											"Please select a shipping service "
										);
									}
								}}
							>
								<option hidden disabled selected value>
									{" "}
									-- select an option --{" "}
								</option>
								{shippingServies.map((id, ind) => {
									return (
										<option value={id} key={ind}>
											{id}
										</option>
									);
								})}
							</select>
						</label>
						<span className="error-message">{svsErr}</span>

						<label className="label">
							<p className="text">Contact Name</p>
							<input
								className="input-element"
								type="name"
								value={poHeaderDetails.contactName}
								required
								pattern="[a-zA-Z ]{1,30}"
								title="Contact name should contain lowercase, uppercase letters and spaces"
								onChange={(e) =>
									setPOHeaderDetails({
										...poHeaderDetails,
										contactName: e.target.value,
									})
								}
							/>
						</label>
						<label className="label">
							<p className="text">Issue Date</p>
							<input
								className="input-element"
								type="date"
								required
								value={poHeaderDetails.issueDate}
								onChange={(e) =>
									setPOHeaderDetails({
										...poHeaderDetails,
										issueDate: e.target.value,
									})
								}
							/>
						</label>
					</div>
					<button className="btn fan-button mt-5 mb-4" type="submit">
						Save Header
					</button>
				</form>
			</div>
		</Container>
	);
};

const Container = styled.div`
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
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.header-heading {
			font-size: 33px;
			font-weight: 600;
			font-family: Tahoma, Verdana, sans-serif;
			color: #08084bea;
		}
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
					font-size: 23px;
					font-weight: 600;
					border: solid 0px burlywood;
					.text {
						text-align: left;
						display: inline-block;
						width: 180px;
						min-width: 50px;
					}
					.input-element {
						width: 333px;
						height: 40px;
						font-size: 20px;
					}
				}
				.error-message {
					color: red;
					font-size: 15px;
					margin: 0px;
					padding: 0px;
				}
			}
			.fan-button {
				background-color: rgb(28, 84, 197);
				border-color: rgb(28, 84, 197);
				color: white;
				font-family: "Trebuchet MS", sans-serif;
			}
		}
	}
`;
