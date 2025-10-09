import React from 'react'

export default function RCStatement() {
  return (
    <>
    <div className='m-3 written'>
        <h1 className='mb-4' style={{fontSize:28,fontWeight:600}}>RC Statement Report</h1>
        <div className='d-flex mb-3'>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Period</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">RC Upto</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">RC Status</button></div>
            </div>
        <div className='p-4 bg-white ' style={{borderRadius:10}}>
            <div style={{overflow:"auto"}}>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">No.</th>
                            <th scope="col">Member Name</th>
                            <th scope="col">App No</th>
                            <th scope="col">Loan ID</th>
                            <th scope="col">Name Of Card</th>
                            <th scope="col">Make</th>
                            <th scope="col">Model</th>
                            <th scope="col">Registration No</th>
                            <th scope="col">RC Status</th>
                            <th scope="col">RC No</th>
                            <th scope="col">Input Date</th>
                            <th scope="col">RC Upto</th>
                            <th scope="col">Given Date</th>
                            <th scope="col">Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                            <td>Mark</td>
                            <td>Otto</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    </>
  )
}
