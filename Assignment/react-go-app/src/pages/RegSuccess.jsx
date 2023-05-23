import React from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const RegSuccess = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { message, id } = location.state;

	useEffect(() => {
		setTimeout(() => {
			navigate("/userhome", { replace: true });
		}, 2500);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const updateMessage = (message) => {
		return (
			<div className="message-container">
				<h2 className="message mb-15">{message}</h2>
				<span className="id">
					{"("}If provided id is invalid, then no changes will be made
					to the database{")"}
				</span>
			</div>
		);
	};
	const regMessage = (message, id) => {
		return (
			<div className="message-container">
				<h2 className="message mb-15">{message}</h2>
				<span className="id">
					Registered User Id :{" "}
					<span style={{ textDecoration: "underline" }}>{id}</span>
				</span>
			</div>
		);
	};

	return (
		<Container>
			{id ? regMessage(message, id) : updateMessage(message)}
		</Container>
	);
};

const Container = styled.div`
	margin: 20px;
	.message-container {
		height: 60vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.message {
			color: #238c23;
			font-size: 40px;
			font-weight: 600;
		}
		.id {
			color: #409809;
			font-size: 35px;
			font-weight: 500;
		}
	}
	.mb-15 {
		margin-bottom: 15px;
	}
`;
