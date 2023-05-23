import React from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const UpdateSuccess = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { message } = location.state;

	useEffect(() => {
		setTimeout(() => {
			navigate("/userhome", { replace: true });
		}, 3000);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Container>
			<div className="message-container">
				<h2 className="message mb-15">{message}</h2>
				<span className="id">
					{"("}If provided id is invalid, then no changes will be made
					to the database{")"}
				</span>
			</div>
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
			font-size: 36px;
			font-weight: 600;
		}
		.id {
			color: #409809;
			font-size: 30px;
			font-weight: 500;
		}
	}
	.mb-15 {
		margin-bottom: 15px;
	}
`;
