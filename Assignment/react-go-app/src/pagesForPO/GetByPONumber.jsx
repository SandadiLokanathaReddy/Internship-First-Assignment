import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const GetByPONumber = () => {
	const [poNumber, setPONumber] = useState("");
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		getPODetails(poNumber);
	};

	const getPODetails = async (poNumber) => {
		const GET_URL = `http://localhost:5050/ponumber/${poNumber}`;
		await axios
			.get(GET_URL)
			.then((response) => {
				console.log(response.data);
				const { poHeader, poLineItems } = response.data;

				const params = {
					state: {
						poHeader,
						poLineItems,
					},
				};
				navigate(`/podetails`, params);
			})
			.catch((err) => {
				const statusCode = err.request.status;
				if (statusCode !== 200) {
					const resp = err.request.response;
					const message = JSON.parse(resp).message;
					const params = {
						state: { statusCode: statusCode, message: message },
					};
					navigate("/error", params);
				}
			});
	};

	return (
		<Container>
			<h2 className="heading mb-30">Search Using The PO Number</h2>
			<form onSubmit={(e) => handleSubmit(e)}>
				<label className="label mb-30">
					PO Number {"  "} : {"  "}
					<input
						required
						pattern="[2-9]{1}[0-9]{3}"
						title="PO Number is a four digit number beginning from 2001"
						className="input-element"
						value={poNumber}
						onChange={(e) => setPONumber(e.target.value)}
					/>
				</label>
				<br />
				<div style={{ textAlign: "center" }}>
					<button type="submit" className="btn fan-button mt-3">
						Submit
					</button>
				</div>
			</form>
		</Container>
	);
};

const Container = styled.div`
	margin: 20px;
	margin-top: 50px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	.heading {
		font-size: 38px;
		font-weight: 600;
		color: #08084bea;
	}
	form {
		.label {
			font-size: 24px;
			font-weight: 500;
			color: #08084bea;
			.input-element {
				width: 290px;
				height: 40px;
			}
		}
		.fan-button {
			background-color: rgb(28, 84, 197);
			border-color: rgb(28, 84, 197);
			color: white;
			font-family: "Trebuchet MS", sans-serif;
		}
	}
	.mb-30 {
		margin-bottom: 30px;
	}
`;
