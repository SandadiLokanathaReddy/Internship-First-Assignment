import React from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

export const SuccessMessage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { message, ponumber } = location.state;

	const getPODetailsAndGoToPOPage = async (poNumber) => {
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

	useEffect(() => {
		setTimeout(() => {
			if (ponumber) {
				getPODetailsAndGoToPOPage(ponumber);
			} else {
				navigate("/ponumber", { replace: true });
			}
		}, 2500);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Container>
			<div className="message-container">
				<h2 className="message mb-15">{message}</h2>
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
			font-size: 40px;
			font-weight: 600;
		}
	}
	.mb-15 {
		margin-bottom: 15px;
	}
`;
