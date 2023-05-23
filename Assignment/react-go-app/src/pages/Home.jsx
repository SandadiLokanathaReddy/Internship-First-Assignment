import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import logo from "../images/logo-fanatics.svg";

export const Home = () => {
	return (
		<Container>
			<div className="header-container">
				<img src={logo} alt="Fanatics Logo" className="fanatics-logo" />
				<div className="header">
					<h1 className="heading">FANATICS</h1>
					<h2 className="sub-heading">DATABASE</h2>
				</div>
			</div>
			<div className="sub-container">
				<div className="button-container">
					<h2 className="heading">For User Database</h2>
					<Link className="link" to="/userhome">
						<button className="btn fan-button mr-20 ml-20 wd-80">
							User Home
						</button>
					</Link>
				</div>
				<div className="button-container">
					<h2 className="heading">For PO Database</h2>
					<Link className="link" to="/pohome">
						<button className="btn fan-button mr-20 ml-20 wd-80">
							PO Home
						</button>
					</Link>
				</div>
			</div>
		</Container>
	);
};

const Container = styled.div`
	margin: 0;
	.header-container {
		background-color: rgb(9, 32, 63);
		padding: 10px;
		display: flex;
		flex-direction: row;
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
	.sub-container {
		border: solid 0px red;
		padding: 100px;
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: center;
		.button-container {
			border: solid 0px;
			padding: 10px;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: center;
			.heading {
				padding: 5px;
				color: rgb(9, 32, 63);
				font-size: 39px;
				font-family: "Trebuchet MS", sans-serif;
				font-weight: 600;
			}
			.link {
				margin: 10px;
			}
			.fan-button {
				background-color: rgb(28, 84, 197);
				border-color: rgb(28, 84, 197);
				color: white;
				font-family: "Trebuchet MS", sans-serif;
			}
		}
	}
`;
