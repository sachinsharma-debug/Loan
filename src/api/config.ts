import axios from 'axios';
// axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.baseURL = 'https://api-finance.prudent360.in/api/v1';

export function gettoken(){
    return JSON.parse(localStorage.getItem("fin_service_user")).token || ""; 
}


async function getMethod(endpoint:string) {
    let response={}
  try {
    response = await axios.get(endpoint,{
        headers: {  
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${gettoken()}`
        }       
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }


    return response;
}


async function postMethod(endpoint:string, data:any) {
    let response={}
  try {
    response = await axios.post(endpoint,data,{
        headers: {  
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${gettoken()}`
        }       
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }


    return response;
}



async function updateMethod(endpoint:string, data:any) {
    let response={}
  try {
    response = await axios.put(endpoint,data,{
        headers: {  
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${gettoken()}`
        }       
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }

    return response;
}



async function deleteMethod(endpoint:string) {
    let response={}
  try {
    response = await axios.patch(endpoint,{
        headers: {  
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${gettoken()}`
        }       
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }

    return response;
}

async function fileUploadMethod(endpoint:string,formData) {
    let response={}
  try {
    response = await axios.post(endpoint,formData,{
        headers: {  
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${gettoken()}`
        }       
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }

    return response;
}

export const API = {
    getMethod,
    postMethod,
    updateMethod,
    deleteMethod,
    fileUploadMethod
}








 