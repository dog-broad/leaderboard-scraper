import React, { useState, useEffect } from 'react';
import { Container, Form } from 'react-bootstrap';
import { firestore } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const UserDataPage = () => {
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [gridApi, setGridApi] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'users'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserData(data);
        console.log(data);
        
        // Call autoSizeAllColumns when data is loaded
        if (gridApi) {
          gridApi.sizeColumnsToFit();
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [gridApi]); // Added gridApi as dependency

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  };

  const filteredData = userData.filter(user =>
    (user.displayName && user.displayName.toLowerCase().includes(searchTerm)) ||
    (user.email && user.email.toLowerCase().includes(searchTerm))
  );

  const columnDefs = [
    { headerName: 'Name', field: 'name' },
    { headerName: 'Email', field: 'email' },
    { headerName: 'Year of Passing', field: 'yearOfPassing' },
    { headerName: 'Hall Ticket Number', field: 'hallTicketNo' },
    { headerName: 'GeeksforGeeks', field: 'platforms', valueGetter: platformsValueGetter },
    { headerName: 'Codeforces', field: 'platforms', valueGetter: platformsValueGetter },
    { headerName: 'LeetCode', field: 'platforms', valueGetter: platformsValueGetter },
    { headerName: 'CodeChef', field: 'platforms', valueGetter: platformsValueGetter },
    { headerName: 'HackerRank', field: 'platforms', valueGetter: platformsValueGetter },
  ];

  // ValueGetter function to extract platform usernames
  function platformsValueGetter(params) {
    const { data, colDef } = params;
    const platformIndex = colDef.headerName === 'GeeksforGeeks' ? 0 :
      colDef.headerName === 'Codeforces' ? 1 :
      colDef.headerName === 'LeetCode' ? 2 :
      colDef.headerName === 'CodeChef' ? 3 :
      colDef.headerName === 'HackerRank' ? 4 : -1;
    return data.platforms && data.platforms[platformIndex] ? data.platforms[platformIndex].username : '';
  }

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const gridOptions = {
    pagination: true,
    domLayout: 'autoWidth',
  };  

  return (
    <Container className="mt-5">
      <h2>User Data</h2>
      <Form.Group controlId="searchForm" className="mt-3">
        <Form.Control
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={handleSearch}
        />
      </Form.Group>
      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          rowData={filteredData}
          columnDefs={columnDefs}
          gridOptions={gridOptions}
          onGridReady={onGridReady} // Added onGridReady callback
        />
      </div>
    </Container>
  );
};

export default UserDataPage;
