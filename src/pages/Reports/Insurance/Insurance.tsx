import React from 'react'

export default function Insurance() {
  return (
    <>
    <div className='m-3 written'>
        <h1 className='mb-4' style={{fontSize:28,fontWeight:600}}>Insurance Reminder Report</h1>
        <div className='d-flex mb-3'>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Period</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Detailed</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Loan ID</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Product</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Vehicle No Wise</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Closed</button></div>
            </div>
        <div className='p-4 bg-white ' style={{borderRadius:10}}>
            <div style={{overflow:"auto"}}>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Loan ID</th>
                            <th scope="col">Member Name</th>
                            <th scope="col">Branch</th>
                            <th scope="col">Product Name</th>
                            <th scope="col">Vehicle Reg. No</th>
                            <th scope="col">Chessis No</th>
                            <th scope="col">Policy Date</th>
                            <th scope="col">Insurance Company</th>
                            <th scope="col">Policy No</th>
                            <th scope="col">Renewal Date</th>
                            <th scope="col">Insurance Amount</th>
                            <th scope="col">Tenure</th>
                            <th scope="col">Policy Exp. Date</th>
                            <th scope="col">Status</th>
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
