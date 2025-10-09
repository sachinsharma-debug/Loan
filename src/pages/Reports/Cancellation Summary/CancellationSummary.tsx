import React from 'react'

export default function CancellationSummary() {
  return (
    <>
    <div className='m-3 written'>
        <h1 className='mb-4' style={{fontSize:28,fontWeight:600}}>Cancellation Summary</h1>
        <div className='d-flex mb-3'>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Period</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Branch</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Loan ID</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Member</button></div>
            </div>
        <div className='p-4 bg-white ' style={{borderRadius:10}}>
            <div style={{overflow:"auto"}}>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">##</th>
                            <th scope="col">Application Date</th>
                            <th scope="col">Application No</th>
                            <th scope="col">Cancellation Date</th>
                            <th scope="col">Member ID</th>
                            <th scope="col">Applicant Name</th>
                            <th scope="col">Member Group</th>
                            <th scope="col">Loan ID</th>
                            <th scope="col">City / District</th>
                            <th scope="col">Contact No</th>
                            <th scope="col">Product Name</th>
                            <th scope="col">Product Rate</th>
                            <th scope="col">Loan Amount</th>
                            <th scope="col">No of EMI</th>
                            <th scope="col">Cancellation Type</th>
                            <th scope="col">Cancellation Description</th>
                            <th scope="col">Cancelled On</th>
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
