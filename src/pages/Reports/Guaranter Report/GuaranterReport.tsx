import React from 'react'

export default function GuaranterReport() {
  return (
    <>
    <div className='m-3 written'>
        <h1 className='mb-4' style={{fontSize:28,fontWeight:600}}>Guaranter Report</h1>
        <div className='d-flex mb-3'>
                <div><button type="button" className="btn btn-primary bg-white text-dark">Period</button></div>
                <div><button type="button" className="btn btn-primary bg-white text-dark mx-2">Member</button></div>
            </div>
        <div className='p-4 bg-white ' style={{borderRadius:10}}>
            <div style={{overflow:"auto"}}>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">##</th>
                            <th scope="col">Application Name</th>
                            <th scope="col">Application Number</th>
                            <th scope="col">Member ID</th>
                            <th scope="col">Member Name</th>
                            <th scope="col">Guarantor Form</th>
                            <th scope="col">ID Name</th>
                            <th scope="col">Relationship Occupation</th>
                            <th scope="col">Income</th>
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
