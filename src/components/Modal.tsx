import React from 'react'
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import '../App.css'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)


function ModalL( { isOpen, onRequestClose }) {
    let subtitle;
function afterOpenModal() {
      // references are now sync'd and can be accessed.
      subtitle.style.color = '#f00';
    }
  return (
    <>
    <div>
      {/* <button onClick={openModal}>Open Modal</button> */}
      <Modal
        isOpen={isOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={onRequestClose}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className='bg-white modal-input'>
            <div className='text-center' style={{fontSize:24}}>MIS Report Memberwise</div>
            <form className='mt-4' action="/action_page.php">
                <div>
                    <label htmlFor="birthday">Period Form</label>
                    <input className='mx-3' type="date" id="birthday" name="birthday"/>
                    <label htmlFor="birthday">To</label>
                    <input className='mx-3' type="date" id="birthday" name="birthday"/>
                </div>
                <div className='mt-2'>
                    <label htmlFor="fname">Branch</label>
                    <input className='mx-3' type="text" id="fname" name="fname"></input>
                </div>
                <div className='mt-2'>
                    <label htmlFor="fname">Product</label>
                    <input className='mx-3' type="text" id="fname" name="fname"></input>
                </div>
                <div className='mt-2'>
                    <label htmlFor="cars">Show Again</label>
                    <select className='mx-3' name="cars" id="cars">
                        <option value="volvo">Yes</option>
                        <option value="saab">No</option>
                    </select>
                </div>
                <div className='text-center'>
                    <button type="button" className="btn btn-secondary" onClick={() => window.location.href=sessionStorage.getItem("tmpstore")}>Next</button>
                </div>
            </form>
        </div>
      </Modal>
    </div>
    </>
  )
}

export default ModalL;