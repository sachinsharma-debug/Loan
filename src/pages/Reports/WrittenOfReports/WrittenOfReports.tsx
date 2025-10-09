import React from 'react'
import './Written.css'
export default function WrittenOfReports() {
  return (
    <>
    <div className='m-3 written'>
        <h1 className='mb-4' style={{fontSize:28,fontWeight:600}}>Written Of Summary Report</h1>
        <div className='d-flex mb-3'>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Period</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Branch</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Member</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Loan ID</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Product</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Member Group</button></div>
            </div>
        <div className='p-4 bg-white ' style={{borderRadius:10}}>
            
            <div style={{overflow:"auto"}}>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Member ID</th>
                            <th scope="col">Member Name</th>
                            <th scope="col">Branch</th>
                            <th scope="col">Member Group</th>
                            <th scope="col">Loan ID</th>
                            <th scope="col">Dealer Name</th>
                            <th scope="col">Product</th>
                            <th scope="col">Tenure</th>
                            <th scope="col">Disbursed Amount</th>
                            <th scope="col">Disbursed Date</th>
                            <th scope="col">Last Rcpt Date</th>
                            <th scope="col">WriteOff Date</th>
                            <th scope="col">PR Amount</th>
                            <th scope="col">Int Amount</th>
                            <th scope="col">Penalty</th>
                            <th scope="col">Total Amount</th>
                            <th scope="col">WriteOff Recovered Amount</th>
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
                            <td>@mdo</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                            <td>@mdo</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    </>
  )
}
