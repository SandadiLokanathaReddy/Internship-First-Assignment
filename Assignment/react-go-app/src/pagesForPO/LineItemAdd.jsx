import React from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import logo from "../images/logo-fanatics.svg";

export const LineItemAdd = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { lineItem } = location.state;

	const [lineItemDetails, setLineItemDetails] = useState(lineItem);

	const createPOLineItemDetails = async (poli) => {
		const POST_URL = "http://localhost:5050/newpolineitem";
		await axios
			.post(POST_URL, poli)
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
		console.log("Submitted");
		createPOLineItemDetails(lineItemDetails);
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
				<h2>Line Item Details</h2>
				<form onSubmit={(e) => handleSubmit(e)} className="form">
					<div className="labels-container">
						<label className="label">
							<p className="text">Quantity</p>
							<input
								className="input-element"
								type="number"
								min="1"
								max="10000"
								value={lineItemDetails.quantity}
								required
								onChange={(e) =>
									setLineItemDetails({
										...lineItemDetails,
										quantity: e.target.value,
									})
								}
							/>
						</label>
						<label className="label">
							<p className="text">Description</p>
							<input
								className="input-element"
								type="text"
								value={lineItemDetails.description}
								required
								onChange={(e) =>
									setLineItemDetails({
										...lineItemDetails,
										description: e.target.value,
									})
								}
							/>
						</label>
						<label className="label">
							<p className="text">Material Code</p>
							<input
								className="input-element"
								type="text"
								pattern="[A-Za-z0-9]{8}"
								title="Code is a 8 letter alphanumeric text"
								value={lineItemDetails.materialcode}
								required
								onChange={(e) =>
									setLineItemDetails({
										...lineItemDetails,
										materialcode: e.target.value,
									})
								}
							/>
						</label>
						<label className="label">
							<p className="text">Color</p>
							<input
								className="input-element"
								type="text"
								value={lineItemDetails.color}
								required
								onChange={(e) =>
									setLineItemDetails({
										...lineItemDetails,
										color: e.target.value,
									})
								}
							/>
						</label>
						<label className="label">
							<p className="text">Width</p>
							<input
								className="input-element"
								type="number"
								step="0.00001"
								min="0"
								max="100"
								value={lineItemDetails.width}
								required
								onChange={(e) =>
									setLineItemDetails({
										...lineItemDetails,
										width: e.target.value,
									})
								}
							/>
						</label>
						<label className="label">
							<p className="text">Length</p>
							<input
								className="input-element"
								type="number"
								step="0.00001"
								min="0"
								max="100"
								value={lineItemDetails.length}
								required
								onChange={(e) =>
									setLineItemDetails({
										...lineItemDetails,
										length: e.target.value,
									})
								}
							/>
						</label>
						<label className="label">
							<p className="text">Product Id</p>
							<input
								className="input-element"
								type="text"
								pattern="[A-Za-z0-9]{8}"
								title="Product Id is a 8 letter alphanumeric text"
								value={lineItemDetails.productid}
								required
								onChange={(e) =>
									setLineItemDetails({
										...lineItemDetails,
										productid: e.target.value,
									})
								}
							/>
						</label>
						<label className="label">
							<p className="text">Due Date</p>
							<input
								className="input-element"
								type="date"
								required
								value={lineItemDetails.duedate}
								onChange={(e) =>
									setLineItemDetails({
										...lineItemDetails,
										duedate: e.target.value,
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
					font-size: 22px;
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
						font-size: 18px;
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
