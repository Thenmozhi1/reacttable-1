import React from "react";
import "./index.css";
import ReactTable from "react-table";
import "react-table/react-table.css";
import axios from "axios";
import debounce from "lodash/debounce";

class Employee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emp_data: [],
      dep_data: {},
      isLoading: false,
      filterState: {},
      pages: null
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

  fetchDepartmentDetails = var2 => {
    if (!this.state.dep_data[var2]) {
      axios
        .get(var2)
        .then(json => {
          const data1 = json.data;
          this.setState({
            dep_data: { ...this.state.dep_data, [var2]: data1 }
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  };

  fetchGridData = debounce((state, instance) => {
    // let url = " ";
    // const API_URL = "https://spring-employee.herokuapp.com/employees";
    const params = { page: state.page, size: state.pageSize };
    this.setState({ isLoading: true });
    console.log(state);
    console.log(instance);
    // if (this.state.filterState.Name)
    //   url = `/search/byadvsearch?advsearch=( empname:${
    //     this.state.filterState.Name
    //   } )`;
    axios
      .get("https://spring-employee.herokuapp.com/employees", {
        params
      })
      .then(json =>
        json.data.content.map(result => ({
          ID: result.empid,
          Name: result.empname,
          Skill: result.skill,
          Salary: result.salary,
          Grade: result.grade,
          City: result.city,
          Country: result.country,
          DOJ: result.doj,
          Designation: result.designation,
          DeptName: result.deptid.deptname,
          Dep_head: result.deptid,
          pages: result.pages
        }))
      )

      .then(newData =>
        this.setState({
          ...this.state,
          emp_data: newData,
          isLoading: false
        })
      )

      .catch(function(error) {
        console.log(error);
      });
  }, 500);

  render() {
    const { emp_data, isLoading, pages } = this.state;
    const content = (
      <div>
        <ReactTable
          data={emp_data}
          //pages={this.state.pages}
          freezeWhenExpanded={true}
          filterable
          pages={pages}
          manual
          loading={isLoading}
          onFetchData={this.fetchGridData}
          columns={[
            {
              Header: "ID",
              accessor: "ID",
              //sortable: true
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "ID")}
                  value={
                    this.state.filterState.ID ? this.state.filterState.ID : ""
                  }
                />
              )
            },
            {
              Header: "Name",
              accessor: "Name",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "Name")}
                  value={
                    this.state.filterState.Name
                      ? this.state.filterState.Name
                      : ""
                  }
                />
              )
            },

            {
              Header: "Skill",
              accessor: "Skill",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "Skill")}
                  value={
                    this.state.filterState.Skill
                      ? this.state.filterState.Skill
                      : ""
                  }
                />
              )
            },
            {
              Header: "DOJ",
              accessor: "DOJ"
            },
            {
              Header: "Designation",
              accessor: "Designation",
              minWidth: 110,
              Filter: ({ filter, onChange }) => (
                <select
                  onChange={this.handleChange(onChange, "Designation")}
                  value={this.getFilterValueFromState("Designation", "all")}
                  style={{ width: "100%" }}
                >
                  <option value="all">Show all</option>
                  <option value="protector of Asgard">
                    protector of Asgard
                  </option>
                  <option value="Sr.manager">Sr.manager</option>
                  <option value="developer">developer</option>
                </select>
              )
            },
            {
              Header: "DeptName",
              accessor: "DeptName"
              // filterMethod: (filter, row) =>
              //   row[filter.id].startsWith(filter.value)
            },
            {
              Header: "Grade",
              accessor: "Grade",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "Grade")}
                  value={
                    this.state.filterState.Grade
                      ? this.state.filterState.Grade
                      : ""
                  }
                />
              )
            },
            {
              Header: "Salary",
              accessor: "Salary",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "Salary")}
                  value={
                    this.state.filterState.Salary
                      ? this.state.filterState.Salary
                      : ""
                  }
                />
              )
            },
            {
              Header: "City",
              accessor: "City",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "City")}
                  value={
                    this.state.filterState.City
                      ? this.state.filterState.City
                      : ""
                  }
                />
              )
            },
            {
              Header: "Country",
              accessor: "Country",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "Country")}
                  value={
                    this.state.filterState.Country
                      ? this.state.filterState.Country
                      : ""
                  }
                />
              )
            }
          ]}
          //defaultPageSize={10}
          className="-striped -highlight"
          getTdProps={() => {
            return {
              style: {
                overflow: "visible"
              }
            };
          }}
          SubComponent={rows => {
            const dep = rows.original.Dep_head.depthead;

            if (dep) {
              return (
                <div className="Posts">
                  <header>
                    <ul>
                      <li>Dep ID : {rows.original.Dep_head.deptid}</li>
                      <li>Dep Name : {rows.original.Dep_head.deptname}</li>
                      <li>Dep Head : {dep.empname}</li>
                      <li>City : {dep.city}</li>
                      <li>Country : {dep.country}</li>
                      <li>Designation : {dep.designation}</li>
                      <li>DOJ : {dep.doj}</li>
                      <li>Grade : {dep.grade}</li>
                      <li>Salary : {dep.salary}</li>
                      <li>Skill : {dep.skill}</li>
                    </ul>
                  </header>
                </div>
              );
            } else {
              return <div className="Posts">Loading...</div>;
            }
          }}
          // getTrProps={(state, rowInfo, column, instance) => {
          //   return {
          //     onClick: e => {
          //       let var2 = "";
          //       console.log(e);
          //       console.log(rowInfo);
          //       let var1 = rowInfo.row._original.dep_link;
          //       for (let i = 0; i < var1.length; i++) {
          //         if (var1[i] !== "{") {
          //           var2 += var1[i];
          //         }
          //         if (var1[i] === "{") {
          //           break;
          //         }
          //       }

          //       this.fetchDepartmentDetails(var2);
          //     }
          //   };
          // }}
        />
      </div>
    );

    return <div>{content}</div>;
  }
}

export default Employee;
