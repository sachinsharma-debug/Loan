import React from 'react'
import '../WrittenOfReports/Written.css'

export default function LoanSummaryReport() {
  return (
    <>
    <div className='m-3 written'>
        <h1 className='mb-4' style={{fontSize:28,fontWeight:600}}>Loan Summary Report</h1>
        <div className='d-flex mb-3 scroll-bar'style={{overflow:"auto"}}>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Period</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Member ID</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Member</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Member Group</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Branch</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Product</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Method Of Interest</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Recovery Plan</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Loan ID</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Approval Letter</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Credit Officer</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Loan Status</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Welcome Letter</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Loan Info</button></div>
            </div>
        <div className='p-4 bg-white ' style={{borderRadius:10}}>
            <div style={{overflow:"auto"}}>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">##</th>
                            <th scope="col">Member ID</th>
                            <th scope="col">Member Name</th>
                            <th scope="col">Branch</th>
                            <th scope="col">Member Group</th>
                            <th scope="col">Dealer Name</th>
                            <th scope="col">Loan ID</th>
                            <th scope="col">Application No</th>
                            <th scope="col">Application Date</th>
                            <th scope="col">Product</th>
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
