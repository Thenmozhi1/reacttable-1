import React from "react";
import ReactTable from "react-table";
//import { rows2 } from "./Utils";
import "react-table/react-table.css";
import axios from "axios";
import "./index.css";
import debounce from "lodash/debounce";

class Department extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dep_data: [],
      isLoading: false,
      filterState: {}
    };
  }

  handleChange = (onChange, identifier) => {
    return e => {
      this.setState({
        filterState: {
          ...this.state.filterState,
          [identifier]: e.target.value
        }
      });
      onChange();
    };
  };
  getFilterValueFromState = (identifier, defaultValue = "") => {
    const filterState = this.state.filterState;
    if (!filterState) {
      return defaultValue;
    }
    if (
      typeof filterState[identifier] !== "undefined" ||
      filterState[identifier] !== null
    ) {
      return filterState[identifier];
    }
    return defaultValue;
  };
  fetchGridData = debounce((state, instance) => {
    let url = "";
    const params = {
      page: state.page,
      size: state.pageSize,
      sort: state.sorted["0"]
        ? state.sorted["0"].id +
          "," +
          (state.sorted["0"].desc === false ? "desc" : "asc")
        : "deptid"
    };
    if (Object.keys(this.state.filterState).length !== 0) {
      url = "/search/byadvsearch?advsearch=( ";
      let count = 0;
      for (let key in this.state.filterState) {
        if (this.state.filterState.hasOwnProperty(key)) {
          let val = this.state.filterState[key];
          count++;
          if (count === 1) url += key + ":" + val;
          else url += "and" + key + ":" + val;
        }
      }
      url += " )";
    }
    this.setState({ isLoading: true });
    console.log(state);
    console.log(instance);
    axios
      .get("https://spring-employee.herokuapp.com/departments" + url, {
        params
      })
      .then(json =>
        json.data.content.map(result => ({
          deptid: result.deptid,
          deptname: result.deptname,
          DeptHead: result.depthead.empname
        }))
      )

      .then(newData =>
        this.setState({
          ...this.state,
          dep_data: newData,
          isLoading: false
        })
      )

      .catch(function(error) {
        console.log(error);
      });
  }, 500);

  render() {
    const { dep_data, isLoading } = this.state;
    return (
      <div>
        <ReactTable
          data={dep_data}
          filterable
          manual
          minRows={0}
          loading={isLoading}
          onFetchData={this.fetchGridData}
          columns={[
            {
              Header: "Deptid",
              accessor: "deptid",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "deptid")}
                  value={
                    this.state.filterState.deptid
                      ? this.state.filterState.deptid
                      : ""
                  }
                />
              )
            },
            {
              Header: "Department",
              accessor: "deptname",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "deptname")}
                  value={
                    this.state.filterState.deptname
                      ? this.state.filterState.deptname
                      : ""
                  }
                />
              )
            },
            {
              Header: "DeptHead",
              accessor: "DeptHead",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "DeptHead")}
                  value={
                    this.state.filterState.DeptHead
                      ? this.state.filterState.DeptHead
                      : ""
                  }
                />
              )
            }
          ]}
          defaultSorted={[
            {
              id: "Deptid",
              desc: true
            }
          ]}
          defaultPageSize={5}
          className="-striped -highlight"
        />
      </div>
    );
  }
}
export default Department;
