import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DonateAmount from "./DonateAmount";
import { donationPreferenceActions } from "./../../actions";
import { donationPreferenceConstants } from "./../../constants";
import DonationConsent from "./../Shared/DonationConsent";
import { charityProgramConstants } from "./../../constants";
import DonateSecondStep from "./DonateSecondStep";

const preferenceForm = {
  corporateId: "",
  employeeId: "",
  charityProgramId: "",
  socialOrganizationId: "",
  donationAmount: "",
  frequency: "",
  isConsentCheck: "",
};
const Donate = ({ frequency, selectedCharity, tabType }) => {
  const employee = useSelector((state) => state.employee.user);
  const [selectedAmount, setSelectedAmount] = useState();
  useEffect(() => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>", selectedCharity?.unitPrice)
    setSelectedAmount(selectedCharity?.unitPrice)
    
  }, [selectedCharity?.unitPrice]);
  const [val, setVal] = useState();
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showNextStep, setShowNextStep] = useState(false);
  const handleCheck = () => {
    setChecked(true);
    setOpen(false);
  };
  const closeCheck = () => {
    setChecked(false);
    setOpen(false);
  };
  const setAmount = (amount) => {
    setSelectedAmount(amount);
  };
  const dispatch = useDispatch();
  const saveDonationPreference = () => {
    preferenceForm.corporateId = 30;
    preferenceForm.employeeId = 3;
    preferenceForm.charityProgramId = selectedCharity?.charityId;
    preferenceForm.socialOrganizationId = selectedCharity?.soicalId;
    preferenceForm.donationAmount = selectedAmount;
    preferenceForm.frequency =
      frequency === donationPreferenceConstants.MONTHLY ? 1 : 2;
    preferenceForm.isConsentCheck = true;
    dispatch(donationPreferenceActions.saveDonationPreference(preferenceForm));
    document.getElementById("sidepanel").classList.remove("is-open");
  };
  const nextStep = () => {
    setShowNextStep(!showNextStep)
  }
  return (
    <>
     {!showNextStep &&
     <>
      <div className="row mb-4">
        <div className="col-md-12">
          <span className="bi-lock-fill fs-5 text-success"></span>Choose an
          amount to donate
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-6 text-right pl-0">
          <DonateAmount
            isActive={selectedAmount === selectedCharity?.unitPrice * 1}
            amount={selectedCharity?.unitPrice * 1}
            setSelectedAmount={setAmount}
          />
        </div>
        <div className="col-md-6 pr-0">
          <DonateAmount
            isActive={selectedAmount === selectedCharity?.unitPrice * 2}
            amount={selectedCharity?.unitPrice * 2}
            setSelectedAmount={setAmount}
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-6 text-right pl-0">
          <DonateAmount
            isActive={selectedAmount === selectedCharity?.unitPrice * 3}
            amount={selectedCharity?.unitPrice * 3}
            setSelectedAmount={setAmount}
          />
        </div>
        <div className="col-md-6 pr-0">
          <DonateAmount
            isActive={selectedAmount === selectedCharity?.unitPrice * 4}
            amount={selectedCharity?.unitPrice * 4}
            setSelectedAmount={setAmount}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-10 offset-md-1">
          <input
            type="text"
            pattern="[0-9]*"
            maxLength={10}
            value={val}
            onChange={(e) =>
              setVal((v) => (e.target.validity.valid ? setSelectedAmount(e.target.value) : v))
            }
            className="form-control"
            placeholder="Other Amount"
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-10 text-center offset-md-1">
          <p className="mb-2">
            <span className="bi-heart-fill fs-6 ml-2 cursor-pointer text-danger"></span>{" "}
            How will my donation help?
          </p>
          <p className="mb-2">
            Your contribution will used towards giving India's underprevileged
            children happier childhoods.
          </p>
          <p className="mb-0">
            Your dontaions are tax excepted under 80G of the Indian Income Tax
            Act.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <label className="m-2">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => setOpen(true)}
            />
            <Link
              className="text-dark d-inline pl-0"
              onClick={() => setOpen(true)}
            >
              <p className="ml-2 d-inline-block text-decoration-underline">
                Please select the checkbox to your consent
              </p>
            </Link>
          </label>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-12 text-center">
          <Button
            className="btn btn-primary w-100 rounded-pill"
            disabled={!checked}
            onClick={tabType === charityProgramConstants.SPONSOR ? saveDonationPreference : nextStep}
          >
            <span className="bi-heart-fill fs-6 ml-2 text-white"></span>
            <span className="fs-6 ml-2">{tabType === charityProgramConstants.SPONSOR ? 'Donation Preference' : 'Donate'}</span>
          </Button>{" "}
        </div>
      </div>
      {open && (
        <DonationConsent open={open} amount={selectedAmount} selectedCharity={selectedCharity} employee={employee} frequency={frequency} handleCheck={handleCheck} closeCheck={closeCheck}/>
      )}
      </>
      }
      {showNextStep && <DonateSecondStep />}
    </>
  );
};
export default Donate;
