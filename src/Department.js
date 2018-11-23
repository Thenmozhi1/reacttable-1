import React from "react";
import ReactTable from "react-table";
//import { rows2 } from "./Utils";
import "react-table/react-table.css";
import axios from "axios";
import "./index.css";

class Department extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dep_data: [],
      isLoading: false
    };
    //this.ClickAction = this.ClickAction.bind(this);
    //this.performAction = this.performAction.bind(this);
  }
  componentDidMount() {
    this.setState({ isLoading: true });
    axios
      .get("https://spring-employee.herokuapp.com/departments")
      .then(json =>
        json.data._embedded.departments.map(result => ({
          Deptid: result.deptid,
          Department: result.deptname,
          DeptHead: result.depthead.empname
        }))
      )
      .then(newData => {
        this.setState({ dep_data: newData, isLoading: false });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  // ClickAction(cellInfo) {
  //   const data = [...this.state.dep_data];
  //   return (
  //     <div>
  //       <button
  //         contentEditable
  //         suppressContentEditableWarning
  //         onClick={this.performAction}
  //       >
  //         {data[cellInfo.index][cellInfo.column.id]}
  //       </button>
  //     </div>
  //   );
  //}
  //performAction() {}
  render() {
    const { dep_data } = this.state;

    return (
      <div>
        <ReactTable
          data={dep_data}
          columns={[
            {
              Header: "Deptid",
              accessor: "Deptid"
            },
            {
              Header: "Department",
              accessor: "Department"
            },
            {
              Header: "DeptHead",
              accessor: "DeptHead"
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
