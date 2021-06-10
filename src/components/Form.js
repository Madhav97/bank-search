import React, { Component } from "react";
import styles from "../formOptionStyles.module.css";
import axios from "axios";

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ifscRequest: true,
      allbanks: [],
      banks: [],
      ifsc: "",
      address: "",
      city: "",
      district: "",
      state: "",
      name: "",
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:8080/bank/all-banks")
      .then((response) => {
        console.log(response);
        this.setState({
          allbanks: response.data,
        });
      })
      .catch((error) => {
        console.log("error occured here: ", error);
      });
  }

  submitHandler = (event) => {
    if (this.state.ifsc) {
      const data = {
        ifsc: this.state.ifsc,
      };
      axios
        .post("http://localhost:8080/bank/ifsc", data)
        .then((response) => {
          console.log(response);
          this.setState({
            banks: response.data,
          });
        })
        .catch((error) => {
          console.log("error occured here: ", error);
        });
    } else {
      const data = {
        address: this.state.address,
        city: this.state.city,
        district: this.state.district,
        state: this.state.state,
        name: this.state.name,
      };
      axios
        .post("http://localhost:8080/bank/name", data)
        .then((response) => {
          console.log(response);
          this.setState({
            banks: response.data,
          });
        })
        .catch((error) => {
          console.log("error occured here: ", error);
        });
    }
    event.preventDefault();
  };

  ifscChangeHandler = (event) => {
    this.setState({
      ifsc: event.target.value,
    });
  };

  radioChangeHandler = (event) => {
    let request = event.target.value === "ifsc";
    this.setState({
      ifscRequest: request,
    });
    if (request) {
      this.setState({
        address: "",
        city: "",
        district: "",
        state: "",
        name: "",
      });
    } else {
      this.setState({
        ifsc: "",
      });
    }
  };

  changeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  
  render() {
    const { ifscRequest, banks, allbanks, state, name } = this.state;
    const allBankStates = [
      ...new Set(allbanks.map((allbank) => allbank.state)),
    ];
    allBankStates.sort();
    const allBankNames = [
      ...new Set(
        allbanks.map((allbank) => (allbank.state === state ? allbank.name : ""))
      ),
    ];
    allBankNames.sort();
    const allBankAddresses = [
      ...new Set(
        allbanks.map((allbank) =>
          allbank.state === state && allbank.name === name
            ? allbank.address
            : ""
        )
      ),
    ];
    const allBankCities = [
      ...new Set(
        allbanks.map((allbank) =>
          allbank.state === state && allbank.name === name ? allbank.city : ""
        )
      ),
    ];
    const allBankDistricts = [
      ...new Set(
        allbanks.map((allbank) =>
          allbank.state === state && allbank.name === name
            ? allbank.district
            : ""
        )
      ),
    ];
    return (
      <div>
        <form onSubmit={this.submitHandler}>
          <div className={styles.division}>
            <input
              type="radio"
              name="formRadio"
              value="ifsc"
              onClick={this.radioChangeHandler}
            />
            <label>Search using IFSC</label>
            <br />
            <fieldset disabled={ifscRequest ? "" : "disabled"}>
              <label>*IFSC: </label>
              <input
                required="required"
                type="text"
                value={this.state.ifsc}
                onChange={this.ifscChangeHandler}
              />
            </fieldset>
          </div>
          <div className={styles.division}>
            <input
              type="radio"
              name="formRadio"
              value="byname"
              onClick={this.radioChangeHandler}
            />
            <label>Search using other fields</label>
            <br />
            <fieldset disabled={ifscRequest ? "disabled" : ""}>
              <label>*State: </label>
              <select
                name="state"
                required="required"
                className={styles.optionTag}
                value={this.state.state}
                onChange={this.changeHandler}
              >
                <option value="">Select</option>
                {allBankStates.length
                  ? allBankStates.map((allbankstate) =>
                      allbankstate !== "" ? (
                        <option value={allbankstate}>{allbankstate}</option>
                      ) : null
                    )
                  : null}
              </select>
              <br />
              <label>*Name: </label>
              <select
                name="name"
                required="required"
                className={styles.optionTag}
                value={this.state.name}
                onChange={this.changeHandler}
              >
                <option value="">Select</option>
                {allBankNames.length
                  ? allBankNames.map((allbankname) =>
                      allbankname !== "" ? (
                        <option value={allbankname}>{allbankname}</option>
                      ) : null
                    )
                  : null}
              </select>
              <br />
              <label>Address: </label>
              <select
                name="address"
                className={styles.optionTag}
                value={this.state.address}
                onChange={this.changeHandler}
              >
                <option value="">Select</option>
                {allBankAddresses.length
                  ? allBankAddresses.map((allbankaddress) =>
                      allbankaddress !== "" ? (
                        <option value={allbankaddress}>{allbankaddress}</option>
                      ) : null
                    )
                  : null}
              </select>
              <br />
              <label>City: </label>
              <select
                name="city"
                className={styles.optionTag}
                value={this.state.city}
                onChange={this.changeHandler}
              >
                <option value="">Select</option>
                {allBankCities.length
                  ? allBankCities.map((allbankcity) =>
                      allbankcity !== "" ? (
                        <option value={allbankcity}>{allbankcity}</option>
                      ) : null
                    )
                  : null}
              </select>
              <br />
              <label>District: </label>
              <select
                name="district"
                className={styles.optionTag}
                value={this.state.district}
                onChange={this.changeHandler}
              >
                <option value="">Select</option>
                {allBankDistricts.length
                  ? allBankDistricts.map((allbankdistrict) =>
                      allbankdistrict !== "" ? (
                        <option value={allbankdistrict}>
                          {allbankdistrict}
                        </option>
                      ) : null
                    )
                  : null}
              </select>
              <br />
            </fieldset>
          </div>
          <button type="submit">Submit</button>
        </form>
        <table className={styles.table}>
          <thead>
            <tr>
              <td>IFSC</td>
              <td>Bank ID</td>
              <td>Branch</td>
              <td>Address</td>
              <td>City</td>
              <td>District</td>
              <td>State</td>
              <td>Name</td>
            </tr>
          </thead>
          <tbody>
            {banks.length
              ? banks.map((bank) => (
                  <tr key={bank.ifsc}>
                    <td>{bank.ifsc}</td>
                    <td>{bank.bank_id}</td>
                    <td>{bank.branch}</td>
                    <td>{bank.address}</td>
                    <td>{bank.city}</td>
                    <td>{bank.district}</td>
                    <td>{bank.state}</td>
                    <td>{bank.name}</td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Form;
