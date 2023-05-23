import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../images/logo-fanatics.svg";

export const LineItem = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { ponumber, lineItem } = location.state;
	const {
		color,
		description,
		duedate,
		// id,
		// ponumber,
		length,
		width,
		materialcode,
		quantity,
		productid,
	} = lineItem;
	const lineItemValues = [
		quantity,
		description,
		materialcode,
		color,
		width,
		length,
		productid,
		duedate,
	];
	const lineItemKeys = [
		"Quantity",
		"Description",
		"Material Code",
		"Color",
		"Width",
		"Length",
		"Product Id",
		"Due Date",
	];

	const onClickEdit = (e) => {
		const params = {
			state: {
				ponumber,
				lineItem,
				edit: true,
				add: false,
			},
		};
		navigate(`/lineitem`, params);
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
			<div className="cont">
				<h2 className="heading">Line Item Details</h2>
				<hr />
				{lineItemKeys.map((key, ind) => {
					return (
						<p key={ind}>
							<span className="lhs">{key}</span>{" "}
							<span className="rhs">{lineItemValues[ind]}</span>
						</p>
					);
				})}
			</div>
			<button
				className="btn fan-button button"
				onClick={(e) => onClickEdit(e)}
			>
				Edit
			</button>
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

	.cont {
		margin: 25px;
		padding: 20px 35px;
		display: inline-block;
		border: solid 1px black;
		.heading {
			font-family: Tahoma, Verdana, sans-serif;
			color: #08084bea;
			font-size: 36px;
			font-weight: 600;
			margin-bottom: 15px;
		}
		p {
			padding: 2px;
			font-size: 24px;
			font-weight: 400;
			.lhs {
				color: black;
				display: inline-block;
				width: 170px;
			}
			.rhs {
				color: blue;
				font-size: 22px;
				font-weight: 600;
			}
		}
	}

	.fan-button {
		background-color: rgb(28, 84, 197);
		border-color: rgb(28, 84, 197);
		color: white;
		font-family: "Trebuchet MS", sans-serif;
	}

	.button {
		display: block;
		width: 90px;
		margin: 20px 25px;
	}
`;
