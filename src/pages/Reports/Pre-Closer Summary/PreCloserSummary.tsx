import React from 'react'

export default function PreCloserSummary() {
  return (
    <>
    <div className='m-3 written'>
        <h1 className='mb-4' style={{fontSize:28,fontWeight:600}}>Pre-Closure Summary</h1>
        <div className='d-flex mb-3'>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Detailed</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Period</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Multi FIlter</button></div>
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
                            <th scope="col">Loan ID</th>
                            <th scope="col">Dealer Name</th>
                            <th scope="col">Disbursed Amount</th>
                            <th scope="col">Disbursed Date</th>
                            <th scope="col">Precloser Date</th>
                            <th scope="col">PR Amount</th>
                            <th scope="col">Int Amount</th>
                            <th scope="col">Overdue Penalty</th>
                            <th scope="col">Total Amount</th>
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
