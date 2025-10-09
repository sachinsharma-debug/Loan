import React from 'react'

export default function MISReportBranchwise() {
  return (
     <>
    <div className='m-3 written'>
        <h1 className='mb-4' style={{fontSize:28,fontWeight:600}}>MIS Report Branchwise/Productwise</h1>
        <div className='d-flex mb-3'>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Period</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Branch</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Show Againg</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Hide SecurityAmt</button></div>
            </div>
        <div className='p-4 bg-white ' style={{borderRadius:10}}>
            <div style={{overflow:"auto"}}>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">SI</th>
                            <th scope="col">Branch</th>
                            <th scope="col">Security Valuation Amount</th>
                            <th scope="col">Total Disbursement Amount</th>
                            <th scope="col">Total Receipt Amount</th>
                            <th scope="col">Total Overdue Amount</th>
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
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    </>
  )
}
