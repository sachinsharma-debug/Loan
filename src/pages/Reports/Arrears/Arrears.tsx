import React from 'react'
import '../WrittenOfReports/Written.css'

export default function Arrears() {
  return (
    <>
    <div className='m-3 written'>
        <h1 className='mb-4' style={{fontSize:28,fontWeight:600}}>Arrears</h1>
        <div className='d-flex mb-3'>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Period</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Company</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Group</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Ageing Method</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Ledger-wise Bills</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Basis of Values</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Change View</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Expectation Reports</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Save View</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Apply Filter</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Config</button></div>
            </div>
        <div className='p-4 bg-white ' style={{borderRadius:10}}>
            
            <div style={{overflow:"auto"}}>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Ref.No.</th>
                            <th scope="col">Party's Name</th>
                            <th scope="col">Branch</th>
                            <th scope="col">Pending Amount</th>
                            <th scope="col">Due On</th>
                            <th scope="col">Overdue by days</th>
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
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    </>
  )
}
