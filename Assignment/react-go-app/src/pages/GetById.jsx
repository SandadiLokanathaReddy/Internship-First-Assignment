import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export const GetById = () => {
	const [id, setId] = useState("");
	const navigate = useNavigate();
	const location = useLocation();

	const handleSubmit = (e) => {
		e.preventDefault();
		getUser(id);
	};

	const getUser = async (userid) => {
		const GET_URL = `http://localhost:5050/userid/${userid}`;
		await axios
			.get(GET_URL)
			.then((response) => {
				// console.log(response.data);
				const { name, email, phone, id, dept } = response.data;
				const params = {
					state: {
						name: name,
						email: email,
						phone: phone,
						id: id,
						dept: dept,
					},
				};
				navigate(`${location.pathname}/details`, params);
			})
			.catch((err) => {
				const statusCode = err.request.status;
				if (statusCode === 404) {
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
			<h2 className="heading mb-30">Search Using The UserId</h2>
			<form onSubmit={(e) => handleSubmit(e)}>
				<label className="label mb-30">
					UserId {"  "} : {"  "}
					<input
						required
						pattern="[1]{1}[0-9]{3}"
						title="Id is a four digit number beginning from 1001"
						className="input-element"
						value={id}
						onChange={(e) => setId(e.target.value)}
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
