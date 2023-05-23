import React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

export const ErrorMessage = () => {
	const location = useLocation();
	const { message, statusCode } = location.state;
	return (
		<Container>
			{statusCode && (
				<h2 className="heading mb-15">
					Status Code : <br />{" "}
					<span className="message">{statusCode}</span>
				</h2>
			)}
			<h2 className="heading">
				Error Message : <br />{" "}
				<span className="message">{message}</span>
			</h2>
		</Container>
	);
};

const Container = styled.div`
	margin: 20px;
	.heading {
		font-size: 28px;
	}
	.message {
		color: red;
		font-size: 36px;
		font-weight: 500;
	}
	.mb-15 {
		margin-bottom: 15px;
	}
`;
