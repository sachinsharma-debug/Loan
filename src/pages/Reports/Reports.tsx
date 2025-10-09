import React from 'react'
import './Reports.css'
import { Link } from 'react-router-dom'
import ModalL from '@/components/Modal'

export default function Reports() {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  
    function openModal(tmpstore) {
sessionStorage.setItem("tmpstore", tmpstore);
        setIsOpen(true);
    }
  
    
  
    function closeModal() {
      setIsOpen(false);
    }

  return (
    <>
    <ModalL isOpen={modalIsOpen} onRequestClose={closeModal} />
    <div className='m-3'>
        <h1 className='mb-4' style={{fontSize:28,fontWeight:600}}>Reports</h1>
        <div className='p-4 bg-white ' style={{borderRadius:10}}>
            <div className='row'>
                <div className='col-lg-4'>
                    <div className='mb-3 p-2 report-hover'>LEdger</div>
                    <Link to="/Written"><div className='mb-3 p-2 report-hover'>Written Off Report</div></Link>
                    <Link to="/Arrears"><div className='mb-3 p-2 report-hover'>Arrears</div></Link>
                    <div className='mb-3 p-2 report-hover'>Ledger Card</div>
                    <Link to="/GuaranterReport"><div className='mb-3 p-2 report-hover'>Guarantor</div></Link>
                    <Link to="/ApprovalSummary"><div className='mb-3 p-2 report-hover'>Approval Summary</div></Link>
                    <Link to="/CancellationSummary"><div className='mb-3 p-2 report-hover'>Cancellation Summary</div></Link>
                    <Link to="/DisbursementSummary"><div className='mb-3 p-2 report-hover'>Disbursement Summary</div></Link>
                </div>
                <div className='col-lg-4'>
                    <div className='mb-3 p-2 report-hover'>Collection Due</div>
                    <Link to="/CollectedSummary"><div className='mb-3 p-2 report-hover'>Collected Summary</div></Link>
                    <Link to="/PreCloserSummary"><div className='mb-3 p-2 report-hover'>Pre-Closure Summary</div></Link>
                    <Link to="/LoanSummaryReport"><div className='mb-3 p-2 report-hover'>Loan Summary Report</div></Link>
                    <Link to="/OutstandingReportBeta"><div className='mb-3 p-2 report-hover'>Outstanding Report(beta)</div></Link>
                    <div className='mb-3 p-2 report-hover'>Outstanding Report</div>
                    <Link to="/CibilReport"><div className='mb-3 p-2 report-hover'>CIBIL Report</div></Link>
                    <Link to="/SeizureList"><div className='mb-3 p-2 report-hover'>Seizure List</div></Link>
                </div>
                <div className='col-lg-4'>
                    <Link to="/RCStatement"><div className='mb-3 p-2 report-hover'>RC Statement</div></Link>
                    <Link to="/Insurance"><div className='mb-3 p-2 report-hover'>Insurance</div></Link>
                    <div className='mb-3 p-2 report-hover'>MIS - Ageing Setup</div>
                    <div className='mb-3 p-2 report-hover' onClick={()=>{
                        openModal("/MISReportMemberwise")
                        }}>MIS Report (Memberwise)</div>
                    <div className='mb-3 p-2 report-hover'  onClick={()=>{
                        openModal("/MISReportBranchwise")
                        }}>MIS Report (Branchwise / Productwise)</div>
                    <div className='mb-3 p-2 report-hover'
                     onClick={()=>{
                        openModal("")
                        }}
                    >Collected Charges Report (Branchwise)</div>
                    <div className='mb-3 p-2 report-hover'
                     onClick={()=>{
                        openModal("")
                        }}
                    >Collected Charges Report (Memberwise)</div>
                </div>
                
            </div>
        </div>
    </div>
    </>
  )
}
