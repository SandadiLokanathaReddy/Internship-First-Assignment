import React from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../images/logo-fanatics.svg";

export const PODetails = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { poHeader, poLineItems } = location.state;
	poLineItems.sort((a, b) => {
		// sorting in the ascending order of ids of lineItems in the DB
		return parseInt(a.id) - parseInt(b.id);
	});
	const {
		ponumber,
		poagent,
		supplierid,
		suppliername,
		shipviaservice,
		contactname,
		issuedate,
	} = poHeader;
	const headerKeys = [
		"PO Number",
		"PO Agent",
		"Supplier Id",
		"Supplier Name",
		"Ship Via Service",
		"Contact Name",
		"Issue Date",
	];
	const headerValues = [
		ponumber,
		poagent,
		supplierid,
		suppliername,
		shipviaservice,
		contactname,
		issuedate,
	];
	// const supplierIds = ["CR001", "JS123", "KT818", "AR111"];

	const addLineItem = (e) => {
		const lineItem = {
			poNumber: ponumber,
			quantity: "",
			description: "",
			materialcode: "",
			color: "",
			length: "",
			width: "",
			productid: "",
			duedate: "",
		};
		const params = {
			state: {
				ponumber,
				lineItem,
				add: true,
				edit: false,
			},
		};
		navigate("/lineitem", params);
	};

	const editHeader = (e) => {
		const params = {
			state: {
				poHeader,
			},
		};
		navigate("/header", params);
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
				<div onSubmit={(e) => e.preventDefault()} className="form">
					<h2 className="header-heading">Header Details</h2>
					<hr />
					<div className="labels-container">
						{headerKeys.map((key, ind) => {
							return (
								<label className="label" key={ind}>
									<p className="text">{key}</p>
									<input
										className="input-element"
										value={headerValues[ind]}
										disabled
									/>
								</label>
							);
						})}
					</div>

					<button
						className="btn fan-button mt-5 mb-4"
						onClick={(e) => editHeader(e)}
					>
						Edit Header
					</button>
				</div>
			</div>

			<div className="container2">
				<div className="line-items-container">
					<h2 className="li-heading">Line Items</h2>
					<ul className="line-items-list">
						{poLineItems.map((lineItem, ind) => {
							const lineItemPath = `${location.pathname}/lineitem`;
							return (
								<li className="line-item" key={ind}>
									<Link
										to={lineItemPath}
										state={{ ponumber, lineItem }}
										style={{
											textDecoration: "none",
										}}
									>
										<h3 className="line-item-heading">
											Line Item <span>{ind + 1}</span>
										</h3>
									</Link>
								</li>
							);
						})}
					</ul>
				</div>
				<div className="button-container">
					<button
						className="btn fan-button mt-1"
						onClick={(e) => addLineItem(e)}
					>
						Add LineItem
					</button>
				</div>
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
		.header-heading {
			font-size: 33px;
			font-weight: 600;
			font-family: Tahoma, Verdana, sans-serif;
			color: #08084bea;
		}
		.form {
			border: solid 1px;
			padding: 10px;
			width: 60%;
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
					font-size: 23px;
					font-weight: 600;
					border: solid 0px burlywood;
					.text {
						text-align: left;
						display: inline-block;
						width: 200px;
						min-width: 50px;
					}
					.input-element {
						width: 333px;
						height: 40px;
						font-size: 20px;
					}
				}
			}
			.button-container {
				margin: 50px 10px;
			}
			.fan-button {
				background-color: rgb(28, 84, 197);
				border-color: rgb(28, 84, 197);
				color: white;
			}
		}
	}

	.container2 {
		border: solid 0px;
		padding: 20px;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		.li-heading {
			font-size: 30px;
			font-weight: 600;
			font-family: Tahoma, Verdana, sans-serif;
			color: #08084bea;
		}
		.line-items-container {
			border: solid 0px;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			.line-items-list {
				list-style-type: none;
				padding: 0;
				.line-item {
					margin: 15px 0;
					.line-item-heading {
						font-size: 25px;
					}
				}
			}
		}
		.button-container {
			border: solid 0px;
		}
		.fan-button {
			background-color: rgb(28, 84, 197);
			border-color: rgb(28, 84, 197);
			color: white;
			font-family: "Trebuchet MS", sans-serif;
		}
	}
`;
