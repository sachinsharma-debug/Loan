import React from 'react'

export default function SeizureList() {
  return (
    <>
    <div className='m-3 written'>
        <h1 className='mb-4' style={{fontSize:28,fontWeight:600}}>Vehicle Seize Report</h1>
        <div className='d-flex mb-3'>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Period</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Member</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Branch</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Loan Info</button></div>
            </div>
        <div className='p-4 bg-white ' style={{borderRadius:10}}>
            <div style={{overflow:"auto"}}>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">##</th>
                            <th scope="col">Data Member ID</th>
                            <th scope="col">Member Name</th>
                            <th scope="col">Loan ID</th>
                            <th scope="col">Branch</th>
                            <th scope="col">Make</th>
                            <th scope="col">Model</th>
                            <th scope="col">Chassis No</th>
                            <th scope="col">Engine No</th>
                            <th scope="col">Year</th>
                            <th scope="col">Amount</th>
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
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    </>
  )
}
