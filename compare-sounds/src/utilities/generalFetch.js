async function generalFetch(endpoint, method, bodyData = undefined, uploads = undefined) {
  const requestOptions = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  console.log("YOOOO", endpoint, method, bodyData);

  if (endpoint !== 'login') {
    const token = localStorage.getItem('token');
    requestOptions.headers.Authorization = `Bearer ${token}`;
  }

  
  if (bodyData !== undefined && endpoint !== 'upload' ) { requestOptions.body = JSON.stringify(bodyData); }
  
  if (uploads !== undefined) {
    const reqFiles = new FormData();
    uploads.forEach((f)=>reqFiles.append("Files", f));
    requestOptions.body = reqFiles;
    delete requestOptions.headers.Accept;
    delete requestOptions.headers['Content-Type'];
    const token = localStorage.getItem('token');
    requestOptions.headers.Authorization = `Bearer ${token}`;
  };
  
  const httpResponse = await fetch(`${process.env.REACT_APP_API_URL+endpoint}`, requestOptions);
  const response = await httpResponse.json();
  const { status } = httpResponse;
  const { message } = response;
  
  if (endpoint === 'login') {
    return response;
  }

  if (endpoint === 'upload') {
    return httpResponse.json();
  }
  
  if (endpoint.substring(0,4) === 'sets' && method === 'GET') {
    return response;
  }

  if (endpoint === 'sets/new' && method === 'POST') {
    return response;
  }

  if (httpResponse.ok) {
    const { data } = response;
    return { data, message, status };
  }
  return { message, status };
}
export default generalFetch;
