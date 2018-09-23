/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';

class ListCases extends Component {
  constructor(props) {
    super(props);
    console.log(props);

    this.state = {
      data: [
        {
          initiator: 'a',
          partner: 'b',
          state: 'disputed',
        },
        {
          initiator: 'a',
          partner: 'b',
          state: 'pending',
        },
        {
          initiator: 'a',
          partner: 'b',
          state: 'signed',
        },
        {
          initiator: 'a',
          partner: 'b',
          state: 'finished',
        },
      ],
    };
  }

  render() {
    const columns = [
      {
        Header: 'ID',
        accessor: 'id', // String-based value accessors!
      },
      {
        Header: 'Party 1',
        accessor: 'initiator', // String-based value accessors!
      },
      {
        Header: 'Party 2',
        accessor: 'partner',
      },
      {
        Header: 'State',
        accessor: 'state',
        Cell: ({ row }) => (
          <Link to={`${row.state === 'pending' ? 'accept' : 'show'}/${row.id}`}>
            {row.state}
          </Link>
        ),
      },
    ];

    return (
      <ReactTable
        data={this.state.data}
        columns={columns}
        getTdProps={(state, rowInfo, column, instance) => ({
          onClick: (e, handleOriginal) => {
            console.log('A Td Element was clicked!');
            console.log('it produced this event:', e);
            console.log('It was in this column:', column);
            console.log('It was in this row:', rowInfo);
            console.log('It was in this table instance:', instance);

            // IMPORTANT! React-Table uses onClick internally to trigger
            // events like expanding SubComponents and pivots.
            // By default a custom 'onClick' handler will override this functionality.
            // If you want to fire the original onClick handler, call the
            // 'handleOriginal' function.
            if (handleOriginal) {
              handleOriginal();
            }
          },
        })}
      />
    );
  }
}

export default ListCases;
