import { combineReducers } from "redux";
import { charityPrograms } from "./charityPrograms.reducer";
import { donationPreferences } from "./donationPreferences.reducer";
import { corporates } from "./corporates.reducer";
import { employee } from "./employees.reducer";
import { alert } from "./alert.reducer";

const rootReducer = combineReducers({
  alert,
  corporates,
  employee,
  charityPrograms,
  donationPreferences,
});

export default rootReducer;
