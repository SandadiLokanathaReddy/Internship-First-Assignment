import React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import logo from "../images/logo-fanatics.svg";

export const HeaderEdit = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { poHeader } = location.state;

	const supplierIds = ["CR001", "JS123", "KT818", "AR111"];
	const shippingServies = [
		"E-Kart",
		"FedEx",
		"DTDC",
		"Blue Dart",
		"Delhivery",
	];

	const [poHeaderDetails, setpoHeaderDetails] = useState({
		poAgent: poHeader.poagent,
		supplierId: poHeader.supplierid,
		shipViaService: poHeader.shipviaservice,
		contactName: poHeader.contactname,
		issueDate: poHeader.issuedate,
	});

	const updateHeaderDetails = async (poh) => {
		// PUT Call to API 1 (Update is performed as Asynchronous Operation)
		const PUT_URL = "http://localhost:5000/updatepoheader";
		await axios
			.put(PUT_URL, poh)
			.then((response) => {
				const params = {
					state: {
						message: response.data.message,
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

	const handleSubmit = (e) => {
		e.preventDefault();
		const poh = {
			ponumber: poHeader.ponumber,
			poagent: poHeaderDetails.poAgent,
			supplierid: poHeaderDetails.supplierId,
			suppliername: "",
			shipviaservice: poHeaderDetails.shipViaService,
			contactname: poHeaderDetails.contactName,
			issuedate: poHeaderDetails.issueDate,
		};
		updateHeaderDetails(poh);
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
				<h2>Edit Header Details</h2>
				<form onSubmit={(e) => handleSubmit(e)} className="form">
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
									setpoHeaderDetails({
										...poHeaderDetails,
										poAgent: e.target.value,
									})
								}
							/>
						</label>
						<label className="label">
							<p className="text">Supplier ID</p>
							<select
								className="input-element"
								value={poHeaderDetails.supplierId}
								required
								onChange={(e) =>
									setpoHeaderDetails({
										...poHeaderDetails,
										supplierId: e.target.value,
									})
								}
							>
								{supplierIds.map((id, ind) => {
									return (
										<option value={id} key={ind}>
											{id}
										</option>
									);
								})}
							</select>
						</label>

						<label className="label">
							<p className="text">Ship Via Service</p>
							<select
								className="input-element"
								value={poHeaderDetails.shipViaService}
								required
								onChange={(e) =>
									setpoHeaderDetails({
										...poHeaderDetails,
										shipViaService: e.target.value,
									})
								}
							>
								{shippingServies.map((id, ind) => {
									return (
										<option value={id} key={ind}>
											{id}
										</option>
									);
								})}
							</select>
						</label>

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
									setpoHeaderDetails({
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
									setpoHeaderDetails({
										...poHeaderDetails,
										issueDate: e.target.value,
									})
								}
							/>
						</label>
					</div>
					<div className="button-container">
						<button className="btn fan-button" type="submit">
							Save
						</button>
					</div>
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
