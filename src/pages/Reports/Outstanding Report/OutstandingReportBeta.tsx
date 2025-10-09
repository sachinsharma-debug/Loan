import React from 'react'

export default function OutstandingReportBeta() {
  return (
   <>
    <div className='m-3 written'>
        <h1 className='mb-4' style={{fontSize:28,fontWeight:600}}>Outstanding Report Beta</h1>
        <div className='d-flex mb-3'>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Detailed</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Member Group</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Product</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Credit Officer</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Dealerwise</button></div>
            </div>
        <div className='p-4 bg-white ' style={{borderRadius:10}}>
            <div style={{overflow:"auto"}}>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">##</th>
                            <th scope="col">Branch</th>
                            <th scope="col">O/s PR</th>
                            <th scope="col">O/s Int</th>
                            <th scope="col">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                            <td>Mark</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    </> 
  )
}
