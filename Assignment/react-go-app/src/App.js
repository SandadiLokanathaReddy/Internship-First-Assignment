import { Routes, Route } from "react-router";
import { Home } from "./pages/Home";
// User page imports
import { UserHome } from "./pages/UserHome";
import { InputForm } from "./pages/InputForm";
import { GetByName } from "./pages/GetByName";
import { RegSuccess } from "./pages/RegSuccess";
import { UserDetails } from "./pages/UserDetails";
import { ErrorMessage } from "./pages/ErrorMessage";
import { UpdateForm } from "./pages/UpdateForm";
import { GetById } from "./pages/GetById";
// PO page imports
import { POHome } from "./pagesForPO/POHome";
import { CreatePO } from "./pagesForPO/CreatePO";
import { PODetails } from "./pagesForPO/PODetails";
import { GetByPONumber } from "./pagesForPO/GetByPONumber";
import { LineItem } from "./pagesForPO/LineItem";
import { LineItemAddEdit } from "./pagesForPO/LineItemAddEdit";
import { SuccessMessage } from "./pagesForPO/SuccessMessage";
import { HeaderEdit } from "./pagesForPO/HeaderEdit";

function App() {
	return (
		<>
			<Routes>
				<Route exact path="/" element={<Home />} />
				<Route exact path="/userhome" element={<UserHome />} />
				<Route exact path="/pohome" element={<POHome />} />
				<Route exact path="/error" element={<ErrorMessage />} />

				{/* Pages for User */}
				<Route exact path="/registeruser" element={<InputForm />} />
				<Route exact path="/updateuser" element={<UpdateForm />} />
				<Route exact path="/username">
					<Route index element={<GetByName />} />
					<Route path="details" element={<UserDetails />} />
				</Route>
				<Route exact path="/userid">
					<Route index element={<GetById />} />
					<Route path="details" element={<UserDetails />} />
				</Route>
				<Route exact path="/regsuccess" element={<RegSuccess />} />

				{/* Pages for PO */}
				<Route exact path="/createpo" element={<CreatePO />} />
				<Route exact path="/ponumber" element={<GetByPONumber />} />
				<Route path="podetails">
					<Route index element={<PODetails />} />
					<Route path="lineitem" element={<LineItem />} />
				</Route>
				<Route exact path="/lineitem" element={<LineItemAddEdit />} />
				<Route
					exact
					path="/successmessage"
					element={<SuccessMessage />}
				/>
				<Route exact path="/header" element={<HeaderEdit />} />
			</Routes>
		</>
	);
}

export default App;
