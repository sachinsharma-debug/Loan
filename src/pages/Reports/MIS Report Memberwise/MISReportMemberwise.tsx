import React from 'react'

export default function MISReportMemberwise() {
  return (
     <>
    <div className='m-3 written'>
        <h1 className='mb-4' style={{fontSize:28,fontWeight:600}}>MIS Report Memberwise</h1>
        <div className='d-flex mb-3'>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Branch</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Product</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Hide SecurityAmt</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Hide Againg</button></div>
            </div>
        <div className='p-4 bg-white ' style={{borderRadius:10}}>
            <div style={{overflow:"auto"}}>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">SI</th>
                            <th scope="col">Branch</th>
                            <th scope="col">Member ID</th>
                            <th scope="col">Member Name</th>
                            <th scope="col">Loan ID</th>
                            <th scope="col">Product</th>
                            <th scope="col">Repayment Type</th>
                            <th scope="col">ROI</th>
                            <th scope="col">Disbursed Date</th>
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
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    </>
  )
}
