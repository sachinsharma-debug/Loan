import React from 'react'

export default function DisbursementSummary() {
  return (
    <>
    <div className='m-3 written'>
        <h1 className='mb-4' style={{fontSize:28,fontWeight:600}}>Disbursement Summary</h1>
        <div className='d-flex mb-3'>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Period</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Member</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Product</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Branch</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Member Group</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Loan ID</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Credit Officer</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Loan Info</button></div>
            </div>
        <div className='p-4 bg-white ' style={{borderRadius:10}}>
            <div style={{overflow:"auto"}}>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">##</th>
                            <th scope="col">Branch</th>
                            <th scope="col">Member ID</th>
                            <th scope="col">Member Name</th>
                            <th scope="col">Member Group</th>
                            <th scope="col">Loan ID</th>
                            <th scope="col">Product</th>
                            <th scope="col">Applied Date</th>
                            <th scope="col">Applied Amt</th>
                            <th scope="col">Rate %</th>
                            <th scope="col">No Of EMI</th>
                            <th scope="col">Loan Type</th>
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
