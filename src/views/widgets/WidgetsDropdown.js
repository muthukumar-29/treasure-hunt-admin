import React, { useEffect, useRef, useState } from 'react'
import { collection, getDocs } from "firebase/firestore"
import db from "../../firebase/firebase-config"
import PropTypes from 'prop-types'

import {
  CRow,
  CCol,
  CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop } from '@coreui/icons'

const WidgetsDropdown = (props) => {
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)


  const [users, setUsers] = useState([]);
  const [queries, setQuery] = useState([]);
  const [clues, setClues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));

      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      setUsers(usersList);
      setLoading(false);
    }
    catch (error) {
      console.error("error to fetch users", error);
    }
  }

  const fetchQueries = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "queries"));

      const queryList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      // usersList.map((item)=>{
      //   console.log(item.email);
      // })

      setQuery(queryList);
      setLoading(false);
    }
    catch (error) {
      console.error("error to fetch users", error);
    }
  }

  const fetchClues = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "clue"));

      const queryList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      setClues(queryList);
      setLoading(false);
    }
    catch (error) {
      console.error("error to fetch clues", error);
    }
  }


  useEffect(() => {
    fetchUsers()
    fetchQueries()
    fetchClues()
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="primary"
          value={
            <>
              {users.length}
            </>
          }
          title="Users"
          chart={
            <CChartLine
              ref={widgetChartRef1}
              className="mt-3 mx-3"
              style={{ height: '70px' }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="info"
          value={
            <>
              {queries.length}
            </>
          }
          title="Queries"
          chart={
            <CChartLine
              ref={widgetChartRef2}
              className="mt-3 mx-3"
              style={{ height: '70px' }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="warning"
          value={
            <>
              {clues.length}
            </>
          }
          title="Clues (QR Code)"
          chart={
            <CChartLine
              className="mt-3"
              style={{ height: '70px' }}
            />
          }
        />
      </CCol>
    </CRow>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown
