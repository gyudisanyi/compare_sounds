async function generalFetch(endpoint, method, bodyData = undefined) {
  const requestOptions = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  console.log("YOOOO", process.env.REACT_APP_API_URL+endpoint, method, bodyData);

  if (endpoint !== 'login') {
    const token = localStorage.getItem('token');
    requestOptions.headers.Authorization = `Bearer ${token}`;
  }

  
  if (bodyData !== undefined) { requestOptions.body = JSON.stringify(bodyData); }
  
  if (method === "PATCH") {
    console.log(method);
    requestOptions.body = bodyData;
    delete requestOptions.headers['Content-Type'];
  };
  
  const httpResponse = await fetch(`${process.env.REACT_APP_API_URL+endpoint}`, requestOptions);
  
  const response = await httpResponse.json();
  const { status } = httpResponse;
  const { message } = response;
  
  if (endpoint === 'login') {
    return response;
  }

  if(method === 'PATCH') {
    return response;
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
