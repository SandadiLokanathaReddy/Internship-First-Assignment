import React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import logo from "../images/logo-fanatics.svg";

export const UserDetails = () => {
	const location = useLocation();
	const { name, email, phone, id, dept } = location.state;
	return (
		<Container>
			<div className="header-container">
				<img src={logo} alt="Fanatics Logo" className="fanatics-logo" />
				<div className="header">
					<h1 className="heading">FANATICS</h1>
					<h2 className="sub-heading">USER DETAILS</h2>
				</div>
			</div>
			<div className="cont">
				<h2 className="heading">Requested User Details</h2>
				<hr />
				<p>
					<span className="lhs"> Name </span>{" "}
					<span className="rhs">{name}</span>
				</p>
				<p>
					<span className="lhs">Id </span>{" "}
					<span className="rhs">{id}</span>
				</p>
				<p>
					<span className="lhs"> Email </span>{" "}
					<span className="rhs">{email}</span>
				</p>
				<p>
					<span className="lhs">Phone </span>{" "}
					<span className="rhs">{phone}</span>
				</p>
				<p>
					<span className="lhs">Dept </span>{" "}
					<span className="rhs">{dept}</span>
				</p>
			</div>
		</Container>
	);
};

const Container = styled.div`
	margin: 0px;
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
		padding: 20px;
		margin: 25px;
		display: inline-block;
		border: solid 1px black;
	}
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
			width: 80px;
		}
		.rhs {
			color: blue;
			font-size: 22px;
			font-weight: 600;
		}
	}
`;
