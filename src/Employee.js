import React from "react";
//import DatePicker from "react-datepicker";
import "./index.css";
//import moment from "moment";
//import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "react-datepicker/dist/react-datepicker.css";
import ReactTable from "react-table";
import "react-table/react-table.css";
import axios from "axios";
class Employee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emp_data: [],
      dep_data: {},
      isLoading: false,
      filterState: {}
    };
    this.getDesig = this.getDesig.bind(this);
    this.handleOriginal = this.handleOriginal.bind(this);
  }

  getDesig(desig) {
    let url = `https://spring-employee.herokuapp.com/employees/search/bydesignation?designation=${desig}`;
    if (!desig || desig === "all") {
      url = "https://spring-employee.herokuapp.com/employees";
    }
    console.log(url);
    return axios
      .get(url)
      .then(json =>
        json.data._embedded.employees.map(result => ({
          ID: result.empid,
          Name: result.empname,
          Skill: result.skill,
          Salary: result.salary,
          Grade: result.grade,
          City: result.city,
          Country: result.country,
          DOJ: result.doj,
          DeptName: result.deptid.deptname,
          Designation: result.designation,
          dep_link: result._links.deptid.href
        }))
      )
      .then(newData =>
        this.setState({ ...this.state, emp_data: newData, isLoading: false })
      )
      .catch(function(error) {
        console.log(error);
      });
  }

  handleOriginal(var2) {
    if (!this.state.dep_data[var2]) {
      axios
        .get(var2)
        .then(json => {
          const data1 = json.data;
          this.setState({
            dep_data: { ...this.state.dep_data, [var2]: data1 }
          });
          console.log(json);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }

  render() {
    let content;
    const { emp_data, isLoading } = this.state;
    if (isLoading) {
      content = <div>Loading...</div>;
    } else {
      content = (
        <div>
          <ReactTable
            data={emp_data}
            filterable
            defaultFilterMethod={(filter, row) =>
              String(row[filter.id]) === filter.value
            }
            manual
            onFetchData={(state, instance) => {
              this.getDesig(
                this.state.filterState ? this.state.filterState.designation : ""
              );
            }}
            columns={[
              {
                Header: "ID",
                accessor: "ID",
                filterMethod: (filter, row) =>
                  String(row[filter.id]).startsWith(filter.value)
              },
              {
                Header: "Name",
                accessor: "Name",
                filterMethod: (filter, row) =>
                  row[filter.id].startsWith(filter.value)
              },

              {
                Header: "Skill",
                accessor: "Skill",
                filterMethod: (filter, row) =>
                  row[filter.id].startsWith(filter.value)
              },
              {
                Header: "DOJ",
                accessor: "DOJ"
              },
              {
                Header: "Designation",
                accessor: "Designation",
                minWidth: 110,
                filterAll: true,

                filterMethod: (filter, row) => {
                  return [];
                },

                Filter: ({ filter, onChange }) => (
                  <select
                    value={
                      this.state.filterState
                        ? this.state.filterState.designation || "all"
                        : "all"
                    }
                    onChange={event => {
                      this.setState({
                        filterState: {
                          ...this.state.filterState,
                          designation: event.target.value
                        }
                      });
                      onChange();
                    }}
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
                accessor: "DeptName",
                filterMethod: (filter, row) =>
                  row[filter.id].startsWith(filter.value)
              },
              {
                Header: "Grade",
                accessor: "Grade",
                filterMethod: (filter, row) =>
                  String(row[filter.id]).startsWith(filter.value)
              },
              {
                Header: "Salary",
                accessor: "Salary",
                filterMethod: (filter, row) =>
                  String(row[filter.id]).startsWith(filter.value)
              },
              {
                Header: "City",
                accessor: "City",
                filterMethod: (filter, row) =>
                  row[filter.id].startsWith(filter.value)
              },
              {
                Header: "Country",
                accessor: "Country",
                filterMethod: (filter, row) =>
                  row[filter.id].startsWith(filter.value)
              }
            ]}
            defaultSorted={[
              {
                id: "Name",
                desc: true
              }
            ]}
            defaultPageSize={10}
            className="-striped -highlight"
            getTdProps={() => {
              return {
                style: {
                  overflow: "visible"
                }
              };
            }}
            freezeWhenExpanded={true}
            SubComponent={rows => {
              const { dep_data } = this.state;
              let var2 = "";
              let var1 = rows.original.dep_link;
              for (let i = 0; i < var1.length; i++) {
                if (var1[i] !== "{") {
                  var2 += var1[i];
                }
                if (var1[i] === "{") {
                  break;
                }
              }
              const dep = dep_data[var2];
              //debugger;
              if (dep) {
                return (
                  <div className="Posts">
                    <header>
                      <ul>
                        <li>Dep ID : {dep.deptid}</li>
                        <li>Dep Name : {dep.deptname}</li>
                        <li>Dep Head : {dep.depthead.city}</li>
                        <li>City : {dep.depthead.country}</li>
                        <li>Country : {dep.depthead.designation}</li>
                        <li>Designation : {dep.depthead.doj}</li>
                        <li>DOJ : {dep.depthead.empname}</li>
                        <li>Grade : {dep.depthead.grade}</li>
                        <li>Salary : {dep.depthead.salary}</li>
                        <li>Skill : {dep.depthead.skill}</li>
                      </ul>
                    </header>
                  </div>
                );
              } else {
                return <div className="Posts">Loading...</div>;
              }
            }}
            getTrProps={(state, rowInfo, column, instance) => {
              return {
                onClick: e => {
                  let var2 = "";
                  console.log(e);
                  console.log(rowInfo);

                  let var1 = rowInfo.row._original.dep_link;
                  for (let i = 0; i < var1.length; i++) {
                    if (var1[i] !== "{") {
                      var2 += var1[i];
                    }
                    if (var1[i] === "{") {
                      break;
                    }
                  }

                  this.handleOriginal(var2);
                }
              };
            }}
          />
        </div>
      );
    }
    return <div>{content}</div>;
  }
}

export default Employee;
 