import React from 'react'

export default function CollectedSummary() {
  return (
    <>
    <div className='m-3 written'>
        <h1 className='mb-4' style={{fontSize:28,fontWeight:600}}>Collected Summary</h1>
        <div className='d-flex mb-3'>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Detailed</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Period</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Member</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Branch</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Member Group</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Member ID</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Product</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Loan ID</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Area Wise</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Credit Officer</button></div>
            </div>
        <div className='p-4 bg-white ' style={{borderRadius:10}}>
            <div style={{overflow:"auto"}}>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">##</th>
                            <th scope="col">Application No</th>
                            <th scope="col">Member ID</th>
                            <th scope="col">Member Name</th>
                            <th scope="col">Member Group</th>
                            <th scope="col">Area</th>
                            <th scope="col">Credit Officer</th>
                            <th scope="col">Loan ID</th>
                            <th scope="col">Product Name</th>
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
